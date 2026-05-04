import type { TestStatus } from '@/lib/webrtc'

interface Props {
  mos: number | null
  status: TestStatus
}

function mosToScore(mos: number): number {
  return Math.round(((mos - 1) / 4) * 100)
}

function getVerdict(mos: number): string {
  if (mos >= 4.3) return 'Call-ready'
  if (mos >= 3.6) return 'Good'
  if (mos >= 3.1) return 'Fair'
  return 'Poor'
}

const CIRCUMFERENCE = 364

export default function SignalGauge({ mos, status }: Props) {
  const score = mos !== null ? mosToScore(mos) : 0
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE
  const isActive = status === 'running' || status === 'done'
  const verdict = mos !== null ? getVerdict(mos) : ''

  return (
    <div className="bg-slate-950/50 border border-[#1a6b8a] p-6 flex flex-row lg:flex-col items-center justify-around lg:justify-between gap-4 lg:gap-0">
      <span className="text-xs font-bold tracking-widest uppercase text-[#1a6b8a] hidden lg:block">
        Signal Quality
      </span>

      {/* Mobile: label sits beside the gauge */}
      <span className="text-xs font-bold tracking-widest uppercase text-[#1a6b8a] lg:hidden shrink-0">
        Signal Quality
      </span>

      <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="transparent"
            stroke="rgba(26,107,138,0.2)"
            strokeWidth="4"
          />
          <circle
            cx="64"
            cy="64"
            r="58"
            fill="transparent"
            stroke={isActive ? '#89dc12' : 'transparent'}
            strokeWidth="4"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={isActive ? offset : CIRCUMFERENCE}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`text-2xl font-bold ${isActive ? 'text-[#89dc12]' : 'text-slate-600'}`}
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {isActive ? score : '—'}
          </span>
          <span className="text-[8px] font-bold tracking-widest uppercase text-[#1a6b8a]">
            Score
          </span>
        </div>
      </div>

      <div className="text-center lg:text-center">
        <p
          className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${
            isActive ? 'text-[#89dc12]' : 'text-slate-600'
          } ${status === 'running' ? 'animate-pulse' : ''}`}
        >
          {status === 'running'
            ? '// Analysing…'
            : status === 'done' && verdict
            ? `// ${verdict}`
            : '// Awaiting test'}
        </p>
      </div>
    </div>
  )
}
