import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Booking submissions from "The Concierge" (BookingCalendar.tsx). Runs as a
// Vercel serverless function — no database, email only: it notifies the studio
// and sends the visitor a confirmation via Resend's REST API. Replaces the old
// HostGator /booking-submit.php mailer that died with the host migration.
//
// Required env (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY   from resend.com
//   RESEND_FROM      a verified sender on beedstu.com, e.g. "BEEDS <noreply@beedstu.com>"
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
const FROM = process.env.RESEND_FROM ?? 'BEEDS <noreply@beedstu.com>'

async function sendEmail(payload: {
  to: string[]
  subject: string
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

  // Honeypot: a filled `company` field means a bot — accept silently, send nothing.
  if (b.company.trim()) {
    return NextResponse.json({ ok: true }, { status: 201 })
  }

  const details = [
    `Service: ${b.service}`,
    `Date: ${b.date}`,
    `Time: ${b.time}`,
    `Name: ${b.name}`,
    `Email: ${b.email}`,
    '',
    b.message.trim() ? `Note: ${b.message.trim()}` : 'Note: —',
  ].join('\n')

  const on = b.date && b.date !== 'N/A' ? ` on ${b.date}` : ''
  const at = b.time && b.time !== 'N/A' ? ` at ${b.time}` : ''

  try {
    // 1) Notify the studio (reply-to the visitor so a reply reaches them directly).
    await sendEmail({
      to: [STUDIO_EMAIL],
      reply_to: b.email,
      subject: `New session request — ${b.service}`,
      text: details,
    })
    // 2) Confirm to the visitor, in the concierge voice.
    await sendEmail({
      to: [b.email],
      subject: 'We received your request — BEEDS',
      text:
        `Thank you, ${b.name}.\n\n` +
        `We've received your request for a ${b.service} session${on}${at}. ` +
        `A member of our studio will be in touch shortly.\n\n` +
        `— BEEDS\nbeedstu.com`,
    })
  } catch (err) {
    console.error('Booking email failed:', err)
    // The client falls back to a mailto: link on a non-OK response, so the
    // request still reaches the studio even if sending fails.
    return NextResponse.json({ error: 'Send failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
