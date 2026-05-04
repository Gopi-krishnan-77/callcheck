import type { TestStatus } from '@/lib/webrtc'

interface Props {
  label: string
  value: string
  icon: string
  progress: number // 0–1
  status: TestStatus
  quality?: 'good' | 'warn' | 'bad'
}

const qualityColor = {
  good: '#89dc12',
  warn: '#f59e0b',
  bad: '#ef4444',
}

export default function MetricCard({ label, value, icon, progress, status, quality }: Props) {
  const barColor = quality ? qualityColor[quality] : '#89dc12'
  const isActive = status === 'running' || status === 'done'

  return (
    <div className="bg-slate-950/50 border border-[#1a6b8a] p-4 flex flex-col gap-2 group hover:border-[#89dc12] transition-colors">
      <div className="flex justify-between items-start">
        <span className="text-[10px] font-bold tracking-widest uppercase text-[#1a6b8a] group-hover:text-[#89dc12] transition-colors">
          {label}
        </span>
        <span className="material-symbols-outlined text-[#1a6b8a] text-sm">{icon}</span>
      </div>
      <div
        className={`text-3xl font-bold tracking-widest transition-colors ${
          isActive ? 'text-[#89dc12]' : 'text-slate-600'
        }`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {isActive ? value : '—'}
      </div>
      <div className="w-full bg-[#1a6b8a]/20 h-1 mt-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${status === 'running' ? 'animate-bar-pulse' : ''}`}
          style={{
            width: isActive ? `${Math.min(100, progress * 100)}%` : '0%',
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  )
}
