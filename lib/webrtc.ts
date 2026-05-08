export type TestStatus = 'idle' | 'running' | 'done' | 'error'

export interface Metrics {
  latency: number
  jitter: number
  packetLoss: number
  mos: number
}

export interface TestCallbacks {
  onMetrics: (metrics: Metrics) => void
  onHistorySample: (rtt: number) => void
  onStatus: (status: TestStatus) => void
  onError: (msg: string) => void
}

// ─── Constants ───────────────────────────────────────────────────────────────

const TOTAL_PINGS      = 50    // packets to send
const PING_INTERVAL_MS = 200   // 50 × 200 ms = 10 s total
const GATHER_TIMEOUT   = 15000 // ms to wait for ICE gathering
const CONNECT_TIMEOUT  = 15000 // ms to wait for data channel open
const DRAIN_WAIT       = 1000  // ms after last ping to wait for late echoes

// ─── Metric helpers ──────────────────────────────────────────────────────────

function calcJitter(rtts: number[]): number {
  if (rtts.length < 2) return 0
  let sum = 0
  for (let i = 1; i < rtts.length; i++) sum += Math.abs(rtts[i] - rtts[i - 1])
  return sum / (rtts.length - 1)
}

function calcMOS(latencyMs: number, jitterMs: number, packetLossPercent: number): number {
  const effectiveLatency = latencyMs + jitterMs * 2 + 10
  let R =
    effectiveLatency < 160
      ? 93.2 - effectiveLatency / 40
      : 93.2 - effectiveLatency / 120 - 10
  R -= packetLossPercent * 2.5
  R = Math.max(0, Math.min(100, R))
  const mos = 1 + 0.035 * R + R * (R - 60) * (100 - R) * 7e-6
  return parseFloat(Math.max(1, Math.min(5, mos)).toFixed(1))
}

// ─── WebRTC helpers ──────────────────────────────────────────────────────────

/** Wait for ICE gathering to reach 'complete'. Call BEFORE setLocalDescription. */
function waitForGatherComplete(pc: RTCPeerConnection): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error('ICE gathering timed out')),
      GATHER_TIMEOUT,
    )
    const done = () => { clearTimeout(timer); resolve() }

    if (pc.iceGatheringState === 'complete') { done(); return }

    pc.onicegatheringstatechange = () => {
      if (pc.iceGatheringState === 'complete') {
        pc.onicegatheringstatechange = null
        done()
      }
    }
  })
}

/** Wait for a data channel to reach the 'open' state. */
function waitForOpen(dc: RTCDataChannel): Promise<void> {
  return new Promise((resolve, reject) => {
    if (dc.readyState === 'open') { resolve(); return }
    const timer = setTimeout(
      () => reject(new Error('Data channel did not open in time')),
      CONNECT_TIMEOUT,
    )
    dc.onopen  = () => { clearTimeout(timer); resolve() }
    dc.onerror = () => { clearTimeout(timer); reject(new Error('Data channel error')) }
  })
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function runTest(callbacks: TestCallbacks): Promise<void> {
  callbacks.onStatus('running')

  // 1. Create peer connection.
  //    ordered:false + maxRetransmits:0 = unreliable channel (like UDP — no retransmit)
  const pc = new RTCPeerConnection({
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  })
  const dc = pc.createDataChannel('echo', { ordered: false, maxRetransmits: 0 })

  // 2. Create offer; register gathering listener BEFORE setLocalDescription
  //    to avoid the race where ICE completes instantly.
  const offer = await pc.createOffer()
  const gatherDone = waitForGatherComplete(pc)
  await pc.setLocalDescription(offer)

  try {
    await gatherDone
  } catch {
    callbacks.onError('Could not gather ICE candidates. Check your network.')
    callbacks.onStatus('error')
    pc.close()
    return
  }

  // 3. Exchange SDP with the Pion echo server via the Next.js signal proxy.
  let answer: RTCSessionDescriptionInit
  try {
    const res = await fetch('/api/signal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: pc.localDescription!.type,
        sdp:  pc.localDescription!.sdp,
      }),
    })
    if (!res.ok) throw new Error(`Signal error ${res.status}`)
    answer = await res.json() as RTCSessionDescriptionInit
  } catch {
    callbacks.onError('Could not reach test server. Try again later.')
    callbacks.onStatus('error')
    pc.close()
    return
  }

  await pc.setRemoteDescription(answer)

  // 4. Wait for the data channel to open — this confirms UDP is flowing.
  try {
    await waitForOpen(dc)
  } catch {
    callbacks.onError('WebRTC connection failed. UDP may be blocked on your network.')
    callbacks.onStatus('error')
    pc.close()
    return
  }

  // 5. Ping loop — send TOTAL_PINGS timestamped frames, server echoes each one back.
  const pending = new Map<number, number>() // seq → send timestamp
  const rtts: number[] = []
  let sent     = 0
  let received = 0

  function updateMetrics() {
    const avgRtt = rtts.reduce((a, b) => a + b, 0) / rtts.length
    const jitter  = calcJitter(rtts)
    const loss    = ((sent - received) / Math.max(sent, 1)) * 100
    callbacks.onMetrics({
      latency:    Math.round(avgRtt / 2), // RTT/2 = one-way estimate
      jitter:     parseFloat(jitter.toFixed(1)),
      packetLoss: parseFloat(loss.toFixed(1)),
      mos:        calcMOS(avgRtt / 2, jitter, loss),
    })
  }

  dc.onmessage = (event: MessageEvent<string>) => {
    const { seq } = JSON.parse(event.data) as { seq: number }
    const sendTime = pending.get(seq)
    if (sendTime === undefined) return
    pending.delete(seq)

    const rtt = performance.now() - sendTime
    rtts.push(rtt)
    received++

    callbacks.onHistorySample(rtt / 2) // one-way estimate for histogram

    // Push a live update every 5 received pings
    if (rtts.length % 5 === 0 || rtts.length === TOTAL_PINGS) updateMetrics()
  }

  for (let seq = 0; seq < TOTAL_PINGS; seq++) {
    if (dc.readyState !== 'open') break
    const t = performance.now()
    pending.set(seq, t)
    dc.send(JSON.stringify({ seq, t }))
    sent++
    await new Promise<void>((r) => setTimeout(r, PING_INTERVAL_MS))
  }

  // 6. Brief drain window to catch any late-arriving echoes.
  await new Promise<void>((r) => setTimeout(r, DRAIN_WAIT))

  // 7. Final metric push to include pings received during the drain window.
  if (rtts.length > 0) updateMetrics()

  pc.close()

  if (rtts.length === 0) {
    callbacks.onError('No responses from test server. UDP may be blocked on your network.')
    callbacks.onStatus('error')
    return
  }

  callbacks.onStatus('done')
}
