import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'CallCheck — Is your connection ready for calls?'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#020b18',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Sonar rings */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          viewBox="0 0 1200 630"
        >
          <circle cx="600" cy="315" r="280" fill="none" stroke="#1a6b8a" strokeWidth="1" opacity="0.3" />
          <circle cx="600" cy="315" r="200" fill="none" stroke="#1a6b8a" strokeWidth="1" opacity="0.25" />
          <circle cx="600" cy="315" r="120" fill="none" stroke="#1a6b8a" strokeWidth="1" opacity="0.2" />
          <line x1="0" y1="315" x2="1200" y2="315" stroke="#1a6b8a" strokeWidth="0.5" opacity="0.15" />
          <line x1="600" y1="0" x2="600" y2="630" stroke="#1a6b8a" strokeWidth="0.5" opacity="0.15" />
          {/* Sweep */}
          <line x1="600" y1="315" x2="870" y2="100" stroke="#89dc12" strokeWidth="2" opacity="0.6" />
          {/* Blip */}
          <circle cx="840" cy="130" r="12" fill="#89dc12" opacity="0.9" />
          <circle cx="840" cy="130" r="22" fill="none" stroke="#89dc12" strokeWidth="1.5" opacity="0.4" />
          {/* Radial glow */}
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#89dc12" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#020b18" stopOpacity="0" />
          </radialGradient>
          <rect x="0" y="0" width="1200" height="630" fill="url(#glow)" />
        </svg>

        {/* Content */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              fontSize: '96px',
              fontWeight: '700',
              color: '#89dc12',
              letterSpacing: '0.2em',
              textShadow: '0 0 40px rgba(137,220,18,0.4)',
              lineHeight: 1,
            }}
          >
            CALLCHECK
          </div>
          <div
            style={{
              fontSize: '28px',
              color: '#1a6b8a',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: '600',
            }}
          >
            Is your connection ready for calls?
          </div>
          <div
            style={{
              marginTop: '24px',
              display: 'flex',
              gap: '40px',
              fontSize: '18px',
              color: '#4a5568',
              letterSpacing: '0.1em',
            }}
          >
            <span style={{ color: '#89dc12' }}>Latency</span>
            <span>·</span>
            <span style={{ color: '#89dc12' }}>Jitter</span>
            <span>·</span>
            <span style={{ color: '#89dc12' }}>Packet Loss</span>
            <span>·</span>
            <span style={{ color: '#89dc12' }}>MOS Score</span>
          </div>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            fontSize: '16px',
            color: '#2d3748',
            letterSpacing: '0.1em',
          }}
        >
          callcheck.gopikrishnanb.co.in
        </div>
      </div>
    ),
    { ...size }
  )
}
