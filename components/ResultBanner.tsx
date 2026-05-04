'use client'

import { useState } from 'react'
import type { Metrics } from '@/lib/webrtc'
import type { ConnectionTag } from '@/lib/history'
import { buildShareUrl } from '@/lib/history'

interface Props {
  metrics: Metrics
  tag: ConnectionTag
}

function getVerdict(mos: number): { label: string; description: string; color: string } {
  if (mos >= 4.3)
    return {
      label: 'Excellent',
      description: 'Your connection is in great shape for calls and video.',
      color: '#89dc12',
    }
  if (mos >= 3.6)
    return {
      label: 'Good',
      description: 'Most calls will work fine. You may rarely notice any issues.',
      color: '#89dc12',
    }
  if (mos >= 3.1)
    return {
      label: 'Fair',
      description: 'Calls should work but you may notice occasional choppy audio.',
      color: '#f59e0b',
    }
  return {
    label: 'Poor',
    description: 'Your connection will likely cause problems on calls.',
    color: '#ef4444',
  }
}

export default function ResultBanner({ metrics, tag }: Props) {
  const [copied, setCopied] = useState(false)
  const verdict = getVerdict(metrics.mos)

  async function copyLink() {
    const url = buildShareUrl(metrics, tag)
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border p-6 flex flex-col gap-4 mt-8" style={{ borderColor: verdict.color }}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#1a6b8a] mb-1">
            Verdict
          </div>
          <div className="text-2xl font-bold" style={{ color: verdict.color }}>
            {verdict.label}
          </div>
          <div className="text-sm text-slate-400 mt-1 max-w-md">{verdict.description}</div>
        </div>
        <button
          onClick={copyLink}
          className="flex items-center gap-2 px-4 py-2 border border-[#1a6b8a] text-[#1a6b8a] text-xs font-bold tracking-widest uppercase hover:border-[#89dc12] hover:text-[#89dc12] transition-all"
        >
          <span className="material-symbols-outlined text-sm">
            {copied ? 'check_circle' : 'link'}
          </span>
          {copied ? 'Link copied!' : 'Copy link'}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2 pt-4 border-t border-slate-800">
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#1a6b8a] mb-1">
            Latency
          </div>
          <div className="text-sm text-slate-300">
            {metrics.latency < 150
              ? 'Good. Low delay means conversations feel natural.'
              : metrics.latency < 300
              ? 'Moderate. You may notice a slight delay.'
              : 'High. Conversations will feel noticeably delayed.'}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#1a6b8a] mb-1">
            Jitter
          </div>
          <div className="text-sm text-slate-300">
            {metrics.jitter < 30
              ? 'Stable. Audio will arrive evenly and sound clear.'
              : metrics.jitter < 50
              ? 'Some variation. Occasional wobble in audio is possible.'
              : 'Unstable. Choppy or robotic audio is likely.'}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#1a6b8a] mb-1">
            Packet Loss
          </div>
          <div className="text-sm text-slate-300">
            {metrics.packetLoss < 1
              ? 'Excellent. Almost nothing is being dropped.'
              : metrics.packetLoss < 3
              ? 'Acceptable. A small amount of loss is normal.'
              : 'Too high. This will cause noticeable audio gaps.'}
          </div>
        </div>
      </div>
    </div>
  )
}
