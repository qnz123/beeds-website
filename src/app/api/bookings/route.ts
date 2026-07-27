import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Booking submissions from "The Concierge" (BookingCalendar.tsx). Runs as a
// Vercel serverless function — no database, email only: it sends the visitor a
// confirmation AND notifies the studio, both via Resend's REST API. Replaces
// the old HostGator /booking-submit.php mailer.
//
// Required env (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   from resend.com
//   RESEND_FROM      a verified sender on beedstu.com, e.g. "BEEDS <booking@beedstu.com>"
//   STUDIO_EMAIL     where studio notifications go (defaults to booking@beedstu.com)
export const runtime = 'nodejs'

const BookingSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(200),
  service: z.string().trim().min(1).max(200),
  date: z.string().trim().min(1).max(200),
  time: z.string().trim().min(1).max(200),
  message: z.string().max(4000).optional().default(''),
  company: z.string().max(200).optional().default(''), // honeypot — real visitors leave blank
})

const STUDIO_EMAIL = process.env.STUDIO_EMAIL ?? 'booking@beedstu.com'
const FROM = process.env.RESEND_FROM ?? 'BEEDS <booking@beedstu.com>'

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Branded HTML shell — the site's editorial/paper look, inline styles so email
// clients render it. A real HTML email from the verified domain lands far more
// often than a plain-text one-liner.
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

  const parsed = BookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid submission' }, { status: 400 })
  }
  const b = parsed.data

  // Honeypot: a filled `company` means a bot — accept silently, send nothing.
  if (b.company.trim()) {
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const on = b.date && b.date !== 'N/A' ? ` on ${b.date}` : ''
  const at = b.time && b.time !== 'N/A' ? ` at ${b.time}` : ''

  // --- Visitor confirmation ---
  const confirmationText =
    `Thank you, ${b.name}.\n\n` +
    `We've received your request for a ${b.service} session${on}${at}. ` +
    `A member of our studio will be in touch shortly.\n\n` +
    `— BEEDS\nbeedstu.com`
  const confirmationHtml = shell(
    `<p style="margin:0 0 16px;">Thank you, ${esc(b.name)}.</p>` +
      `<p style="margin:0 0 16px;">We've received your request for a <strong>${esc(b.service)}</strong> session${esc(on)}${esc(at)}. A member of our studio will be in touch shortly.</p>` +
      `<p style="margin:0;">— BEEDS</p>`
  )

  // --- Studio notification ---
  const rows: [string, string][] = [
    ['Service', b.service],
    ['Date', b.date],
    ['Time', b.time],
    ['Name', b.name],
    ['Email', b.email],
  ]
  const studioText =
    rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    `\n\nNote: ${b.message.trim() ? b.message.trim() : '—'}`
  const studioHtml = shell(
    `<p style="margin:0 0 14px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#666;">New session request</p>` +
      `<table role="presentation" cellpadding="0" cellspacing="0" style="font-family:'Times New Roman',Times,serif;font-size:15px;color:#111;">` +
      rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:4px 16px 4px 0;color:#666;vertical-align:top;">${k}</td><td style="padding:4px 0;">${esc(v)}</td></tr>`
        )
        .join('') +
      `</table>` +
      `<p style="margin:16px 0 0;">${b.message.trim() ? esc(b.message.trim()).replace(/\n/g, '<br>') : '—'}</p>`
  )

  // Send both INDEPENDENTLY — the visitor's confirmation must go out even if the
  // studio notification fails, and vice versa. Only a total failure falls back.
  const [confirmation, notification] = await Promise.allSettled([
    sendEmail({
      to: [b.email],
      subject: "We've received your request — BEEDS",
      html: confirmationHtml,
      text: confirmationText,
    }),
    sendEmail({
      to: [STUDIO_EMAIL],
      reply_to: b.email,
      subject: `New session request — ${b.service}`,
      html: studioHtml,
      text: studioText,
    }),
  ])

  if (confirmation.status === 'rejected') {
    console.error('Visitor confirmation failed:', confirmation.reason)
  }
  if (notification.status === 'rejected') {
    console.error('Studio notification failed:', notification.reason)
  }

  // The studio notification is the ONLY channel that delivers the lead (no DB),
  // so if it fails we must signal an error — the client then falls back to a
  // mailto and the request still reaches the studio. A failed visitor
  // confirmation alone doesn't lose the lead, so that stays a success.
  if (notification.status === 'rejected') {
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
