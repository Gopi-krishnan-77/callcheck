import type { Metrics } from '@/lib/webrtc'
import type { ConnectionTag } from '@/lib/history'

interface Tip {
  icon: string
  text: string
}

function getTips(metrics: Metrics, tag: ConnectionTag): Tip[] {
  const tips: Tip[] = []

  if (metrics.packetLoss >= 1) {
    tips.push({
      icon: 'error_outline',
      text:
        tag === 'ethernet'
          ? 'Packet loss on a wired connection often means a bad cable or router issue. Try swapping the ethernet cable.'
          : 'Packet loss usually points to a weak WiFi signal or network congestion. Move closer to your router or switch to ethernet.',
    })
  }

  if (metrics.jitter >= 30) {
    tips.push({
      icon: 'waves',
      text:
        tag === 'ethernet'
          ? 'High jitter on ethernet can mean background downloads or a busy network. Try pausing other devices.'
          : 'WiFi is the most common cause of jitter. Switching to ethernet will likely fix this immediately.',
    })
  } else if (metrics.jitter >= 15 && tag === 'wifi') {
    tips.push({
      icon: 'waves',
      text: 'Your jitter is acceptable but not ideal. Ethernet would give you more stable audio on long calls.',
    })
  }

  if (metrics.latency >= 200) {
    tips.push({
      icon: 'speed',
      text: 'High latency can cause noticeable delay in conversations. Check if large downloads or streaming are running in the background.',
    })
  } else if (metrics.latency >= 100 && tag === 'mobile') {
    tips.push({
      icon: 'signal_cellular_alt',
      text: 'Mobile data latency is usually higher than WiFi or ethernet. Move to a stronger signal area if calls feel delayed.',
    })
  }

  if (tips.length === 0) {
    tips.push({
      icon: 'check_circle',
      text: "Your connection looks solid. No obvious issues to fix — you're good to go.",
    })
  }

  return tips
}

export default function ActionableTips({
  metrics,
  tag,
}: {
  metrics: Metrics
  tag: ConnectionTag
}) {
  const tips = getTips(metrics, tag)

  return (
    <div className="mt-6 space-y-3">
      <div className="text-[10px] font-bold tracking-widest uppercase text-[#1a6b8a]">
        What to do
      </div>
      {tips.map((tip, i) => (
        <div key={i} className="flex gap-3 items-start text-sm text-slate-300">
          <span className="material-symbols-outlined text-[#89dc12] text-base mt-0.5 shrink-0">
            {tip.icon}
          </span>
          <p className="leading-relaxed">{tip.text}</p>
        </div>
      ))}
    </div>
  )
}
