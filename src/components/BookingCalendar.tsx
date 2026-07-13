'use client'

// "The Concierge" — client-approved booking flow (Study 2, 2026-07-09).
// Booking as typography: three editorial stanzas of large serif text whose
// controls are native selects/inputs styled as underline blanks. Replaces the
// month-grid calendar + time-slot chips; the /api/bookings contract is
// unchanged except the service slugs, which now speak the folio language.

import { CSSProperties, FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// Timezone-aware, hourly session windows (2026-07-10).
//
// Availability is defined in JST (Asia/Tokyo) and differs by the visitor's
// region; the visitor sees whole-hour slots converted to their OWN local
// timezone (auto-detected). Windows are half-open [start, end): the closing
// hour is NOT bookable — 08:00–10:00 yields 08:00 and 09:00. See regionWindow.
// ---------------------------------------------------------------------------

type Region = 'pst' | 'eastern' | 'apac'
type Window = { startHourJST: number; endHourJST: number; region: Region }

// The three US-Pacific zones get the early-morning-Tokyo window.
const PACIFIC_TZ = new Set([
  'America/Los_Angeles',
  'America/Vancouver',
  'America/Tijuana',
])

// Pure region → JST window map. Order matters: Pacific set first, then the
// America/* catch-all (Eastern/Central/Mountain, incl. New York & Edmonton),
// then APAC by prefix, then the default. Europe / unknown fall to the APAC
// (Tokyo) window — a deliberate default (client specified only three regions).
function regionWindow(tz: string): Window {
  if (PACIFIC_TZ.has(tz)) return { startHourJST: 8, endHourJST: 10, region: 'pst' }
  if (tz.startsWith('America/')) return { startHourJST: 20, endHourJST: 23, region: 'eastern' }
  if (/^(Asia|Australia|Pacific)\//.test(tz)) return { startHourJST: 10, endHourJST: 17, region: 'apac' }
  return { startHourJST: 10, endHourJST: 17, region: 'apac' } // default: Europe / unknown
}

// Detect the visitor's IANA timezone, SSR-safe. On the server (or if Intl is
// unavailable) we default to Asia/Tokyo so the first render is stable and the
// APAC window is shown; the component refines to the real zone on mount.
function detectTimeZone(): string {
  if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat !== 'function') return 'Asia/Tokyo'
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Tokyo'
  } catch {
    return 'Asia/Tokyo'
  }
}

type Ymd = { y: number; m0: number; d: number }
// One bookable session hour: `label` is what the visitor reads (their local
// time, prefixed with the local day when it differs from the JST date);
// `value` is the rich, unambiguous string that gets submitted/stored.
type TimeOption = { value: string; label: string; shifted: boolean }

// Which calendar day `instant` falls on in `tz` (for date-shift detection).
function dayInTz(instant: Date, tz: string): Ymd {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric',
  }).formatToParts(instant)
  const get = (t: string) => Number(parts.find((p) => p.type === t)?.value)
  return { y: get('year'), m0: get('month') - 1, d: get('day') }
}

function clock(instant: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: 'numeric', minute: '2-digit', hour12: true,
  }).format(instant) // e.g. "7:00 AM"
}

// Zone abbreviation. Our Tokyo studio zone is branded "JST" directly: current
// CLDR renders Asia/Tokyo's short name as "GMT+9" in English, so we name our
// own known zone rather than depend on Intl for it. Every other zone uses
// Intl's honest short name — EDT/PDT for the Americas, "GMT+n" elsewhere.
function abbrev(instant: Date, tz: string): string {
  if (tz === 'Asia/Tokyo') return 'JST'
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, timeZoneName: 'short',
  }).formatToParts(instant)
  return parts.find((p) => p.type === 'timeZoneName')?.value ?? ''
}

function localTime(instant: Date, tz: string): string {
  return `${clock(instant, tz)} ${abbrev(instant, tz)}` // e.g. "7:00 AM EDT" / "10:00 AM JST"
}

function localDayPrefix(instant: Date, tz: string): string {
  const wd = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' }).format(instant)
  const md = new Intl.DateTimeFormat('en-US', { timeZone: tz, month: 'short', day: 'numeric' }).format(instant)
  return `${wd} ${md}` // e.g. "Tue Jul 14"
}

