import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const mediaServerUrl = process.env.MEDIA_SERVER_URL
  if (!mediaServerUrl) {
    return NextResponse.json(
      { error: 'Media server not configured' },
      { status: 503 }
    )
  }

  try {
    const offer = await req.json()
    const res = await fetch(`${mediaServerUrl}/offer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer),
    })

    if (!res.ok) {
      throw new Error(`Media server responded with ${res.status}`)
    }

    const answer = await res.json()
    return NextResponse.json(answer)
  } catch (err) {
    console.error('[signal] proxy error:', err)
    return NextResponse.json(
      { error: 'Signal server unavailable' },
      { status: 502 }
    )
  }
}
