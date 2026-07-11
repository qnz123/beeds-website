/**
 * Email notifications for booking confirmations.
 *
 * Behaviour:
 *   - If RESEND_API_KEY is set: sends a confirmation to the customer and a
 *     notification to info@beedstu.com via the Resend API.
 *   - If unset: logs to console and returns — the booking still succeeds.
 *
 * Email failures are caught inside sendBookingEmails and never propagate to
 * the caller; a booking is never rejected because of an email error.
 *
 * Required env var for live email:
 *   RESEND_API_KEY — obtain at https://resend.com
 *   RESEND_FROM    — verified sender address, e.g. "BEEDS <noreply@beedstu.com>"
 *                    Defaults to "BEEDS <noreply@beedstu.com>" if unset.
 */

export interface BookingEmailPayload {
  name: string
  email: string
  service: string
  message?: string | null
  date: string
  time: string
}

const NOTIFY_ADDRESS = 'info@beedstu.com'

function serviceLabel(value: string): string {
  const labels: Record<string, string> = {
    'creative-strategy': 'Creative Strategy',
    'ai-enablement': 'AI Enablement',
    'production': 'Production',
    'market-expansion': 'Market Expansion',
  }
  return labels[value] ?? value
}

async function resendSend(payload: {
  from: string
  to: string
  subject: string
  html: string
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY!
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend API error ${res.status}: ${text}`)
  }
}

export async function sendBookingEmails(booking: BookingEmailPayload): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    // No-op fallback — logs the notification that would have been sent.
    console.log('[email] RESEND_API_KEY not set — skipping email send. Booking details:', {
      to: booking.email,
      notify: NOTIFY_ADDRESS,
      date: booking.date,
      time: booking.time,
      service: booking.service,
    })
    return
  }

  const from =
    process.env.RESEND_FROM ?? `BEEDS <noreply@beedstu.com>`
  const label = serviceLabel(booking.service)

  try {
    // 1. Customer confirmation
    await resendSend({
      from,
      to: booking.email,
      subject: `Booking confirmed — ${label} on ${booking.date}`,
      html: `
        <p>Hi ${booking.name},</p>
        <p>We've received your booking request for <strong>${label}</strong>
           on <strong>${booking.date}</strong> at <strong>${booking.time}</strong>.</p>
        <p>The BEEDS team will be in touch to confirm shortly.</p>
        ${booking.message ? `<p>Your message: <em>${booking.message}</em></p>` : ''}
        <p>— BEEDS</p>
      `,
    })

    // 2. Internal notification to the studio
    await resendSend({
      from,
      to: NOTIFY_ADDRESS,
      subject: `New booking: ${label} — ${booking.date} ${booking.time}`,
      html: `
        <h2>New Booking Request</h2>
        <ul>
          <li><strong>Name:</strong> ${booking.name}</li>
          <li><strong>Email:</strong> ${booking.email}</li>
          <li><strong>Service:</strong> ${label}</li>
          <li><strong>Date:</strong> ${booking.date}</li>
          <li><strong>Time:</strong> ${booking.time}</li>
          ${booking.message ? `<li><strong>Message:</strong> ${booking.message}</li>` : ''}
        </ul>
      `,
    })

    console.log(`[email] Confirmation sent to ${booking.email} and ${NOTIFY_ADDRESS}`)
  } catch (err) {
    // Email failure must never fail the booking response.
    console.error('[email] Failed to send booking emails:', err)
  }
}
