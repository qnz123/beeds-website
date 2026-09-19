'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { trackEvent } from '@/lib/analytics'
import type { SpeedCheckResult } from '@/lib/psi'

// The Speed Reading — paste a URL, get an editorial verdict on its speed.
// Engagement spec by Zack, technical spec by Jane (2026-08-12); the result
// page is one editorial column: verdict → the mirror (their screenshot) →
// the doorway (100-visitor funnel) → the napkin math → the company you keep
// → hooks. Estimates are labeled estimates; measurements are labeled
// measured. The tool stays free and ungated — the email step is a value
// exchange (the prescription), not a toll gate.

const ENDPOINT = '/api/speed-check/' // trailing slash: trailingSlash:true 308s a POST otherwise
const EMAIL_ENDPOINT = '/api/speed-check/email/'

type Phase = 'idle' | 'running' | 'success' | 'error'

// ---- verdict tiers (Zack's spec) ----
function tierFor(score: number) {
  if (score >= 90)
    return {
      name: 'Rare Air',
      line: 'Fast. Genuinely. Fewer than one in ten sites we test lands here.',
    }
  if (score >= 70)
    return {
      name: 'Almost',
      line: 'Good bones. But somewhere in there, a second or two is quietly leaking out — and seconds are the expensive part.',
    }
  if (score >= 50)
    return {
      name: 'The Slow Goodbye',
      line: 'Your site works fine. It just asks people to wait to find out — and some of them decline.',
    }
  return {
    name: 'The Waiting Room',
    line: 'Rough. But sit down before you feel bad: Deloitte — the firm companies pay to fix things — scored 36 when we tested them. Slow is the norm. It’s also fixable.',
  }
}

// ---- the napkin math (formulas per Zack's spec, calibrated to the cited studies) ----
const conversionIndex = (t: number) => Math.max(0.4, 1 - 0.15 * (Math.max(1, t) - 1))
const bouncePenalty = (t: number) => Math.min(0.32, 0.16 * (Math.max(1, t) - 1))

// ---- the wait theater (status line + stat card ladder, Zack's timings) ----
const WAIT_STAGES: { at: number; status: string; stat?: string }[] = [
  { at: 0, status: "Calling Google's test lab." },
  {
    at: 4,
    status:
      'A simulated phone is now loading your site on a mediocre connection. This is on purpose. It’s how most of your visitors live.',
    stat: 'While you wait: 0.1 seconds faster = 8.4% more sales, in a study Deloitte ran with Google. One tenth of one second.',
  },
  {
    at: 12,
    status: 'Google is timing your largest image.',
    stat: 'A site that loads in 1 second converts about 2.5× better than one that loads in 5. (Portent, across 27 industries.)',
  },
  {
    at: 22,
    status: 'Checking whether your page jumps around while people try to read it.',
    stat: 'When load time goes from 1 to 3 seconds, the chance a visitor leaves rises 32%. (Google’s own data.)',
  },
  {
    at: 32,
    status: 'Still measuring. Slower sites take longer to test. Make of that what you will.',
    stat: 'Our site scores 99 and shows content in 1.8 seconds. We’re not bragging. Okay — slightly.',
  },
  {
    at: 45,
    status: 'Compiling the verdict.',
    stat: 'Almost there. Verdicts are worth waiting for. Websites are not.',
  },
]

// Demo result so the experience can be reviewed without burning PSI quota —
// enter "demo" as the URL. Clearly labeled in the UI.
const DEMO_RESULT: SpeedCheckResult = {
  ok: true,
  requestedUrl: 'https://demo.example/',
  finalUrl: 'https://demo.example/',
  strategy: 'mobile',
  score: 47,
  metrics: {
    lcp: { value: 6200, displayValue: '6.2 s' },
    cls: { value: 0.18, displayValue: '0.18' },
    tbt: { value: 890, displayValue: '890 ms' },
  },
  screenshot: null,
  fieldData: null,
  fetchedAt: new Date().toISOString(),
}

