import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://callcheck.gopikrishnanb.co.in'),
  title: {
    default: 'CallCheck — Is your connection ready for calls?',
    template: '%s | CallCheck',
  },
  description:
    "Free in-browser tool that tests your network and tells you if it's ready for VoIP and video calls — latency, jitter, packet loss and MOS score, in plain English.",
  keywords: [
    'VoIP test',
    'call quality test',
    'MOS score',
    'network latency test',
    'jitter test',
    'packet loss test',
    'internet speed test for calls',
    'video call quality',
    'WebRTC test',
  ],
  authors: [{ name: 'Gopikrishnan', url: 'https://www.gopikrishnanb.co.in' }],
  openGraph: {
    title: 'CallCheck — Is your connection ready for calls?',
    description:
      "Test your network for VoIP and video calls. Get latency, jitter, packet loss and MOS score — free, no sign-up.",
    url: 'https://callcheck.gopikrishnanb.co.in',
    siteName: 'CallCheck',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CallCheck — Is your connection ready for calls?',
    description:
      "Test your network for VoIP and video calls. Get latency, jitter, packet loss and MOS score — free, no sign-up.",
    images: ['/opengraph-image'],
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.className}>
      <body className="min-h-screen flex flex-col antialiased">{children}</body>
    </html>
  )
}
