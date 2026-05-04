'use client'

import { useState } from 'react'

interface Props {
  history: number[]
  maxMs?: number
}

const SLOTS = 14

export default function LatencyChart({ history, maxMs = 300 }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [tapped, setTapped] = useState<number | null>(null)

  const padded = Array(Math.max(0, SLOTS - history.length))
    .fill(null)
    .concat(history.slice(-SLOTS))

  const peak = Math.max(...history, 1)
  const scale = Math.max(peak, maxMs)

  function barColor(val: number) {
    if (val < 100) return 'rgba(137, 220, 18, 0.7)'
    if (val < 200) return 'rgba(245, 158, 11, 0.7)'
    return 'rgba(239, 68, 68, 0.7)'
  }
  function barGlow(val: number) {
    if (val < 100) return '0 0 8px rgba(137, 220, 18, 0.4)'
    if (val < 200) return '0 0 8px rgba(245, 158, 11, 0.4)'
    return '0 0 8px rgba(239, 68, 68, 0.4)'
  }
  function tooltipColor(val: number) {
    if (val < 100) return '#89dc12'
    if (val < 200) return '#f59e0b'
    return '#ef4444'
  }

  // which bar is active (hover on desktop, tap on mobile)
  const activeIdx = hovered ?? tapped

  return (
    <div className="h-48 flex items-end gap-1 relative">
      {padded.map((val, i) => {
        if (val === null) {
          return <div key={i} className="w-full h-2 bg-[#1a6b8a]/20" />
        }

        const isActive = activeIdx === i

        return (
          <div
            key={i}
            className="relative w-full transition-all duration-300 cursor-pointer"
            style={{
              height: `${Math.max(4, (val / scale) * 100)}%`,
              backgroundColor: isActive
                ? barColor(val).replace('0.7', '1')
                : barColor(val),
              boxShadow: isActive
                ? barGlow(val).replace('0.4', '0.8')
                : barGlow(val),
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            onTouchStart={() => setTapped(i === tapped ? null : i)}
          >
            {/* Tooltip */}
            {isActive && (
              <div
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-[11px] font-bold whitespace-nowrap pointer-events-none z-50"
                style={{
                  color: tooltipColor(val),
                  border: `1px solid ${tooltipColor(val)}`,
                  backgroundColor: '#020b18',
                  boxShadow: `0 0 8px ${tooltipColor(val)}40`,
                }}
              >
                {Math.round(val)}ms
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
