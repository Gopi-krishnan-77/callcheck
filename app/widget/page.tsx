'use client'

import { useState, useCallback, useEffect } from 'react'
import SonarHUD from '@/components/SonarHUD'
import MetricCard from '@/components/MetricCard'
import { runTest, type TestStatus, type Metrics } from '@/lib/webrtc'

const DEFAULT_METRICS: Metrics = { latency: 0, jitter: 0, packetLoss: 0, mos: 0 }

function latencyProgress(ms: number) { return Math.min(1, ms / 300) }
function jitterProgress(ms: number) { return Math.min(1, ms / 100) }
function lossProgress(pct: number) { return Math.min(1, pct / 5) }
function mosProgress(mos: number) { return Math.min(1, (mos - 1) / 4) }
function metricQuality(v: number, t: [number, number]): 'good' | 'warn' | 'bad' {
  return v <= t[0] ? 'good' : v <= t[1] ? 'warn' : 'bad'
}

function getVerdict(mos: number) {
  if (mos >= 4.3) return { label: 'Excellent', color: '#89dc12' }
  if (mos >= 3.6) return { label: 'Good', color: '#89dc12' }
  if (mos >= 3.1) return { label: 'Fair', color: '#f59e0b' }
  return { label: 'Poor', color: '#ef4444' }
}

export default function WidgetPage() {
  const [status, setStatus] = useState<TestStatus>('idle')
  const [metrics, setMetrics] = useState<Metrics>(DEFAULT_METRICS)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [accent, setAccent] = useState('#89dc12')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const raw = params.get('accent')
    if (raw) setAccent(`#${raw.replace('#', '')}`)
  }, [])

  const startTest = useCallback(async () => {
    setMetrics(DEFAULT_METRICS)
    setErrorMsg(null)
    await runTest({
      onStatus: setStatus,
      onMetrics: setMetrics,
      onHistorySample: () => {},
      onError: setErrorMsg,
    })
  }, [])

  const hasMos = metrics.mos > 0
  const verdict = hasMos ? getVerdict(metrics.mos) : null

  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0&display=swap"
      />
      <style>{`
        body { background-color: #020b18; margin: 0; }
        :root { --accent: ${accent}; }
      `}</style>

      <div className="min-h-screen flex flex-col items-center justify-between py-6 px-4 relative">
        <div className="fixed inset-0 pointer-events-none vignette z-10" />

        <div className="w-full max-w-sm relative z-20">
          {/* Wordmark */}
          <div className="text-center mb-4">
            <div
              className="text-2xl font-bold tracking-[0.2em]"
              style={{ color: accent, textShadow: `0 0 12px ${accent}66` }}
            >
              CALLCHECK
            </div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#1a6b8a] mt-1">
              Test your call quality
            </div>
          </div>

          {/* Sonar HUD — compact */}
          <SonarHUD
            status={status}
            mos={hasMos ? metrics.mos : null}
            onStart={startTest}
          />

          {errorMsg && (
            <p className="text-center text-red-400 text-xs mt-2">{errorMsg}</p>
          )}

          {/* Metric cards 2×2 */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <MetricCard label="Latency" value={`${metrics.latency}ms`} icon="speed"
              progress={latencyProgress(metrics.latency)} status={status}
              quality={metricQuality(metrics.latency, [150, 300])} />
            <MetricCard label="Jitter" value={`${metrics.jitter}ms`} icon="waves"
              progress={jitterProgress(metrics.jitter)} status={status}
              quality={metricQuality(metrics.jitter, [30, 50])} />
            <MetricCard label="Packet Loss" value={`${metrics.packetLoss}%`} icon="error_outline"
              progress={lossProgress(metrics.packetLoss)} status={status}
              quality={metricQuality(metrics.packetLoss, [1, 3])} />
            <MetricCard label="MOS Score" value={metrics.mos.toFixed(1)} icon="equalizer"
              progress={mosProgress(metrics.mos)} status={status}
              quality={metrics.mos >= 4.3 ? 'good' : metrics.mos >= 3.1 ? 'warn' : 'bad'} />
          </div>

          {/* Verdict */}
          {status === 'done' && verdict && (
            <div
              className="mt-4 px-4 py-3 border text-center"
              style={{ borderColor: verdict.color }}
            >
              <div className="text-lg font-bold" style={{ color: verdict.color }}>
                {verdict.label}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                MOS {metrics.mos.toFixed(1)} · {metrics.latency}ms · {metrics.jitter}ms jitter
              </div>
            </div>
          )}
        </div>

        {/* Powered by */}
        <a
          href="https://callcheck.gopikrishnanb.co.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-slate-600 hover:text-[#89dc12] transition-colors tracking-widest uppercase mt-6 relative z-20"
        >
          Powered by CallCheck
        </a>
      </div>
    </>
  )
}
