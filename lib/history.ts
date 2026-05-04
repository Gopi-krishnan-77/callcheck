import type { Metrics } from './webrtc'

export type ConnectionTag = 'wifi' | 'ethernet' | 'mobile' | null

export interface HistoryEntry {
  timestamp: number
  tag: ConnectionTag
  metrics: Metrics
}

const STORAGE_KEY = 'callcheck_history'
const MAX_ENTRIES = 5

export function saveRun(entry: HistoryEntry): void {
  const existing = loadHistory()
  existing.unshift(entry)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, MAX_ENTRIES)))
  } catch {}
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
  } catch {
    return []
  }
}

export function buildShareUrl(metrics: Metrics, tag: ConnectionTag): string {
  const params = new URLSearchParams({
    mos: metrics.mos.toString(),
    lat: metrics.latency.toString(),
    jit: metrics.jitter.toString(),
    loss: metrics.packetLoss.toString(),
  })
  if (tag) params.set('tag', tag)
  return `${window.location.origin}/?${params.toString()}`
}

export function parseShareParams(): { metrics: Metrics; tag: ConnectionTag } | null {
  const params = new URLSearchParams(window.location.search)
  const mos = parseFloat(params.get('mos') ?? '')
  const lat = parseInt(params.get('lat') ?? '')
  const jit = parseFloat(params.get('jit') ?? '')
  const loss = parseFloat(params.get('loss') ?? '')
  if ([mos, lat, jit, loss].some(isNaN)) return null
  const rawTag = params.get('tag')
  const tag: ConnectionTag =
    rawTag === 'wifi' || rawTag === 'ethernet' || rawTag === 'mobile' ? rawTag : null
  return { metrics: { mos, latency: lat, jitter: jit, packetLoss: loss }, tag }
}
