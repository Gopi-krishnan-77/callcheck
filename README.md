# CallCheck

A free, in-browser tool that tests your network and tells you whether it's ready for VoIP and video calls — in plain English.

**Live:** [callcheck.gopikrishnanb.co.in](https://callcheck.gopikrishnanb.co.in)  
**Embed showcase:** [callcheck.gopikrishnanb.co.in/embed](https://callcheck.gopikrishnanb.co.in/embed)

---

## What it measures

| Metric | What it means | Good threshold |
|---|---|---|
| **Latency** | Round-trip time to a server | < 150ms |
| **Jitter** | How much latency varies between pings | < 30ms |
| **Packet Loss** | % of requests that never arrive | < 1% |
| **MOS Score** | Overall call quality, rated 1–5 (ITU E-model) | ≥ 4.3 |

## How it works

CallCheck sends 20 timed HTTP requests to Google's connectivity servers over ~10 seconds and measures each round-trip. No audio or video is captured — no microphone or camera access is required.

- **Latency** — average round-trip time across all pings
- **Jitter** — mean absolute deviation between consecutive pings
- **Packet Loss** — percentage of requests that time out
- **MOS** — calculated from the three above using the ITU E-model formula

Results can be shared via a URL that encodes the metrics as query parameters. Everything runs client-side — nothing is stored or sent to any server.

## Embeddable widget

Any website can embed the test as an iframe — one line of HTML, no JavaScript required.

```html
<iframe
  src="https://callcheck.gopikrishnanb.co.in/widget?accent=89dc12"
  width="380"
  height="560"
  frameborder="0"
  style="border-radius:4px;"
></iframe>
```

The `accent` param accepts any hex colour (without `#`) to match your brand. Visit [/embed](https://callcheck.gopikrishnanb.co.in/embed) for a live preview and colour presets.

## Stack

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — Google Fonts
- No backend, no database, no auth

## Running locally

```bash
git clone https://github.com/Gopi-krishnan-77/callcheck
cd callcheck
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|---|---|
| `/` | Main test page |
| `/embed` | Widget showcase with live preview and copy-paste embed code |
| `/widget` | Embeddable iframe (noindex) |
| `/opengraph-image` | Auto-generated OG image (1200×630) |
| `/robots.txt` | Crawl rules |
| `/sitemap.xml` | Sitemap |

## Deploying

Deployed on [Vercel](https://vercel.com). Push to `main` and Vercel auto-deploys.

---

Built by [Gopikrishnan](https://gopikrishnanb.co.in)
