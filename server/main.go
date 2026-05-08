package main

import (
	"encoding/json"
	"log"
	"net"
	"net/http"
	"os"

	"github.com/pion/webrtc/v3"
)

// pionAPI is initialised once at startup with a fixed UDP port mux.
// All WebRTC connections share this single UDP port (Pion demuxes by ICE credentials).
var pionAPI *webrtc.API

func init() {
	udpPort := os.Getenv("UDP_PORT")
	if udpPort == "" {
		udpPort = "10000"
	}

	udpConn, err := net.ListenPacket("udp4", ":"+udpPort)
	if err != nil {
		log.Fatalf("Failed to bind UDP port %s: %v", udpPort, err)
	}

	udpMux := webrtc.NewICEUDPMux(nil, udpConn)

	se := webrtc.SettingEngine{}
	se.SetICEUDPMux(udpMux)

	// If running behind Fly.io NAT, tell Pion the machine's public IP so it
	// can put the correct address in ICE host candidates.
	// Set PUBLIC_IP via: fly secrets set PUBLIC_IP=<your-fly-ipv4>
	if publicIP := os.Getenv("PUBLIC_IP"); publicIP != "" {
		se.SetNAT1To1IPs([]string{publicIP}, webrtc.ICECandidateTypeHost)
		log.Printf("NAT 1:1 IP set to %s", publicIP)
	}

	pionAPI = webrtc.NewAPI(webrtc.WithSettingEngine(se))
	log.Printf("WebRTC UDP mux listening on :%s", udpPort)
}

type sdpMsg struct {
	Type string `json:"type"`
	SDP  string `json:"sdp"`
}

func handleOffer(w http.ResponseWriter, r *http.Request) {
	// CORS — Next.js proxy calls us server-to-server, but allow * for local dev.
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
		return
	}

	var offer sdpMsg
	if err := json.NewDecoder(r.Body).Decode(&offer); err != nil {
		http.Error(w, "Bad Request: "+err.Error(), http.StatusBadRequest)
		return
	}

	pc, err := pionAPI.NewPeerConnection(webrtc.Configuration{
		ICEServers: []webrtc.ICEServer{
			{URLs: []string{"stun:stun.l.google.com:19302"}},
			{URLs: []string{"stun:stun1.l.google.com:19302"}},
		},
	})
	if err != nil {
		log.Printf("NewPeerConnection error: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	// Clean up the peer connection when it disconnects.
	pc.OnConnectionStateChange(func(s webrtc.PeerConnectionState) {
		if s == webrtc.PeerConnectionStateFailed ||
			s == webrtc.PeerConnectionStateClosed ||
			s == webrtc.PeerConnectionStateDisconnected {
			pc.Close()
		}
	})

	// Browser opens the data channel; we receive it here and echo every message back.
	pc.OnDataChannel(func(dc *webrtc.DataChannel) {
		log.Printf("DataChannel opened: %q", dc.Label())
		dc.OnMessage(func(msg webrtc.DataChannelMessage) {
			if msg.IsString {
				_ = dc.SendText(string(msg.Data))
			} else {
				_ = dc.Send(msg.Data)
			}
		})
	})

	if err := pc.SetRemoteDescription(webrtc.SessionDescription{
		Type: webrtc.SDPTypeOffer,
		SDP:  offer.SDP,
	}); err != nil {
		log.Printf("SetRemoteDescription error: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		pc.Close()
		return
	}

	answer, err := pc.CreateAnswer(nil)
	if err != nil {
		log.Printf("CreateAnswer error: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		pc.Close()
		return
	}

	// Non-trickle ICE: wait for the full candidate list before responding.
	gatherDone := webrtc.GatheringCompletePromise(pc)

	if err := pc.SetLocalDescription(answer); err != nil {
		log.Printf("SetLocalDescription error: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		pc.Close()
		return
	}

	<-gatherDone // blocks until all ICE candidates are gathered

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(sdpMsg{
		Type: pc.LocalDescription().Type.String(),
		SDP:  pc.LocalDescription().SDP,
	}); err != nil {
		log.Printf("JSON encode error: %v", err)
	}
}

func main() {
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte("OK"))
	})
	http.HandleFunc("/offer", handleOffer)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("HTTP server listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