// The visitor's local clock hour (0–23) for an instant. '2-digit'/hour12:false
// can render midnight as "24" in some engines, so normalise it to 0.
function hourInTz(instant: Date, tz: string): number {
  const h = Number(
    new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', hour12: false }).format(instant)
  )
  return h === 24 ? 0 : h
}

// Comfortable local hours: no session should start before 7 AM or after 9 PM in
// the VISITOR's own timezone. The three defined regional windows already fall
// inside this band (Eastern lands 7–9 AM, Pacific 4–5 PM, Tokyo 10 AM–4 PM), so
// it never trims them — it mainly drops the pre-dawn slots the default Tokyo
// window would otherwise offer a European visitor.
const COMFORT_MIN_HOUR = 7
const COMFORT_MAX_HOUR = 21

// Build the hourly slots for one JST calendar date, converted to `tz`. The
// conversion is DST-correct: each JST hour `h` is anchored to a concrete UTC
// instant (JST = UTC+9, so subtract 9; negative hours roll to the prior UTC
// day), then formatted in both the visitor's zone and Tokyo. When the local
// day differs from the JST date (the Pacific 08–10 JST window lands the prior
// afternoon), the local day is surfaced in both label and value. Slots outside
// the comfortable-hours band are dropped; if that would leave nothing (a few
// far-offset zones), the full window is kept so booking is always possible.
function buildTimeOptions(date: Ymd, tz: string): TimeOption[] {
  const { startHourJST, endHourJST } = regionWindow(tz)
  const all: (TimeOption & { localHour: number })[] = []
  for (let h = startHourJST; h < endHourJST; h++) {
    const instant = new Date(Date.UTC(date.y, date.m0, date.d, h - 9, 0, 0))
    const local = localTime(instant, tz)          // "4:00 PM PDT"
    const jst = localTime(instant, 'Asia/Tokyo')  // "8:00 AM JST"
    // Drop the JST companion when the visitor is already on Tokyo time — it
    // would just repeat the local label.
    const jstTag = local === jst ? '' : ` (${jst})`
    const localDay = dayInTz(instant, tz)
    const shifted = localDay.y !== date.y || localDay.m0 !== date.m0 || localDay.d !== date.d
    const localHour = hourInTz(instant, tz)
    if (shifted) {
      const prefix = localDayPrefix(instant, tz)  // "Tue Jul 14"
      all.push({
        value: `${prefix}, ${local}${jstTag}`,    // "Tue Jul 14, 4:00 PM PDT (8:00 AM JST)"
        label: `${prefix}, ${local}`,
        shifted,
        localHour,
      })
    } else {
      all.push({
        value: `${local}${jstTag}`,               // "7:00 AM EDT (10:00 PM JST)"
        label: local,
        shifted,
        localHour,
      })
    }
  }
  const comfortable = all.filter(
    (o) => o.localHour >= COMFORT_MIN_HOUR && o.localHour <= COMFORT_MAX_HOUR
  )
  const chosen = comfortable.length > 0 ? comfortable : all
  return chosen.map(({ localHour: _localHour, ...o }) => o)
}

// The four folio services (see folioData.tsx categories). Slugs must match
// the zod enum in /api/bookings and the label map in lib/email.ts.
const SERVICES = [
  { value: 'creative-strategy', label: 'Creative Strategy' },
  { value: 'ai-enablement', label: 'AI Enablement' },
  { value: 'production', label: 'Production' },
  { value: 'market-expansion', label: 'Market Expansion' },
]

// Static build: the booking form submits by opening a pre-filled email here.
const STUDIO_EMAIL = 'booking@beedstu.com'

// Booking horizon: ~6.5 weeks ahead (the footnote says "up to six weeks").
const HORIZON_DAYS = 45

function startOfToday() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

// Bookings run on weekdays only, Monday–Friday.
function isWeekday(d: Date) {
  const day = d.getDay()
  return day >= 1 && day <= 5
}

