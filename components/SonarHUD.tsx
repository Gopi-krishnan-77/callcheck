import type { TestStatus } from '@/lib/webrtc'

interface Props {
  status: TestStatus
  mos: number | null
  onStart: () => void
}

export default function SonarHUD({ status, mos, onStart }: Props) {
  const isRunning = status === 'running'
  const isDone = status === 'done'

  const centerValue = isDone && mos !== null ? mos.toFixed(1) : isRunning && mos !== null ? mos.toFixed(1) : '—'
  const centerLabel = isDone || isRunning ? 'MOS Score' : 'Ready'

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-72 h-72 rounded-full border border-[#1a6b8a]/30 flex items-center justify-center">
        {/* Outer ring */}
        <div className="absolute inset-[-20px] rounded-full border border-[#1a6b8a]/10" />
        {/* Radar circles */}
        <div className="absolute w-56 h-56 rounded-full border border-[#1a6b8a]/40" />
        <div className="absolute w-36 h-36 rounded-full border border-[#1a6b8a]/40" />
        <div className="absolute w-14 h-14 rounded-full border border-[#1a6b8a]/40" />
        {/* Crosshairs */}
        <div className="absolute w-full h-[1px] bg-[#1a6b8a]/20" />
        <div className="absolute w-[1px] h-full bg-[#1a6b8a]/20" />
        {/* Rotating sweep — always animating, more visible when running */}
        <div
          className={`absolute inset-0 sonar-sweep rounded-full animate-spin-slow transition-opacity duration-500 ${
            isRunning ? 'opacity-100' : 'opacity-30'
          }`}
        />
        {/* Blips */}
        <div
          className={`absolute top-1/4 left-1/3 w-2 h-2 bg-[#89dc12] rounded-full shadow-[0_0_10px_#89dc12] transition-opacity ${
            isRunning ? 'opacity-80' : 'opacity-30'
          }`}
        />
        <div
          className={`absolute bottom-1/3 right-1/4 w-1.5 h-1.5 bg-[#89dc12] rounded-full shadow-[0_0_10px_#89dc12] transition-opacity ${
            isRunning ? 'opacity-50' : 'opacity-20'
          }`}
        />
        {/* Center */}
        <div className="z-20 text-center">
          <div className="text-3xl font-bold text-[#89dc12] tracking-widest" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {centerValue}
          </div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#1a6b8a] mt-1">
            {centerLabel}
          </div>
        </div>
      </div>

      <div className="mt-10">
        {status === 'idle' || status === 'error' ? (
          <button
            onClick={onStart}
            className="px-12 py-4 border border-[#89dc12] text-[#89dc12] text-xs font-bold tracking-[0.4em] uppercase hover:bg-[#89dc12]/20 transition-all relative group overflow-hidden"
          >
            <span className="relative z-10">
              {status === 'error' ? 'Retry Test' : 'Start Test'}
            </span>
            <div className="absolute bottom-0 left-0 h-[2px] bg-[#89dc12] w-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
          </button>
        ) : status === 'running' ? (
          <div className="text-xs font-bold tracking-[0.3em] uppercase text-[#1a6b8a] animate-pulse">
            Testing — about 10 seconds…
          </div>
        ) : (
          <button
            onClick={onStart}
            className="px-12 py-4 border border-[#1a6b8a] text-[#1a6b8a] text-xs font-bold tracking-[0.4em] uppercase hover:border-[#89dc12] hover:text-[#89dc12] transition-all"
          >
            Run Again
          </button>
        )}
      </div>
    </div>
  )
}