function fixesFor(r: SpeedCheckResult): string[] {
  const fixes: string[] = []
  if (r.metrics.lcp.value > 2500)
    fixes.push(
      'Get your main image or headline on screen faster — compress and self-host the hero media, and stop anything heavy (video, third-party scripts) from loading before it.',
    )
  if (r.metrics.tbt.value > 200)
    fixes.push(
      'Cut main-thread blocking — defer analytics, chat widgets, and tag managers until the browser is idle; they’re holding the door shut while visitors wait.',
    )
  if (r.metrics.cls.value > 0.1)
    fixes.push(
      'Stop the layout jumping — reserve space for images, embeds, and fonts so the page doesn’t shift while people are reading it.',
    )
  if (fixes.length < 3)
    fixes.push(
      'Serve everything from one fast edge network — modern static hosting with images in WebP/AVIF keeps the whole page under a megabyte.',
    )
  return fixes.slice(0, 3)
}

export default function SpeedReading() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [url, setUrl] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [error, setError] = useState('')
  const [result, setResult] = useState<SpeedCheckResult | null>(null)
  const [isDemo, setIsDemo] = useState(false)
  const [stage, setStage] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  // count-up score
  const [shownScore, setShownScore] = useState(0)

  // napkin math inputs
  const [visitors, setVisitors] = useState(5000)
  const [aov, setAov] = useState(80)
  const [convRate, setConvRate] = useState(2)

  // email capture
  const [email, setEmail] = useState('')
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )

  // pinned bar after the money section
  const moneyRef = useRef<HTMLDivElement>(null)
  const [pinned, setPinned] = useState(false)
  const [pinDismissed, setPinDismissed] = useState(false)
  // sentinel just before the Footer — the pinned bar hides once this is
  // near view so it doesn't sit over the Footer's contact info
  const bottomRef = useRef<HTMLDivElement>(null)
  const [nearBottom, setNearBottom] = useState(false)

  const timersRef = useRef<number[]>([])
  const reduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const clearTimers = () => {
    timersRef.current.forEach((t) => window.clearTimeout(t))
    timersRef.current = []
  }
  useEffect(() => clearTimers, [])

  const startTheater = (demo: boolean) => {
    setStage(0)
    setElapsed(0)
    const scale = demo ? 0.12 : 1 // demo compresses the wait to ~6s
    WAIT_STAGES.forEach((s, i) => {
      if (i === 0) return
      timersRef.current.push(
        window.setTimeout(() => setStage(i), s.at * 1000 * scale),
      )
    })
    const tick = window.setInterval(
      () => setElapsed((e) => e + 1),
      1000 * scale,
    ) as unknown as number
    timersRef.current.push(tick as number)
  }

  const finish = (r: SpeedCheckResult, demo: boolean) => {
    clearTimers()
    setResult(r)
    setIsDemo(demo)
    setPhase('success')
    trackEvent('speed_check_result', { score: r.score })
    // score count-up with deceleration; reduced motion jumps straight there
    if (reduced()) {
      setShownScore(r.score)
      return
    }
    setShownScore(0)
    const t0 = performance.now()
    const dur = 1800
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur)
      const eased = 1 - Math.pow(1 - p, 4) // hard brake at the end — a 47 lands with a thud
      setShownScore(Math.round(r.score * eased))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  const run = async (e: React.FormEvent) => {
    e.preventDefault()
    if (company) return // honeypot
    const trimmed = url.trim()
    if (!trimmed) {
      setError('Paste a website address first.')
      return
    }
    setError('')
    setPhase('running')
    trackEvent('speed_check_run', {})

    const demo = trimmed.toLowerCase() === 'demo'
    startTheater(demo)

    if (demo) {
      timersRef.current.push(
        window.setTimeout(() => finish(DEMO_RESULT, true), 6500),
      )
      return
    }

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed, company }),
      })
      const data = await res.json()
      if (data?.ok) {
        finish(data as SpeedCheckResult, false)
      } else {
        clearTimers()
        setPhase('error')
        setError(
          data?.message ?? 'The speed check service hit a snag. Please try again shortly.',
        )
        trackEvent('speed_check_error', { code: data?.code ?? 'unknown' })
      }
    } catch {
      clearTimers()
      setPhase('error')
      setError('Network hiccup — check your connection and try again.')
      trackEvent('speed_check_error', { code: 'network' })
    }
  }

  const reset = () => {
    clearTimers()
    setPhase('idle')
    setResult(null)
    setError('')
    setEmailState('idle')
    setPinDismissed(false)
    setPinned(false)
  }

  // pinned CTA bar arms once the napkin math has been seen
  useEffect(() => {
    if (phase !== 'success' || !moneyRef.current) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setPinned(true)
        })
      },
      { threshold: 0.4 },
    )
    io.observe(moneyRef.current)
    return () => io.disconnect()
  }, [phase])

  // pinned CTA bar disarms once the page bottom (and Footer behind it) nears view
  useEffect(() => {
    if (phase !== 'success' || !bottomRef.current) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => setNearBottom(en.isIntersecting)),
      { rootMargin: '0px 0px -120px 0px' },
    )
    io.observe(bottomRef.current)
    return () => io.disconnect()
  }, [phase])

  const sendReport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!result || company) return
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setEmailState('error')
      return
    }
    setEmailState('sending')
    trackEvent('speed_check_email_submit', {})
    try {
      const res = await fetch(EMAIL_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          company,
          url: result.finalUrl,
          score: result.score,
          tier: tierFor(result.score).name,
          metrics: {
            lcp: result.metrics.lcp.displayValue,
            cls: result.metrics.cls.displayValue,
            tbt: result.metrics.tbt.displayValue,
          },
          fixes: fixesFor(result),
        }),
      })
      setEmailState(res.ok ? 'sent' : 'error')
    } catch {
      setEmailState('error')
    }
  }

  // ---- derived numbers for the funnel + napkin math ----
  // The doorway narrates per 1,000 arrivals (per Zack's QC: at per-100 scale
  // the default 2% conversion rounds both sides to "1 vs 1" and the story
  // flatlines). Both sides derive through the identical pipeline so the
  // funnel and the napkin math always agree.
  const derived = useMemo(() => {
    if (!result) return null
    const t = Math.max(1, result.metrics.lcp.value / 1000)
    const leavePct = Math.round(bouncePenalty(t) * 100)
    const r = convRate / 100
    const per1000 = (tt: number) => {
      const stay = Math.round(1000 * (1 - bouncePenalty(tt)))
      return { stay, buyers: Math.round(stay * r * conversionIndex(tt)) }
    }
    const nowF = per1000(t)
    const twoF = per1000(2)
    const monthly = (tt: number) =>
      visitors * (1 - bouncePenalty(tt)) * r * conversionIndex(tt) * aov
    return {
      t,
      leavePct,
      stayPct: 100 - leavePct,
      leave1000: 1000 - nowF.stay,
      stay1000: nowF.stay,
      buyersNow: nowF.buyers,
      buyersAtTwo: twoF.buyers,
      onTable: Math.max(0, Math.round((monthly(2) - monthly(t)) / 10) * 10),
    }
  }, [result, visitors, aov, convRate])

  const tier = result ? tierFor(result.score) : null
  const bookHref = result
    ? `/booking/?from=speed-reading&score=${result.score}&site=${encodeURIComponent(result.finalUrl)}`
    : '/booking/'

  const currentStage = WAIT_STAGES[stage]

  return (
    <section className="px-10 pb-24">
      <div className="container-x">
        {/* ---------- input ---------- */}
        {phase === 'idle' || phase === 'error' ? (
          <div className="max-w-[640px]">
            <form onSubmit={run} className="flex flex-col gap-4 sm:flex-row" noValidate>
              {/* Honeypot — hidden from view + AT */}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <label htmlFor="sr-url" className="sr-only">
                Your website address
              </label>
              <input
                id="sr-url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="yoursite.com"
                autoComplete="url"
                inputMode="url"
                className="flex-1 border-b border-black bg-transparent py-3 text-xl outline-none focus:border-b-2"
              />
              <button type="submit" className="deck-cta self-start sm:self-auto">
                Read it →
              </button>
            </form>
            {error && <p className="mt-4 text-sm text-[#a33]">{error}</p>}
            <p className="mt-5 text-[11px] uppercase tracking-[0.14em] text-[#999]">
              Powered by Google&rsquo;s PageSpeed Insights. Interpreted by BEEDS. No signup.
            </p>
          </div>
        ) : null}

        {/* ---------- the wait ---------- */}
        {phase === 'running' && (
          <div className="max-w-[640px]" role="status" aria-live="polite">
            <p className="min-h-[3.5em] text-lg leading-[1.6]">{currentStage.status}</p>
            {/* hairline progress: eases toward 90% and holds — never fakes done */}
            <div className="mt-6 h-px w-full bg-[#ddd]">
              <div
                className="h-px bg-black transition-[width] duration-1000 ease-out motion-reduce:transition-none"
                style={{ width: `${Math.min(90, 8 + elapsed * 2)}%` }}
              />
            </div>
            {currentStage.stat && (
              <div className="mt-8 max-w-[520px] border border-black bg-white p-5">
                <p className="text-sm leading-[1.7] text-[#444]">{currentStage.stat}</p>
              </div>
            )}
          </div>
        )}

        {/* ---------- the reading ---------- */}
        {phase === 'success' && result && tier && derived && (
          <div className="max-w-[760px]">
            {isDemo && (
              <p className="mb-8 inline-block border border-black bg-white px-3 py-1 text-[11px] uppercase tracking-[0.16em]">
                Demo data — for preview only
              </p>
            )}

            {/* ① The Verdict */}
            <p className="eyebrow text-[#666]">{tier.name}</p>
            <p className="my-2 text-[96px] leading-none md:text-[140px]">
              {shownScore}
              <span className="text-2xl text-[#999]"> /100</span>
            </p>
            <p className="max-w-[560px] text-lg leading-[1.6]">{tier.line}</p>
            <p className="mt-4 text-sm text-[#666]">
              Content appeared in {result.metrics.lcp.displayValue}. Lab test, real
              numbers — {result.finalUrl}
            </p>

            {/* ② The Mirror */}
            {result.screenshot && (
              <div className="mt-14">
                <div className="inline-block border border-black bg-white p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.screenshot}
                    alt={`Rendered screenshot of ${result.finalUrl}`}
                    className="block max-h-[420px] w-auto"
                  />
                </div>
                <p className="mt-3 max-w-[420px] text-sm leading-[1.6] text-[#666]">
                  {result.score >= 90
                    ? 'This is what Google saw — quickly. Your visitors on the train saw it almost as fast.'
                    : 'This is what Google saw — eventually. Your visitors on the train waited longer than they wanted to.'}
                </p>
              </div>
            )}

            {/* ③ The Doorway */}
            <div className="mt-16">
              <h3 className="eyebrow mb-5">The doorway · estimate</h3>
              {/* each mark is ten visitors of a thousand */}
              <div className="flex max-w-[560px] flex-wrap gap-[6px]" aria-hidden="true">
                {Array.from({ length: 100 }, (_, i) => (
                  <span
                    key={i}
                    className="inline-block h-4 w-[7px]"
                    style={{
                      backgroundColor: i < derived.stayPct ? '#000' : '#c9c9c9',
                    }}
                  />
                ))}
              </div>
              <p className="mt-5 max-w-[560px] text-[15px] leading-[1.7]">
                1,000 people arrive. At your speed, an estimated{' '}
                <strong>{derived.leave1000.toLocaleString()} leave</strong> before the
                page finishes. Of the {derived.stay1000.toLocaleString()} who stay,
                about {derived.buyersNow} buy or enquire. At 2 seconds, we&rsquo;d
                estimate {derived.buyersAtTwo} — same site, same traffic, fewer sighs.
              </p>
            </div>

            {/* ④ The Napkin Math */}
            <div ref={moneyRef} className="mt-16 border border-black bg-white p-7">
              <h3 className="eyebrow mb-2">The napkin math · estimate</h3>
              <p className="mb-6 text-sm leading-[1.6] text-[#666]">
                An estimate, plainly labeled. Built from published research, not from
                knowing your business. Adjust the numbers — they&rsquo;re yours, not
                ours.
              </p>
              <div className="flex flex-wrap gap-x-8 gap-y-4 text-[15px]">
                <label className="flex items-baseline gap-2">
                  Monthly visitors
                  <input
                    type="number"
                    min={0}
                    value={visitors}
                    onChange={(e) => setVisitors(Number(e.target.value) || 0)}
                    className="w-24 border-b border-black bg-transparent py-1 text-right outline-none"
                  />
                </label>
                <label className="flex items-baseline gap-2">
                  Average sale $
                  <input
                    type="number"
                    min={0}
                    value={aov}
                    onChange={(e) => setAov(Number(e.target.value) || 0)}
                    className="w-20 border-b border-black bg-transparent py-1 text-right outline-none"
                  />
                </label>
                <label className="flex items-baseline gap-2">
                  Conversion %
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={convRate}
                    onChange={(e) => setConvRate(Number(e.target.value) || 0)}
                    className="w-16 border-b border-black bg-transparent py-1 text-right outline-none"
                  />
                </label>
              </div>
              <p className="mt-6 text-lg leading-[1.6]">
                {result.score >= 90 ? (
                  <>
                    The napkin math says you&rsquo;re keeping the money most sites
                    leave out. Carry on.
                  </>
                ) : derived.onTable < 50 ? (
                  // Score is losing points on stability/blocking, not raw load
                  // time — a dollar figure of ~$0 would argue against ourselves.
                  <>
                    At your speed the leak isn&rsquo;t load time — the score is
                    losing points elsewhere (layout stability, script blocking).
                    Cheaper to fix, same effect on visitors.
                  </>
                ) : (
                  <>
                    Estimated difference at your traffic:{' '}
                    <span className="brush-highlight">
                      ~${derived.onTable.toLocaleString()} a month
                    </span>{' '}
                    (${(derived.onTable * 12).toLocaleString()} a year). Rough math,
                    honestly labeled — but the direction is not in doubt.
                  </>
                )}
              </p>
            </div>

            {/* ⑤ The Company You Keep */}
            <div className="mt-16">
              <h3 className="eyebrow mb-6">The company you keep</h3>
              {[
                { name: `You — ${result.finalUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}`, score: result.score, you: true },
                { name: 'Deloitte.com (yes, that Deloitte — tested Aug 2026)', score: 36 },
                { name: 'BEEDS — the site you’re on right now (1.8s)', score: 99 },
              ].map((row) => (
                <div key={row.name} className="mb-4">
                  <div className="mb-1 flex items-baseline justify-between gap-4 text-[13px]">
                    <span className={row.you ? '' : 'text-[#888]'}>{row.name}</span>
                    <span className={`text-lg ${row.you ? '' : 'text-[#888]'}`}>
                      {row.score}
                    </span>
                  </div>
                  <div className="h-[10px] w-full bg-[#e4e4e4]">
                    <div
                      className="h-full"
                      style={{
                        width: `${row.score}%`,
                        backgroundColor: row.you ? '#000' : '#b5b5b5',
                      }}
                    />
                  </div>
                </div>
              ))}
              <p className="mt-3 text-[12px] leading-[1.6] text-[#999]">
                Cohort context: 74.9% of Wix sites, 55.9% of the web, and 46.3% of
                WordPress sites pass Google&rsquo;s speed standard (Core Web Vitals,
                2025–26). Cohort stats — sites like yours, not your site.
              </p>
              {result.score < 90 && (
                <button
                  type="button"
                  onClick={reset}
                  className="mt-4 text-sm underline underline-offset-4 decoration-[#999] hover:decoration-black"
                >
                  Curious how a competitor scores? →
                </button>
              )}
            </div>

            {/* ⑥ Email capture */}
            <div className="mt-16 border-t border-black pt-10">
              <h3 className="mb-2 text-2xl">
                Your {result.score}, explained — in your inbox.
              </h3>
              <p className="mb-6 max-w-[480px] text-sm leading-[1.7] text-[#666]">
                Everything Google measured — translated into English, plus the three
                fixes we&rsquo;d make first, in order.
              </p>
              {emailState === 'sent' ? (
                <p className="text-[15px]">
                  Sent. Check your inbox (and, for now, the spam folder — we&rsquo;re a
                  young domain).
                </p>
              ) : (
                <form onSubmit={sendReport} className="flex max-w-[440px] flex-col gap-3 sm:flex-row" noValidate>
                  <label htmlFor="sr-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="sr-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="flex-1 border-b border-black bg-transparent py-2 outline-none focus:border-b-2"
                  />
                  <button
                    type="submit"
                    disabled={emailState === 'sending'}
                    className="deck-cta self-start disabled:opacity-50"
                  >
                    {emailState === 'sending' ? 'Sending…' : 'Send it →'}
                  </button>
                </form>
              )}
              {emailState === 'error' && (
                <p className="mt-3 text-sm text-[#a33]">
                  That didn&rsquo;t send — check the address and try again.
                </p>
              )}
            </div>

            {/* ⑦ Primary CTA */}
            <div className="mt-14 border border-black bg-white p-8">
              <h3 className="mb-3 text-2xl leading-[1.3]">
                {result.score >= 90
                  ? 'Fast site. Next problem: does it sell? We do that too.'
                  : 'We build sites that load before people wonder if they should leave.'}
              </h3>
              <p className="mb-6 text-[15px] leading-[1.7] text-[#666]">
                Ours does 1.8 seconds. Yours could. Twenty minutes, a human, no deck.
              </p>
              <a
                href={bookHref}
                className="deck-cta inline-block"
                onClick={() => trackEvent('speed_check_book_click', { score: result.score })}
              >
                Book the conversation →
              </a>
            </div>

            {/* ⑧ Fine print */}
            <p className="mt-12 max-w-[640px] text-[12px] leading-[1.8] text-[#999]">
              The fine print, voluntarily. Your score and timings are measured by
              Google&rsquo;s PageSpeed Insights, today. The visitor and revenue figures
              are estimates built from published research — Deloitte × Google (2020),
              Google/SOASTA, Portent — applied to defaults you can change above.
              Deloitte.com&rsquo;s score of 36 was our own test, dated Aug 2026;
              scores move, so we retest. One lab run can wobble a few points — run it
              twice if yours feels unfair. We built this because fast sites make money
              and ours is fast. That&rsquo;s the whole agenda.
            </p>

            <button
              type="button"
              onClick={reset}
              className="mt-8 text-sm underline underline-offset-4 decoration-[#999] hover:decoration-black"
            >
              Run it again →
            </button>

            {/* sentinel: pinned bar disarms once this nears view, so it never
                sits over the Footer behind it */}
            <div ref={bottomRef} aria-hidden="true" />
          </div>
        )}
      </div>

      {/* pinned CTA bar — appears after the napkin math has been seen */}
      {phase === 'success' && result && pinned && !pinDismissed && !nearBottom && result.score < 90 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black bg-[#f5f5f5]">
          <div className="container-x flex items-center justify-between gap-4 px-10 py-3">
            {/* the pinned bar carries the strongest number on the page (Zack's
                QC): the live napkin figure when it exists, the score otherwise */}
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              <span>
                {derived && derived.onTable >= 50
                  ? `~$${derived.onTable.toLocaleString()}/mo on the table (est.)`
                  : `Score ${result.score}. Fixable.`}
              </span>
              <a
                href={bookHref}
                className="deck-cta !px-4 !py-1.5 text-[12px]"
                onClick={() => trackEvent('speed_check_book_click', { score: result.score, from: 'pinned' })}
              >
                Book 20 minutes →
              </a>
            </p>
            <button
              type="button"
              onClick={() => setPinDismissed(true)}
              aria-label="Dismiss"
              className="text-sm text-[#666] hover:text-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