// Earliest selectable date: 3 business days out (weekdays only, so Sat/Sun
// are neither counted nor landed on). Client-approved lead time, 2026-07-10.
function minimumDate() {
  const minDate = startOfToday()
  let added = 0
  while (added < 3) {
    minDate.setDate(minDate.getDate() + 1)
    if (isWeekday(minDate)) added++
  }
  return minDate
}

type DateGroup = { month: string; options: { value: string; label: string; ymd: Ymd }[] }

// Bookable dates from the lead-time minimum out to the horizon, weekends
// (Sat + Sun) closed, grouped by month for <optgroup>. Option `value` keeps
// the exact long format the calendar used to submit ("Wednesday, July 15,
// 2026") so the API payload is unchanged; the visible label is the compact
// "Wed, Jul 15".
function buildDateGroups(): DateGroup[] {
  const today = startOfToday()
  const horizon = new Date(today)
  horizon.setDate(horizon.getDate() + HORIZON_DAYS)

  const groups: DateGroup[] = []
  for (const d = minimumDate(); d <= horizon; d.setDate(d.getDate() + 1)) {
    if (!isWeekday(d)) continue
    const month = d.toLocaleDateString('en-US', { month: 'long' })
    const value = d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const label = d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
    // Stash the JST calendar date so the time converter needn't reparse the
    // long `value` string. `d` is a local Date whose y/m/d ARE the JST date.
    const ymd: Ymd = { y: d.getFullYear(), m0: d.getMonth(), d: d.getDate() }
    let group = groups[groups.length - 1]
    if (!group || group.month !== month) {
      group = { month, options: [] }
      groups.push(group)
    }
    group.options.push({ value, label, ymd })
  }
  return groups
}

type AnimState = 'idle' | 'hidden' | 'visible'

// House reveal hook — same tri-state pattern as Impact.tsx: SSR/no-JS renders
// 'idle' (styled like 'visible', never invisible); the hidden state is only
// entered client-side after mount; prefers-reduced-motion skips straight to
// 'visible'; the observer fires once and disconnects.
function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [state, setState] = useState<AnimState>('idle')

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setState('visible')
      return
    }

    setState('hidden')
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('visible')
          observer.disconnect()
        }
      },
      { threshold, rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, state, dataAnimate: state === 'idle' ? undefined : state }
}

// Soft stagger for the stanzas (~120ms apart, consumed by .cg-reveal CSS).
const stagger = (i: number) => ({ '--stagger': `${i * 120}ms` }) as CSSProperties

// Reveal wrapper: applies the house fade-up class + its stagger slot.
function Reveal({ i, as: Tag = 'div', className = '', children }: {
  i: number
  as?: 'div' | 'p' | 'h2'
  className?: string
  children: ReactNode
}) {
  return (
    <Tag className={`cg-reveal ${className}`.trim()} style={stagger(i)}>
      {children}
    </Tag>
  )
}

const EMPTY_FORM = { service: '', date: '', time: '', name: '', email: '', message: '' }

