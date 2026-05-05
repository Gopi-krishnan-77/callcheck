import ColorPicker from './ColorPicker'

export const metadata = {
  title: 'Embed CallCheck — Add call quality testing to your site',
  description:
    'Add a free VoIP call quality tester to any website in one line. Customisable accent colour, no JavaScript required.',
}

export default function EmbedPage() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0&display=swap"
      />

      <div className="min-h-screen bg-[#020b18] text-white px-6 py-16 max-w-4xl mx-auto">
        {/* Hero */}
        <div className="mb-14 text-center">
          <a
            href="/"
            className="inline-block text-[#1a6b8a] text-xs font-bold tracking-widest uppercase mb-8 hover:text-[#89dc12] transition-colors"
          >
            ← Back to CallCheck
          </a>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#89dc12] tracking-[0.15em] drop-shadow-[0_0_12px_rgba(137,220,18,0.4)] mb-4">
            EMBED CALLCHECK
          </h1>
          <p className="text-[#1a6b8a] text-sm font-bold tracking-widest uppercase max-w-lg mx-auto">
            Give your users a free call quality test — straight from your site
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: steps */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 border border-[#89dc12] text-[#89dc12] text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1">Pick your accent colour</div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    Choose a colour that matches your brand. The widget will adapt its glow and highlights.
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 border border-[#89dc12] text-[#89dc12] text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1">Copy the embed code</div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    One{' '}
                    <code className="bg-slate-900 px-1 text-[#89dc12]">&lt;iframe&gt;</code> tag.
                    Drop it anywhere in your HTML — no scripts, no dependencies.
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 border border-[#89dc12] text-[#89dc12] text-xs font-bold flex items-center justify-center">
                  3
                </div>
                <div>
                  <div className="text-sm font-bold text-white mb-1">Your users run the test</div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    They see latency, jitter, packet loss, and MOS score — and whether their connection is call-ready. No sign-up, no data stored.
                  </div>
                </div>
              </div>
            </div>

            {/* Why section */}
            <div className="border border-[#1a6b8a]/40 p-5 flex flex-col gap-3">
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#1a6b8a]">
                Why add this?
              </div>
              <ul className="flex flex-col gap-2">
                {[
                  'Reduce support tickets about call quality',
                  'Let users self-diagnose before blaming your platform',
                  'Free — always, no account needed',
                  'Lightweight: one iframe, no JS on your side',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-slate-400">
                    <span className="text-[#89dc12] mt-0.5 flex-shrink-0">·</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Built by */}
            <div className="text-xs text-slate-600">
              Built by{' '}
              <a
                href="https://www.gopikrishnanb.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#89dc12] transition-colors"
              >
                Gopikrishnan
              </a>
              {' '}· Questions?{' '}
              <a
                href="https://github.com/Gopi-krishnan-77"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#89dc12] transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Right: live preview + colour picker + embed code */}
          <ColorPicker />
        </div>
      </div>
    </>
  )
}
