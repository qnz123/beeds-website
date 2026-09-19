import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// "The full reading, in your inbox" — the Speed Reading's lead-capture step.
// The visitor already saw their result on-page; this sends a leave-behind
// email (their numbers + the three fixes we'd make first) and notifies the
// studio of the lead. Score/metrics are client-echoed values from our own
// prior /api/speed-check response (same trust boundary as BookingCalendar's
// client-echoed fields) — bounded, typed, and esc()'d before interpolation.

export const runtime = 'nodejs'

const STUDIO_EMAIL = process.env.STUDIO_EMAIL ?? 'booking@beedstu.com'
const FROM = process.env.RESEND_FROM ?? 'BEEDS <booking@beedstu.com>'

const EmailReportSchema = z.object({
  email: z.string().trim().email().max(200),
  company: z.string().max(200).optional().default(''), // honeypot
  url: z.string().trim().url().max(2048),
  score: z.number().int().min(0).max(100),
  tier: z.string().trim().max(60),
  metrics: z.object({
    lcp: z.string().trim().max(50),
    cls: z.string().trim().max(50),
    tbt: z.string().trim().max(50),
  }),
  fixes: z.array(z.string().trim().max(240)).max(3).default([]),
})

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function shell(inner: string) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:#f5f5f5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border:1px solid #000000;">
<tr><td style="padding:26px 32px 18px;border-bottom:1px solid #000000;">
<span style="font-family:'Times New Roman',Times,serif;font-size:22px;letter-spacing:3px;color:#000000;">BEEDS</span>
</td></tr>
<tr><td style="padding:28px 32px;font-family:'Times New Roman',Times,serif;color:#111111;font-size:16px;line-height:1.7;">
${inner}
</td></tr>
<tr><td style="padding:16px 32px;border-top:1px solid #000000;font-family:'Times New Roman',Times,serif;font-size:12px;color:#666666;">
BEEDS — Creative Studio · <a href="https://beedstu.com" style="color:#666666;text-decoration:underline;">beedstu.com</a>
</td></tr>
</table></td></tr></table></body></html>`
}

async function sendEmail(payload: {
  to: string[]
  subject: string
  html: string
  text: string
  reply_to?: string
}) {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not configured')
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, ...payload }),
  })
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = EmailReportSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  const r = parsed.data

  // Honeypot: accept silently, send nothing.
  if (parsed.data.company.trim()) return NextResponse.json({ ok: true })

  // Log the lead FIRST — recoverable from logs even if Resend hiccups.
  console.log(`[speed-reading lead] ${r.email} — ${r.url} — score ${r.score}`)

  const fixesHtml = r.fixes.length
    ? `<p style="margin:18px 0 6px;"><strong>The three fixes we&rsquo;d make first:</strong></p>
<ol style="margin:0 0 6px;padding-left:20px;">${r.fixes
        .map((f) => `<li style="margin:6px 0;">${esc(f)}</li>`)
        .join('')}</ol>`
    : ''

  const visitorHtml = shell(`
<p style="margin:0 0 14px;letter-spacing:2px;font-size:12px;text-transform:uppercase;color:#666666;">The Speed Reading</p>
<p style="margin:0 0 6px;font-size:40px;line-height:1;">${r.score}<span style="font-size:16px;color:#666666;"> /100 &mdash; ${esc(r.tier)}</span></p>
<p style="margin:0 0 18px;color:#666666;">${esc(r.url)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-family:'Times New Roman',Times,serif;font-size:15px;">
<tr><td style="padding:8px 0;border-top:1px solid #000;">Content appears (LCP)</td><td align="right" style="padding:8px 0;border-top:1px solid #000;">${esc(r.metrics.lcp)}</td></tr>
<tr><td style="padding:8px 0;border-top:1px solid #ddd;">Layout shift (CLS)</td><td align="right" style="padding:8px 0;border-top:1px solid #ddd;">${esc(r.metrics.cls)}</td></tr>
<tr><td style="padding:8px 0;border-top:1px solid #ddd;border-bottom:1px solid #000;">Main-thread blocking (TBT)</td><td align="right" style="padding:8px 0;border-top:1px solid #ddd;border-bottom:1px solid #000;">${esc(r.metrics.tbt)}</td></tr>
</table>
${fixesHtml}
<p style="margin:22px 0 0;">Measured by Google&rsquo;s PageSpeed Insights; interpreted by BEEDS. When you&rsquo;re ready to fix it properly:</p>
<p style="margin:12px 0 0;"><a href="https://beedstu.com/booking/" style="color:#000000;">Book the conversation &rarr;</a></p>
`)

  const studioHtml = shell(`
<p style="margin:0 0 12px;"><strong>New Speed Reading lead</strong></p>
<p style="margin:0;">Email &mdash; <a href="mailto:${esc(r.email)}" style="color:#000;">${esc(r.email)}</a><br>
Site &mdash; ${esc(r.url)}<br>
Score &mdash; ${r.score} (${esc(r.tier)})<br>
LCP ${esc(r.metrics.lcp)} · CLS ${esc(r.metrics.cls)} · TBT ${esc(r.metrics.tbt)}</p>
`)

  try {
    await sendEmail({
      to: [r.email],
      subject: `Your Speed Reading — ${r.score}/100`,
      html: visitorHtml,
      text: `The Speed Reading — ${r.url}\nScore: ${r.score}/100 (${r.tier})\nLCP ${r.metrics.lcp} · CLS ${r.metrics.cls} · TBT ${r.metrics.tbt}\n${r.fixes.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\nBook the conversation: https://beedstu.com/booking/`,
    })
  } catch (e) {
    console.error('[speed-reading] visitor email failed:', e)
    return NextResponse.json({ error: 'Email failed' }, { status: 500 })
  }

  // Studio notify is best-effort — never blocks the visitor's confirmation.
  sendEmail({
    to: [STUDIO_EMAIL],
    subject: `Speed Reading lead — ${r.url} — ${r.score}/100`,
    html: studioHtml,
    text: `${r.email} — ${r.url} — score ${r.score}`,
    reply_to: r.email,
  }).catch((e) => console.error('[speed-reading] studio notify failed:', e))

  return NextResponse.json({ ok: true })
}
