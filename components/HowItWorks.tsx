const metrics = [
  {
    icon: 'speed',
    name: 'Latency',
    tagline: 'How fast data travels to a server and back',
    good: 'Under 150ms',
    ok: '150–300ms',
    bad: 'Over 300ms',
    detail:
      'Latency is the delay between you speaking and the other person hearing it. Low latency makes conversations feel natural. High latency causes awkward pauses where you both start talking at the same time.',
  },
  {
    icon: 'waves',
    name: 'Jitter',
    tagline: 'How much your latency fluctuates',
    good: 'Under 30ms',
    ok: '30–50ms',
    bad: 'Over 50ms',
    detail:
      'Jitter happens when data packets arrive unevenly. Even if your average latency is fine, big swings between packets make audio sound choppy or robotic. A stable connection has low jitter.',
  },
  {
    icon: 'error_outline',
    name: 'Packet Loss',
    tagline: 'Data that never arrives',
    good: 'Under 1%',
    ok: '1–3%',
    bad: 'Over 3%',
    detail:
      'Every call breaks your voice into small chunks (packets) sent over the internet. If some don\'t arrive, you hear gaps or the audio cuts out. Even 1–2% loss is noticeable on calls.',
  },
  {
    icon: 'equalizer',
    name: 'MOS Score',
    tagline: 'The overall verdict for your call quality',
    good: '4.3 – 5.0',
    ok: '3.1 – 4.2',
    bad: 'Below 3.1',
    detail:
      'MOS (Mean Opinion Score) is the industry-standard measure for voice call quality, rated 1–5. It combines latency, jitter, and packet loss into one number using a formula developed by the ITU. Anything above 4.0 is considered excellent.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mt-16 pb-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-[#89dc12] tracking-widest uppercase mb-2">
          What are we measuring?
        </h2>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          CallCheck runs 20 timed requests to Google's servers and uses the results to estimate
          how your connection will handle a real voice or video call.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {metrics.map((m) => (
          <div
            key={m.name}
            className="bg-slate-950/50 border border-[#1a6b8a]/50 p-6 hover:border-[#1a6b8a] transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="material-symbols-outlined text-[#89dc12]">{m.icon}</span>
              <div>
                <div className="font-bold text-[#89dc12] text-sm tracking-wider uppercase">
                  {m.name}
                </div>
                <div className="text-[11px] text-[#1a6b8a] uppercase tracking-widest">
                  {m.tagline}
                </div>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">{m.detail}</p>
            <div className="flex gap-3 text-[11px] font-bold tracking-wider">
              <span className="text-[#89dc12]">✓ {m.good}</span>
              <span className="text-amber-400">~ {m.ok}</span>
              <span className="text-red-400">✗ {m.bad}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-slate-950/30 border border-slate-800 p-5 text-sm text-slate-400 leading-relaxed">
        <span className="text-[#1a6b8a] font-bold uppercase tracking-wider text-xs">
          How the test works ·{' '}
        </span>
        CallCheck sends 20 timed HTTP requests to Google's connectivity servers over about 10
        seconds and measures how long each round trip takes. Jitter is calculated from how much
        those times vary. Packet loss is counted when a request times out. No audio or video is
        captured — no microphone or camera access is needed.
      </div>
    </section>
  )
}
