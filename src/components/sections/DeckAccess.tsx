'use client'

import { useEffect, useRef, useState } from 'react'

// The single gated CTA for the Explore studies. It starts as the house button
// ("Review the full deck →"); clicking it reveals the ways to continue —
// one-click "Sign in with Google" (Google Identity Services, a verified email)
// and a plain email fallback for everyone else. On success it posts to
// /api/deck-access (which captures the lead and grants access), then reports up
// via onGranted — the parent (StudyShowcase) persists access and turns the
// study cards into clickable reviews.
//
// The Google button only renders when NEXT_PUBLIC_GOOGLE_CLIENT_ID is set, so
// the page ships working (email-only) and Google lights up once the OAuth
// client ID is configured — same env-gated pattern as analytics.

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const ENDPOINT = '/api/deck-access/' // trailing slash: trailingSlash:true 308s a POST otherwise

type Status = 'idle' | 'loading' | 'error'

export default function DeckAccess({ onGranted }: { onGranted: () => void }) {
  const btnRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [open, setOpen] = useState(false) // options revealed after the first click
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [error, setError] = useState('')

  const submit = async (payload: Record<string, unknown>) => {
    setStatus('loading')
    setError('')
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      onGranted()
    } catch {
      setStatus('error')
      setError(
        'Something went wrong. Please try again, or email beedstu@gmail.com and we’ll open it for you.',
      )
    }
  }

  // Google Identity Services: once the options are open, load the script (once)
  // and render the button, routing its credential (a signed ID token) to our
  // backend for verification.
  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !open) return

    const render = () => {
      const g = (window as unknown as { google?: any }).google
      if (!g?.accounts?.id || !btnRef.current) return
      g.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (resp: { credential?: string }) => {
          if (resp.credential) submit({ credential: resp.credential })
        },
      })
      g.accounts.id.renderButton(btnRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
      })
    }

    if ((window as unknown as { google?: any }).google?.accounts?.id) {
      render()
      return
    }
    const existing = document.getElementById('gsi-client') as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', render)
      return () => existing.removeEventListener('load', render)
    }
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.defer = true
    s.id = 'gsi-client'
    s.onload = render
    document.head.appendChild(s)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const onEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (company) return // honeypot filled → bot, ignore
    const trimmed = email.trim()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      setError('Please enter a valid email address.')
      return
    }
    submit({ email: trimmed, company })
  }

  return (
    <div className="mt-16 pt-10 border-t border-black">
      <p className="eyebrow text-[#666] mb-4">Customers only</p>
      <p className="text-xl md:text-2xl leading-[1.35] max-w-[620px] mb-8">
        The full interactive studies are reserved for BEEDS clients. Request
        access and we’ll open the complete deck for you to review.
      </p>

      {!open ? (
        // House button — no third-party branding until the visitor opts in.
        <button type="button" onClick={() => setOpen(true)} className="deck-cta">
          Review the full deck →
        </button>
      ) : (
        <div className="max-w-[420px]">
          <p className="eyebrow text-[#999] mb-5">Continue with</p>

          {GOOGLE_CLIENT_ID && (
            <>
              <div ref={btnRef} className="mb-6 min-h-[44px]" />
              <div className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.12em] text-[#999]">
                <span className="h-px flex-1 bg-[#ccc]" />
                or use your email
                <span className="h-px flex-1 bg-[#ccc]" />
              </div>
            </>
          )}

          <form onSubmit={onEmailSubmit} className="flex flex-col gap-2" noValidate>
            {/* Honeypot — real visitors leave this blank; hidden from view + AT. */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
            <label htmlFor="deck-email" className="sr-only">
              Email address
            </label>
            <input
              id="deck-email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              autoComplete="email"
              className="border-b border-black bg-transparent py-2 text-base outline-none focus:border-b-2"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="deck-cta self-start mt-4 disabled:opacity-50"
            >
              {status === 'loading' ? 'Opening…' : 'Continue with email →'}
            </button>
          </form>

          {error && <p className="mt-4 text-sm text-[#a33]">{error}</p>}
        </div>
      )}
    </div>
  )
}
