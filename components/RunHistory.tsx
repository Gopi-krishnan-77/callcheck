'use client'

import { useState } from 'react'
import type { HistoryEntry } from '@/lib/history'

function timeAgo(ts: number): string {
  const diff = Date.now() - ts
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const TAG_LABELS: Record<string, string> = {
  wifi: 'WiFi',
  ethernet: 'Ethernet',
  mobile: 'Mobile',
}

function mosColor(mos: number): string {
  if (mos >= 4.3) return '#89dc12'
  if (mos >= 3.1) return '#f59e0b'
  return '#ef4444'
}

export default function RunHistory({ entries }: { entries: HistoryEntry[] }) {
  const [open, setOpen] = useState(false)

  if (entries.length === 0) return null

  return (
    <div className="mt-8 border border-slate-800">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3 text-[10px] font-bold tracking-widest uppercase text-slate-500 hover:text-slate-300 transition-colors"
      >
        <span>Previous runs ({entries.length})</span>
        <span className="material-symbols-outlined text-sm">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div className="border-t border-slate-800 divide-y divide-slate-800/60">
          {entries.map((entry, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-3 text-xs text-slate-400 hover:bg-slate-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: mosColor(entry.metrics.mos) }}
                >
                  {entry.metrics.mos.toFixed(1)}
                </span>
                <span className="text-slate-600">MOS</span>
                {entry.tag && (
                  <span className="text-[10px] font-bold tracking-wider border border-slate-700 px-1.5 py-0.5">
                    {TAG_LABELS[entry.tag]}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-slate-600 text-[11px]">
                <span>{entry.metrics.latency}ms</span>
                <span>{entry.metrics.jitter}ms jitter</span>
                <span>{entry.metrics.packetLoss}% loss</span>
                <span className="text-slate-700">{timeAgo(entry.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
