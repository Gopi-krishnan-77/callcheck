export type TestStatus = 'idle' | 'running' | 'done' | 'error'

export interface Metrics {
  latency: number
  jitter: number
  packetLoss: number
  mos: number
}

export interface TestCallbacks {
  onMetrics: (metrics: Metrics) => void
  onHistorySample: (rtt: number) => void
  onStatus: (status: TestStatus) => void
  onError: (msg: string) => void
}

// Endpoints that return fast, tiny responses — good for ping timing
const PING_URLS = [
  'https://www.google.com/generate_204',
  'https://connectivitycheck.gstatic.com/generate_204',
  'https://www.gstatic.com/generate_204',
  'https://www.google.com/generate_204',
]

async function ping(url: string, timeoutMs = 4000): Promise<number | null> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const t0 = performance.now()
  try {
    await fetch(url, { mode: 'no-cors', cache: 'no-store', signal: controller.signal })
    clearTimeout(timer)
    return performance.now() - t0
  } catch {
    clearTimeout(timer)
    return null
  }
}

function calcJitter(samples: number[]): number {
  if (samples.length < 2) return 0
  // Mean absolute deviation of consecutive samples — closer to how jitter is defined in VoIP
  let sum = 0
  for (let i = 1; i < samples.length; i++) {
    sum += Math.abs(samples[i] - samples[i - 1])
  }
  return sum / (samples.length - 1)
}

function calcMOS(latencyMs: number, jitterMs: number, packetLossPercent: number): number {
  const effectiveLatency = latencyMs + jitterMs * 2 + 10
  let R =
    effectiveLatency < 160
      ? 93.2 - effectiveLatency / 40
      : 93.2 - effectiveLatency / 120 - 10
  R -= packetLossPercent * 2.5
  R = Math.max(0, Math.min(100, R))
  const mos = 1 + 0.035 * R + R * (R - 60) * (100 - R) * 7e-6
  return parseFloat(Math.max(1, Math.min(5, mos)).toFixed(1))
}

export async function runTest(callbacks: TestCallbacks): Promise<void> {
  callbacks.onStatus('running')

  // Warm-up request to establish TCP/TLS connection so measurements reflect actual RTT
  await ping(PING_URLS[0], 5000)

  const SAMPLES = 20
  const INTERVAL_MS = 500

  const successfulRtts: number[] = []
  let totalAttempts = 0
  let failedAttempts = 0

  for (let i = 0; i < SAMPLES; i++) {
    await new Promise((r) => setTimeout(r, INTERVAL_MS))

    const url = PING_URLS[i % PING_URLS.length]
    const rtt = await ping(url, 3000)
    totalAttempts++

    if (rtt === null) {
      failedAttempts++
    } else {
      successfulRtts.push(rtt)
      callbacks.onHistorySample(rtt)
    }

    if (successfulRtts.length === 0) continue

    const avgLatency = successfulRtts.reduce((a, b) => a + b, 0) / successfulRtts.length
    const jitter = calcJitter(successfulRtts)
    const packetLoss = (failedAttempts / totalAttempts) * 100

    callbacks.onMetrics({
      latency: Math.round(avgLatency),
      jitter: parseFloat(jitter.toFixed(1)),
      packetLoss: parseFloat(packetLoss.toFixed(1)),
      mos: calcMOS(avgLatency, jitter, packetLoss),
    })
  }

  if (successfulRtts.length === 0) {
    callbacks.onError('Could not reach test servers. Check your internet connection.')
    callbacks.onStatus('error')
    return
  }

  callbacks.onStatus('done')
}
