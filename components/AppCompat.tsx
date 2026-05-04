import type { Metrics } from '@/lib/webrtc'

interface App {
  name: string
  icon: string
  minMos: number
  maxLatency: number
  maxLoss: number
}

const APPS: App[] = [
  { name: 'Zoom', icon: 'videocam', minMos: 3.6, maxLatency: 200, maxLoss: 2 },
  { name: 'Google Meet', icon: 'duo', minMos: 3.5, maxLatency: 200, maxLoss: 2 },
  { name: 'MS Teams', icon: 'groups', minMos: 3.6, maxLatency: 200, maxLoss: 2 },
  { name: 'WhatsApp', icon: 'chat', minMos: 3.0, maxLatency: 300, maxLoss: 3 },
  { name: 'Discord', icon: 'headset_mic', minMos: 3.0, maxLatency: 300, maxLoss: 3 },
  { name: 'FaceTime', icon: 'phone_iphone', minMos: 3.5, maxLatency: 200, maxLoss: 2 },
]

function check(app: App, m: Metrics) {
  return m.mos >= app.minMos && m.latency <= app.maxLatency && m.packetLoss <= app.maxLoss
}

export default function AppCompat({ metrics }: { metrics: Metrics }) {
  return (
    <div className="mt-8 border border-[#1a6b8a]/50 p-6">
      <div className="text-[10px] font-bold tracking-widest uppercase text-[#1a6b8a] mb-4">
        App compatibility
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {APPS.map((app) => {
          const ok = check(app, metrics)
          return (
            <div
              key={app.name}
              className={`flex items-center gap-2 px-3 py-2 border text-xs font-bold transition-colors ${
                ok
                  ? 'border-[#89dc12]/40 text-[#89dc12] bg-[#89dc12]/5'
                  : 'border-red-500/30 text-red-400 bg-red-500/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm leading-none">{app.icon}</span>
              <span className="flex-1">{app.name}</span>
              <span>{ok ? '✓' : '✗'}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
