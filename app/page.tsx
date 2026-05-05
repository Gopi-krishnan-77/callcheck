'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import SonarHUD from '@/components/SonarHUD'
import MetricCard from '@/components/MetricCard'
import LatencyChart from '@/components/LatencyChart'
import SignalGauge from '@/components/SignalGauge'
import ResultBanner from '@/components/ResultBanner'
import HowItWorks from '@/components/HowItWorks'
import ConnectionTagPicker from '@/components/ConnectionTag'
import AppCompat from '@/components/AppCompat'
import ActionableTips from '@/components/ActionableTips'
import Footer from '@/components/Footer'
import { runTest, type TestStatus, type Metrics } from '@/lib/webrtc'
import { buildShareUrl, parseShareParams, type ConnectionTag } from '@/lib/history'

const DEFAULT_METRICS: Metrics = { latency: 0, jitter: 0, packetLoss: 0, mos: 0 }

function latencyProgress(ms: number) { return Math.min(1, ms / 300) }
function jitterProgress(ms: number) { return Math.min(1, ms / 100) }
function lossProgress(pct: number) { return Math.min(1, pct / 5) }
function mosProgress(mos: number) { return Math.min(1, (mos - 1) / 4) }

function metricQuality(value: number, thresholds: [number, number]): 'good' | 'warn' | 'bad' {
  if (value <= thresholds[0]) return 'good'
  if (value <= thresholds[1]) return 'warn'
  return 'bad'
}

export default function Home() {
  const [status, setStatus] = useState<TestStatus>('idle')
  const [metrics, setMetrics] = useState<Metrics>(DEFAULT_METRICS)
  const [history, setHistory] = useState<number[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [connectionTag, setConnectionTag] = useState<ConnectionTag>(null)
  const [sharedResult, setSharedResult] = useState<{ metrics: Metrics; tag: ConnectionTag } | null>(null)
  const initialized = useRef(false)

  // On mount: check for shared URL params
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const shared = parseShareParams()
    if (shared) {
      setSharedResult(shared)
      setMetrics(shared.metrics)
      setStatus('done')
      if (shared.tag) setConnectionTag(shared.tag)
      window.history.replaceState({}, '', '/')
    }
  }, [])

  const startTest = useCallback(async () => {
    setHistory([])
    setMetrics(DEFAULT_METRICS)
    setErrorMsg(null)
    setSharedResult(null)

    await runTest({
      onStatus: setStatus,
      onMetrics: setMetrics,
      onHistorySample: (rtt) => setHistory((prev) => [...prev, rtt]),
      onError: (msg) => setErrorMsg(msg),
    })
  }, [])


  const hasMos = metrics.mos > 0
  const isSharedView = sharedResult !== null && status === 'done'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'CallCheck',
    url: 'https://callcheck.gopikrishnanb.co.in',
    description: "Free in-browser tool that tests your network for VoIP and video calls — latency, jitter, packet loss and MOS score.",
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    author: { '@type': 'Person', name: 'Gopikrishnan', url: 'https://www.gopikrishnanb.co.in' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@400,0&display=swap"
      />
      <div className="fixed inset-0 pointer-events-none vignette z-10" />

      <Header />

      <main className="flex-1 mt-14 px-4 sm:px-8 py-8 max-w-5xl mx-auto w-full relative z-20">

        {/* Shared result notice */}
        {isSharedView && (
          <div className="mb-6 px-4 py-3 border border-[#1a6b8a]/50 text-sm text-[#1a6b8a] text-center">
            You&apos;re viewing a shared result.{' '}
            <button
              onClick={() => {
                setSharedResult(null)
                setStatus('idle')
                setMetrics(DEFAULT_METRICS)
                window.history.replaceState({}, '', '/')
              }}
              className="text-[#89dc12] underline underline-offset-2 hover:no-underline"
            >
              Run your own test
            </button>
          </div>
        )}

        {/* Hero */}
        <section className="mb-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-[#89dc12] tracking-[0.2em] drop-shadow-[0_0_12px_rgba(137,220,18,0.4)] mb-2">
            CALLCHECK
          </h1>
          <p className="text-[#1a6b8a] tracking-widest text-sm font-bold uppercase">
            Is your connection ready for calls?
          </p>
        </section>

        {/* Connection picker + Sonar HUD */}
        {!isSharedView && (
          <ConnectionTagPicker
            value={connectionTag}
            onChange={setConnectionTag}
            disabled={status === 'running'}
          />
        )}
        <SonarHUD status={status} mos={hasMos ? metrics.mos : null} onStart={startTest} />

        {/* Error */}
        {errorMsg && (
          <p className="text-center text-red-400 text-sm mb-4">{errorMsg}</p>
        )}

        {/* Metric Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
          <MetricCard
            label="Latency"
            value={`${metrics.latency}ms`}
            icon="speed"
            progress={latencyProgress(metrics.latency)}
            status={status}
            quality={metricQuality(metrics.latency, [150, 300])}
          />
          <MetricCard
            label="Jitter"
            value={`${metrics.jitter}ms`}
            icon="waves"
            progress={jitterProgress(metrics.jitter)}
            status={status}
            quality={metricQuality(metrics.jitter, [30, 50])}
          />
          <MetricCard
            label="Packet Loss"
            value={`${metrics.packetLoss}%`}
            icon="error_outline"
            progress={lossProgress(metrics.packetLoss)}
            status={status}
            quality={metricQuality(metrics.packetLoss, [1, 3])}
          />
          <MetricCard
            label="MOS Score"
            value={metrics.mos.toFixed(1)}
            icon="equalizer"
            progress={mosProgress(metrics.mos)}
            status={status}
            quality={metrics.mos >= 4.3 ? 'good' : metrics.mos >= 3.1 ? 'warn' : 'bad'}
          />
        </section>

        {/* Chart + Gauge */}
        {!isSharedView && (
          <section className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-slate-950/50 border border-[#1a6b8a] p-4 sm:p-6 relative overflow-hidden">
              <div className="scanline absolute inset-0 opacity-10 pointer-events-none" />
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold tracking-widest uppercase text-[#89dc12] underline decoration-[#1a6b8a] underline-offset-8">
                  Latency over time
                </h3>
                <span className="text-[10px] font-bold text-[#1a6b8a]">
                  {history.length > 0 ? `${history.length} samples` : 'Awaiting test'}
                </span>
              </div>
              <LatencyChart history={history} />
            </div>
            <SignalGauge mos={hasMos ? metrics.mos : null} status={status} />
          </section>
        )}

        {/* Post-test panels */}
        {status === 'done' && hasMos && (
          <>
            <ResultBanner metrics={metrics} tag={connectionTag} />
            <ActionableTips metrics={metrics} tag={connectionTag} />
            <AppCompat metrics={metrics} />
          </>
        )}

        <HowItWorks />
      </main>

      <Footer />
    </>
  )
}
