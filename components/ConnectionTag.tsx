import type { ConnectionTag } from '@/lib/history'

interface Props {
  value: ConnectionTag
  onChange: (tag: ConnectionTag) => void
  disabled?: boolean
}

const OPTIONS: { value: NonNullable<ConnectionTag>; label: string; icon: string }[] = [
  { value: 'wifi', label: 'WiFi', icon: 'wifi' },
  { value: 'ethernet', label: 'Ethernet', icon: 'settings_ethernet' },
  { value: 'mobile', label: 'Mobile', icon: 'signal_cellular_alt' },
]

export default function ConnectionTagPicker({ value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 mb-6">
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">
        Connection type
      </span>
      <div className="grid grid-cols-3 gap-2 w-full max-w-xs">
        {OPTIONS.map((opt) => {
          const active = value === opt.value
          return (
            <button
              key={opt.value}
              onClick={() => onChange(active ? null : opt.value)}
              disabled={disabled}
              className={`flex flex-col items-center gap-1 py-2 px-1 text-[10px] font-bold tracking-wider uppercase border transition-all ${
                active
                  ? 'border-[#89dc12] text-[#89dc12] bg-[#89dc12]/10'
                  : 'border-slate-700 text-slate-500 hover:border-[#1a6b8a] hover:text-slate-300'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span className="material-symbols-outlined text-base leading-none">{opt.icon}</span>
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