export default function BookingCalendar() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorNote, setErrorNote] = useState('')
  // Snapshot of the confirmed booking, shown after a successful submit.
  const [confirmed, setConfirmed] = useState<{
    name: string
    email: string
    service: string
    date: string
    time: string
  } | null>(null)

  // Two-step flow (2026-07-10): step 1 "details" (the request + who you are),
  // step 2 "message" (the optional note + the true Submit). `animateSteps`
  // gates the page-turn animation so it only plays on an actual step change,
  // not on first mount (where the scroll reveal already handles arrival).
  const [step, setStep] = useState<'details' | 'message'>('details')
  const [animateSteps, setAnimateSteps] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const dateGroups = useMemo(() => buildDateGroups(), [])
  const { ref, dataAnimate } = useInView<HTMLDivElement>(0.2)

  // When the second leaf appears, move focus into the optional-note field so
  // keyboard visitors land where the action is. Skips the initial mount
  // (step starts 'details') and any return to step 1.
  useEffect(() => {
    if (step === 'message') textareaRef.current?.focus()
  }, [step])

  // Detected visitor timezone. Server + first client render use Asia/Tokyo (so
  // SSR/hydration match and the APAC window shows); refine on mount.
  const [tz, setTz] = useState('Asia/Tokyo')
  useEffect(() => { setTz(detectTimeZone()) }, [])

  // Lookup: submitted date value → its JST {y,m0,d}; and the first bookable
  // date, used to compute meaningful times before a date is chosen.
  const dateMap = useMemo(() => {
    const map = new Map<string, Ymd>()
    for (const g of dateGroups) for (const o of g.options) map.set(o.value, o.ymd)
    return map
  }, [dateGroups])
  const firstYmd = dateGroups[0]?.options[0]?.ymd

  // Hourly slots for the chosen JST date (or the first available one), in the
  // visitor's timezone. Rebuilt whenever the date or the detected tz changes
  // (DST-correct: the conversion depends on the specific date).
  const timeOptions = useMemo(() => {
    const ymd = (form.date && dateMap.get(form.date)) || firstYmd
    return ymd ? buildTimeOptions(ymd, tz) : []
  }, [form.date, tz, dateMap, firstYmd])

  const set = (field: keyof typeof EMPTY_FORM) =>
    (e: { target: { value: string } }) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
      if (status === 'error') {
        setStatus('idle')
        setErrorNote('')
      }
    }

  // Changing the date re-derives the local times, so drop any stale time pick.
  const setDate = (e: { target: { value: string } }) => {
    setForm((prev) => ({ ...prev, date: e.target.value, time: '' }))
    if (status === 'error') {
      setStatus('idle')
      setErrorNote('')
    }
  }

  // Fallback for browsers without CSS `field-sizing: content` — grow the
  // optional-message underline with its content.
  const growArea = (e: FormEvent<HTMLTextAreaElement>) => {
    if (typeof CSS !== 'undefined' && CSS.supports('field-sizing', 'content')) return
    const el = e.currentTarget
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  // Step 1 "Send the request →" no longer posts — it validates the details
  // (service · name · email; date/time are optional) and turns to step 2.
  // The true POST happens on step 2's Submit. One form, branched by `step`,
  // so the Enter key does the right thing in either leaf.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (step === 'details') {
      const { service, name, email } = form
      if (!service || !name.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
        setStatus('error')
        setErrorNote('That still needs a service, your name, and an email we can reply to.')
        return
      }
      setStatus('idle')
      setErrorNote('')
      setAnimateSteps(true)
      setStep('message')
      return
    }

    setErrorNote('')
    // Date and time are optional; an explicit "N/A" dropdown choice and an
    // untouched blank both read as "N/A".
    const date = form.date && form.date !== 'N/A' ? form.date : 'N/A'
    const time = form.time && form.time !== 'N/A' ? form.time : 'N/A'
    const serviceLabel = SERVICES.find((s) => s.value === form.service)?.label ?? form.service

    // Static build — no server. Compose a pre-filled email to the studio and open
    // the visitor's mail client, then show the confirmation card.
    const subject = `Session request — ${serviceLabel}`
    const body = [
      `Service: ${serviceLabel}`,
      `Date: ${date}`,
      `Time: ${time}`,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      '',
      form.message.trim() ? `Note: ${form.message.trim()}` : 'Note: —',
    ].join('\n')
    const mailto = `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    setConfirmed({ name: form.name, email: form.email, service: serviceLabel, date, time })
    window.location.href = mailto
    setStatus('success')
    setForm(EMPTY_FORM)
    setStep('details')
    setAnimateSteps(false)
  }

  // Return to step 1 with every field preserved (no form reset).
  const handleBack = () => {
    setAnimateSteps(true)
    setStep('details')
    if (status === 'error') {
      setStatus('idle')
      setErrorNote('')
    }
  }

  const handleBookAnother = () => {
    setConfirmed(null)
    setStatus('idle')
    setStep('details')
    setAnimateSteps(false)
  }

  return (
    <section id="contact" className="bg-light py-20 px-10">
      <div className="container-x">
        <div ref={ref} className="concierge" data-animate={dataAnimate}>
          <Reveal i={0} as="h2" className="eyebrow mb-16">Book A Session</Reveal>

          {status === 'success' && confirmed ? (
            <div className="booking-info max-w-[640px]">
              <h3 className="text-2xl mb-3">Almost there.</h3>
              <p className="text-sm leading-[1.8] text-[#666] mb-8">
                Thank you, {confirmed.name} — your email app should have opened with your
                request ready to send to{' '}
                <strong className="text-black">{STUDIO_EMAIL}</strong>. Press send and
                we&apos;ll be in touch within one business day. If nothing opened, just write
                to us at that address with the details below.
              </p>

              <dl className="border-t border-black">
                {[
                  ['Service', confirmed.service],
                  ['Date', confirmed.date],
                  ['Time', confirmed.time],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[120px_1fr] gap-4 py-4 border-b border-[#e0e0e0]"
                  >
                    <dt className="eyebrow text-[#999]" style={{ letterSpacing: '1px' }}>
                      {label}
                    </dt>
                    <dd className="text-sm">{value}</dd>
                  </div>
                ))}
              </dl>

              <button type="button" className="concierge-cta" onClick={handleBookAnother}>
                Request another session →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {step === 'details' ? (
                <div
                  key="details"
                  className={animateSteps ? 'cg-step cg-step--anim' : 'cg-step'}
                >
                  <Reveal i={1} as="p" className="sentence">
                    I&rsquo;d like a{' '}
                    <select
                      className="blank"
                      aria-label="Service"
                      value={form.service}
                      onChange={set('service')}
                      data-empty={form.service ? undefined : ''}
                    >
                      <option value="" disabled>service</option>
                      {SERVICES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>{' '}
                    session on{' '}
                    <select
                      className="blank"
                      aria-label="Date (optional)"
                      value={form.date}
                      onChange={setDate}
                      data-empty={form.date ? undefined : ''}
                    >
                      <option value="">date</option>
                      <option value="N/A">N/A</option>
                      {dateGroups.map((g) => (
                        <optgroup key={g.month} label={g.month}>
                          {g.options.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>{' '}
                    at{' '}
                    <select
                      className="blank"
                      aria-label="Time, shown in your local timezone (optional)"
                      value={form.time}
                      onChange={set('time')}
                      data-empty={form.time ? undefined : ''}
                    >
                      <option value="">time</option>
                      <option value="N/A">N/A</option>
                      {timeOptions.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>.
                  </Reveal>

                  <Reveal i={2} as="p" className="sentence">
                    My name is{' '}
                    <input
                      className="blank"
                      type="text"
                      placeholder="your name"
                      size={12}
                      aria-label="Your name"
                      value={form.name}
                      onChange={set('name')}
                    />{' '}
                    and you can reach me at{' '}
                    <input
                      className="blank"
                      type="email"
                      placeholder="email address"
                      size={16}
                      aria-label="Email"
                      value={form.email}
                      onChange={set('email')}
                    />.
                  </Reveal>

                  <Reveal i={3}>
                    <button type="submit" className="concierge-cta">
                      Send the request →
                    </button>
                    {status === 'error' && errorNote && (
                      <p className="concierge-error" role="status">{errorNote}</p>
                    )}
                    <p className="concierge-note">
                      Weekdays only · times shown in your timezone ({tz}) · we hold sessions from our Tokyo studio.
                    </p>
                  </Reveal>
                </div>
              ) : (
                <div
                  key="message"
                  className={animateSteps ? 'cg-step cg-step--anim' : 'cg-step'}
                >
                  <p className="sentence sentence--soft">
                    The project, idea, or challenge I&rsquo;d like to talk about:{' '}
                    <textarea
                      ref={textareaRef}
                      className="blank blank--area"
                      rows={1}
                      placeholder="optional — a line or two is plenty"
                      aria-label="Your project, idea, or challenge (optional)"
                      value={form.message}
                      onChange={set('message')}
                      onInput={growArea}
                    />
                  </p>

                  <div className="concierge-actions">
                    <button type="button" className="concierge-back" onClick={handleBack}>
                      ← back
                    </button>
                    <button type="submit" className="concierge-cta" disabled={status === 'loading'}>
                      {status === 'loading' ? 'Sending…' : 'Submit'}
                    </button>
                  </div>
                  {status === 'error' && errorNote && (
                    <p className="concierge-error" role="status">{errorNote}</p>
                  )}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
