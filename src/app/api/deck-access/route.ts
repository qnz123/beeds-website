import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// One-click deck access for the Explore page. Accepts EITHER a Google Identity
// Services credential (a signed ID token — one-click, verified email) OR a typed
// email fallback. Captures the lead (studio notification via Resend, same setup
// as /api/bookings) and grants soft access — the client then reveals the full
// studies. No database; email + server logs are the record. The studies aren't
// secret, so a legitimate visitor is never blocked on an email hiccup.
//
// Env (shared with /api/bookings): RESEND_API_KEY, RESEND_FROM, STUDIO_EMAIL.
// Plus NEXT_PUBLIC_GOOGLE_CLIENT_ID — the audience a Google token must match.
export const runtime = 'nodejs'

const Schema = z.union([
  z.object({ credential: z.string().min(10).max(8000) }),
  z.object({
    email: z.string().trim().email().max(200),
    company: z.string().max(200).optional().default(''), // honeypot
  }),
])

const STUDIO_EMAIL = process.env.STUDIO_EMAIL ?? 'booking@beedstu.com'
const FROM = process.env.RESEND_FROM ?? 'BEEDS <booking@beedstu.com>'
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Verify a Google ID token server-side. Google's tokeninfo endpoint validates
// the signature and expiry for us; we additionally check the audience matches
// our own client ID so a token minted for another site can't be replayed here.
async function verifyGoogle(
  credential: string,
): Promise<{ email: string; name: string } | null> {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`,
  )
  if (!res.ok) return null
  const p = (await res.json()) as {
    aud?: string
    email?: string
    email_verified?: string
    name?: string
  }
  if (!p.email) return null
  if (GOOGLE_CLIENT_ID && p.aud !== GOOGLE_CLIENT_ID) return null
  return { email: p.email, name: p.name ?? '' }
}

async function notifyStudio(lead: { email: string; name: string; method: string }) {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not configured')
  const html = `<!doctype html><html><body style="font-family:'Times New Roman',Times,serif;color:#111;line-height:1.7;">
<p style="font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#666;margin:0 0 12px;">New deck access request</p>
<p style="margin:0;">Email: ${esc(lead.email)}<br>Name: ${esc(lead.name || '—')}<br>Via: ${esc(lead.method)}</p>
</body></html>`
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM,
      to: [STUDIO_EMAIL],
      reply_to: lead.email,
      subject: `New deck access — ${lead.email}`,
      html,
      text: `New Explore deck access\n\nEmail: ${lead.email}\nName: ${lead.name || '—'}\nVia: ${lead.method}`,
    }),
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

  const parsed = Schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  let email: string
  let name = ''
  let method: string

  if ('credential' in parsed.data) {
    const g = await verifyGoogle(parsed.data.credential)
    if (!g) {
      return NextResponse.json({ error: 'Sign-in could not be verified' }, { status: 401 })
    }
    email = g.email
    name = g.name
    method = 'Google sign-in'
  } else {
    // Honeypot: a filled `company` is a bot — accept silently, capture nothing.
    if (parsed.data.company.trim()) {
      return NextResponse.json({ ok: true })
    }
    email = parsed.data.email
    method = 'Email'
  }

  // The lead is the whole point — always log it (recoverable even if email
  // sending fails), then best-effort notify the studio. Access is granted
  // regardless; we never block a legitimate visitor on a Resend hiccup.
  console.log(`[deck-access] LEAD email=${email} name=${name || '—'} method=${method}`)
  try {
    await notifyStudio({ email, name, method })
  } catch (e) {
    console.error('[deck-access] studio notification failed:', e)
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set('deck_access', '1', {
    path: '/',
    maxAge: 60 * 60 * 24 * 180, // 180 days
    sameSite: 'lax',
  })
  return res
}
