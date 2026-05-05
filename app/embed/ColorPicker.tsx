'use client'

import { useState } from 'react'

const PRESETS = [
  { label: 'Lime', value: '89dc12' },
  { label: 'Cyan', value: '06b6d4' },
  { label: 'Violet', value: 'a855f7' },
  { label: 'Orange', value: 'f97316' },
  { label: 'White', value: 'ffffff' },
]

export default function ColorPicker() {
  const [accent, setAccent] = useState('89dc12')

  const embedCode = `<iframe
  src="https://callcheck.gopikrishnanb.co.in/widget?accent=${accent}"
  width="380"
  height="560"
  frameborder="0"
  style="border-radius:4px;"
></iframe>`

  return (
    <div className="flex flex-col gap-6">
      {/* Live preview */}
      <div className="flex flex-col gap-3">
        <div className="text-[10px] font-bold tracking-widest uppercase text-[#1a6b8a]">
          Live preview
        </div>
        <div className="border border-[#1a6b8a]/50 p-2 flex justify-center bg-slate-950/30">
          <iframe
            src={`/widget?accent=${accent}`}
            width={340}
            height={520}
            style={{ border: 'none', display: 'block' }}
            title="CallCheck widget preview"
          />
        </div>
      </div>

      {/* Color presets */}
      <div className="flex flex-col gap-3">
        <div className="text-[10px] font-bold tracking-widest uppercase text-[#1a6b8a]">
          Accent colour
        </div>
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => setAccent(p.value)}
              className={`flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase border transition-all ${
                accent === p.value
                  ? 'border-white text-white'
                  : 'border-slate-700 text-slate-500 hover:border-slate-500'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: `#${p.value}` }}
              />
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Embed code */}
      <div className="flex flex-col gap-3">
        <div className="text-[10px] font-bold tracking-widest uppercase text-[#1a6b8a]">
          Embed code
        </div>
        <pre className="bg-slate-950 border border-slate-800 p-4 text-xs text-[#89dc12] overflow-x-auto leading-relaxed">
          {embedCode}
        </pre>
        <CopyButton text={embedCode} />
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={copy}
      className="self-start flex items-center gap-2 px-4 py-2 border border-[#1a6b8a] text-[#1a6b8a] text-xs font-bold tracking-widest uppercase hover:border-[#89dc12] hover:text-[#89dc12] transition-all"
    >
      <span className="material-symbols-outlined text-sm">
        {copied ? 'check_circle' : 'content_copy'}
      </span>
      {copied ? 'Copied!' : 'Copy embed code'}
    </button>
  )
}
