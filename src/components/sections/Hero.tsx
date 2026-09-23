'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// In-memory flag (resets on full page load): the hero animates on every fresh
// visit or reload, but sits static when the visitor navigates back to the
// homepage from another page of the site (client-side navigation keeps the
// module alive, so the flag survives; a reload clears it).
let playedThisPageLoad = false

function charDelay() {
  const rand = Math.random()
  if (rand > 0.85) return Math.random() * 60 + 120 // occasional slow
  if (rand > 0.75) return Math.random() * 20 + 20 // fast burst
  if (rand > 0.6) return Math.random() * 40 + 50 // medium-slow
  return Math.random() * 30 + 40 // moderate
}

// ---- Hero rain (ported from the Studio_Landing study, 2026-09-23) ----
// Sixteen drops fall once the typewriter has finished; six of them are wired
// to the headline and light the water hidden under the letters as their ring
// crosses. When the water is still the hover window wipes itself across the
// title, right to left. Desktop only: the reveal needs .hero-rainbow, which
// only renders there.
const RAIN_OUT = 11000 // ms from the first drop to the last ring fading
const WIPE = 1900 // ms for the window to cross the title

type Ring = { c: string; s: Record<string, string> }
const DROPS: { x: string; y: string; rings: Ring[] }[] = [
  { x: '18%', y: '22%', rings: [
    { c: 'hr-c', s: { '--d': '14%', '--t': '2.24s', '--delay': '0.17s', '--a': '.24', '--w': '1px', '--b': '1.6px', '--from': '120deg', '--spin': '240deg' } },
    { c: 'hr-c', s: { '--d': '14%', '--t': '2.24s', '--delay': '0.47s', '--a': '.24', '--w': '1px', '--b': '1.6px', '--from': '160deg', '--spin': '240deg' } },
    { c: 'hr-c', s: { '--d': '14%', '--t': '2.24s', '--delay': '0.77s', '--a': '.24', '--w': '1px', '--b': '1.6px', '--from': '200deg', '--spin': '240deg' } },
  ] },
  { x: '64%', y: '14%', rings: [
    { c: 'hr-a', s: { '--d': '22%', '--t': '2.38s', '--delay': '0.50s', '--a': '.32', '--w': '1px', '--b': '1.6px', '--from': '120deg', '--spin': '240deg' } },
    { c: 'hr-a', s: { '--d': '22%', '--t': '2.38s', '--delay': '0.80s', '--a': '.32', '--w': '1px', '--b': '1.6px', '--from': '160deg', '--spin': '240deg' } },
    { c: 'hr-a', s: { '--d': '22%', '--t': '2.38s', '--delay': '1.10s', '--a': '.32', '--w': '1px', '--b': '1.6px', '--from': '200deg', '--spin': '240deg' } },
  ] },
  { x: '84%', y: '58%', rings: [
    { c: 'hr-a', s: { '--d': '110%', '--t': '3.91s', '--delay': '0.86s', '--a': '.26', '--w': '6px', '--b': '14px', '--from': '30deg', '--spin': '240deg' } },
    { c: 'hr-a', s: { '--d': '110%', '--t': '3.91s', '--delay': '1.16s', '--a': '.26', '--w': '6px', '--b': '14px', '--from': '70deg', '--spin': '240deg' } },
    { c: 'hr-a', s: { '--d': '110%', '--t': '3.91s', '--delay': '1.46s', '--a': '.26', '--w': '6px', '--b': '14px', '--from': '110deg', '--spin': '240deg' } },
  ] },
  { x: '38%', y: '70%', rings: [
    { c: 'hr-a', s: { '--d': '80%', '--t': '3.39s', '--delay': '1.35s', '--a': '.46', '--w': '1.5px', '--b': '.4px', '--from': '90deg', '--spin': '120deg' } },
    { c: 'hr-a', s: { '--d': '80%', '--t': '3.39s', '--delay': '1.65s', '--a': '.46', '--w': '1.5px', '--b': '.4px', '--from': '130deg', '--spin': '120deg' } },
    { c: 'hr-a', s: { '--d': '80%', '--t': '3.39s', '--delay': '1.95s', '--a': '.46', '--w': '1.5px', '--b': '.4px', '--from': '170deg', '--spin': '120deg' } },
  ] },
  { x: '72%', y: '86%', rings: [
    { c: 'hr-a', s: { '--d': '22%', '--t': '2.38s', '--delay': '1.79s', '--a': '.32', '--w': '1px', '--b': '1.6px', '--from': '330deg', '--spin': '-150deg' } },
    { c: 'hr-a', s: { '--d': '22%', '--t': '2.38s', '--delay': '2.09s', '--a': '.32', '--w': '1px', '--b': '1.6px', '--from': '10deg', '--spin': '-150deg' } },
    { c: 'hr-a', s: { '--d': '22%', '--t': '2.38s', '--delay': '2.39s', '--a': '.32', '--w': '1px', '--b': '1.6px', '--from': '50deg', '--spin': '-150deg' } },
  ] },
  { x: '8%', y: '62%', rings: [
    { c: 'hr-b', s: { '--d': '44%', '--t': '2.76s', '--delay': '2.21s', '--a': '.52', '--w': '1.5px', '--b': '.4px', '--from': '270deg', '--spin': '120deg' } },
    { c: 'hr-b', s: { '--d': '44%', '--t': '2.76s', '--delay': '2.51s', '--a': '.52', '--w': '1.5px', '--b': '.4px', '--from': '310deg', '--spin': '120deg' } },
    { c: 'hr-b', s: { '--d': '44%', '--t': '2.76s', '--delay': '2.81s', '--a': '.52', '--w': '1.5px', '--b': '.4px', '--from': '350deg', '--spin': '120deg' } },
  ] },
  { x: '52%', y: '42%', rings: [
    { c: 'hr-b', s: { '--d': '110%', '--t': '3.91s', '--delay': '2.67s', '--a': '.34', '--w': '6px', '--b': '14px', '--from': '300deg', '--spin': '180deg' } },
    { c: 'hr-b', s: { '--d': '110%', '--t': '3.91s', '--delay': '2.97s', '--a': '.34', '--w': '6px', '--b': '14px', '--from': '340deg', '--spin': '180deg' } },
  ] },
  { x: '92%', y: '18%', rings: [
    { c: 'hr-c', s: { '--d': '150%', '--t': '4.6s', '--delay': '2.99s', '--a': '.3', '--w': '6px', '--b': '14px', '--from': '240deg', '--spin': '180deg' } },
    { c: 'hr-c', s: { '--d': '150%', '--t': '4.6s', '--delay': '3.29s', '--a': '.3', '--w': '6px', '--b': '14px', '--from': '280deg', '--spin': '180deg' } },
  ] },
  { x: '26%', y: '90%', rings: [
    { c: 'hr-a', s: { '--d': '14%', '--t': '2.24s', '--delay': '3.47s', '--a': '.28', '--w': '1px', '--b': '1.6px', '--from': '270deg', '--spin': '-150deg' } },
    { c: 'hr-a', s: { '--d': '14%', '--t': '2.24s', '--delay': '3.77s', '--a': '.28', '--w': '1px', '--b': '1.6px', '--from': '310deg', '--spin': '-150deg' } },
  ] },
  { x: '58%', y: '64%', rings: [
    { c: 'hr-b', s: { '--d': '60%', '--t': '3.04s', '--delay': '3.95s', '--a': '.4', '--w': '1.5px', '--b': '.4px', '--from': '120deg', '--spin': '-150deg' } },
    { c: 'hr-b', s: { '--d': '60%', '--t': '3.04s', '--delay': '4.25s', '--a': '.4', '--w': '1.5px', '--b': '.4px', '--from': '160deg', '--spin': '-150deg' } },
    { c: 'hr-b', s: { '--d': '60%', '--t': '3.04s', '--delay': '4.55s', '--a': '.4', '--w': '1.5px', '--b': '.4px', '--from': '200deg', '--spin': '-150deg' } },
  ] },
  { x: '44%', y: '8%', rings: [
    { c: 'hr-b', s: { '--d': '150%', '--t': '4.6s', '--delay': '4.36s', '--a': '.26', '--w': '6px', '--b': '14px', '--from': '60deg', '--spin': '120deg' } },
    { c: 'hr-b', s: { '--d': '150%', '--t': '4.6s', '--delay': '4.66s', '--a': '.26', '--w': '6px', '--b': '14px', '--from': '100deg', '--spin': '120deg' } },
    { c: 'hr-b', s: { '--d': '150%', '--t': '4.6s', '--delay': '4.96s', '--a': '.26', '--w': '6px', '--b': '14px', '--from': '140deg', '--spin': '120deg' } },
  ] },
  { x: '80%', y: '34%', rings: [
    { c: 'hr-b', s: { '--d': '110%', '--t': '3.91s', '--delay': '4.74s', '--a': '.26', '--w': '6px', '--b': '14px', '--from': '240deg', '--spin': '180deg' } },
    { c: 'hr-b', s: { '--d': '110%', '--t': '3.91s', '--delay': '5.04s', '--a': '.26', '--w': '6px', '--b': '14px', '--from': '280deg', '--spin': '180deg' } },
  ] },
  { x: '14%', y: '40%', rings: [
    { c: 'hr-a', s: { '--d': '14%', '--t': '2.24s', '--delay': '5.21s', '--a': '.28', '--w': '1px', '--b': '1.6px', '--from': '210deg', '--spin': '120deg' } },
    { c: 'hr-a', s: { '--d': '14%', '--t': '2.24s', '--delay': '5.51s', '--a': '.28', '--w': '1px', '--b': '1.6px', '--from': '250deg', '--spin': '120deg' } },
    { c: 'hr-a', s: { '--d': '14%', '--t': '2.24s', '--delay': '5.81s', '--a': '.28', '--w': '1px', '--b': '1.6px', '--from': '290deg', '--spin': '120deg' } },
  ] },
  { x: '68%', y: '50%', rings: [
    { c: 'hr-a', s: { '--d': '80%', '--t': '3.39s', '--delay': '5.49s', '--a': '.4', '--w': '1.5px', '--b': '.4px', '--from': '90deg', '--spin': '120deg' } },
    { c: 'hr-a', s: { '--d': '80%', '--t': '3.39s', '--delay': '5.79s', '--a': '.4', '--w': '1.5px', '--b': '.4px', '--from': '130deg', '--spin': '120deg' } },
    { c: 'hr-a', s: { '--d': '80%', '--t': '3.39s', '--delay': '6.09s', '--a': '.4', '--w': '1.5px', '--b': '.4px', '--from': '170deg', '--spin': '120deg' } },
  ] },
  { x: '34%', y: '50%', rings: [
    { c: 'hr-b', s: { '--d': '9%', '--t': '2.16s', '--delay': '6.06s', '--a': '.32', '--w': '1px', '--b': '1.6px', '--from': '330deg', '--spin': '120deg' } },
    { c: 'hr-b', s: { '--d': '9%', '--t': '2.16s', '--delay': '6.36s', '--a': '.32', '--w': '1px', '--b': '1.6px', '--from': '10deg', '--spin': '120deg' } },
    { c: 'hr-b', s: { '--d': '9%', '--t': '2.16s', '--delay': '6.66s', '--a': '.32', '--w': '1px', '--b': '1.6px', '--from': '50deg', '--spin': '120deg' } },
  ] },
  { x: '90%', y: '80%', rings: [
    { c: 'hr-a', s: { '--d': '110%', '--t': '3.91s', '--delay': '6.38s', '--a': '.26', '--w': '6px', '--b': '14px', '--from': '30deg', '--spin': '-150deg' } },
    { c: 'hr-a', s: { '--d': '110%', '--t': '3.91s', '--delay': '6.68s', '--a': '.26', '--w': '6px', '--b': '14px', '--from': '70deg', '--spin': '-150deg' } },
    { c: 'hr-a', s: { '--d': '110%', '--t': '3.91s', '--delay': '6.98s', '--a': '.26', '--w': '6px', '--b': '14px', '--from': '110deg', '--spin': '-150deg' } },
  ] },
]

// The six drops wired to the headline, as a fraction of the hero box. Order
// and values match the --r1..--r6 keyframes in globals.css.
const LIT = [
  { x: '0.1800', y: '0.2200' },
  { x: '0.3800', y: '0.7000' },
  { x: '0.5200', y: '0.4200' },
  { x: '0.5800', y: '0.6400' },
  { x: '0.8000', y: '0.3400' },
  { x: '0.6800', y: '0.5000' },
]

export default function Hero({ lang = 'en' }: { lang?: Locale }) {
  const t = getDictionary(lang).hero
  const LINES = [t.line1, t.line2]

  const [typed, setTyped] = useState<string[]>(['', ''])
  const [activeLine, setActiveLine] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [cursorBlinkOut, setCursorBlinkOut] = useState(false)
  // The neon hover reveal arms once the typewriter has finished
  const [revealReady, setRevealReady] = useState(false)
  // Mobile shows the typewriter only — the neon hover layer renders solely on
  // hover-capable desktop viewports (same gate as the Explore study cards)
  const [isDesktop, setIsDesktop] = useState(false)
  // The rain, and the two ways it touches the headline
  const [raining, setRaining] = useState(false)
  const [lit, setLit] = useState(false)
  const [wiping, setWiping] = useState(false)
  const cancelled = useRef(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  // The typewriter effect closes over isDesktop, so read it through a ref
  const desktopRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    const sync = () => {
      setIsDesktop(mq.matches)
      desktopRef.current = mq.matches
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Stripe palette (client-supplied 2026-08-07): random-width vertical strips
  // of these colors run across the full headline (background-clip: text).
  // The arrangement is rolled fresh per page load — built client-side only so
  // SSR markup stays deterministic.
  const [stripes, setStripes] = useState<string | null>(null)
  useEffect(() => {
    const PALETTE = ['#faeb2c', '#f52789', '#e900ff', '#1685f8', '#3d144c']
    const stops: string[] = []
    let pos = 0
    let prev = -1
    while (pos < 100) {
      let idx = Math.floor(Math.random() * PALETTE.length)
      if (idx === prev) idx = (idx + 1) % PALETTE.length // no touching twins
      prev = idx
      const end = Math.min(100, pos + 1.2 + Math.random() * 2.8) // 1.2–4% wide, dense
      stops.push(`${PALETTE[idx]} ${pos.toFixed(2)}% ${end.toFixed(2)}%`)
      pos = end
    }
    setStripes(`linear-gradient(90deg, ${stops.join(', ')})`)
  }, [])

  // Feed the cursor position to the rainbow reveal mask (see .hero-rainbow)
  const handleTitleMove = (e: React.MouseEvent) => {
    const el = titleRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  useEffect(() => {
    cancelled.current = false

    if (playedThisPageLoad) {
      setTyped([...LINES])
      setActiveLine(-1) // renders no cursor at all
      setCursorBlinkOut(true)
      setRevealReady(true) // no animation to wait for — reveal armed at once
      return
    }
    playedThisPageLoad = true

    async function run() {
      for (let i = 0; i < LINES.length; i++) {
        setActiveLine(i)
        const words = LINES[i].split(' ')
        let full = ''

        for (const word of words) {
          for (const char of word) {
            if (cancelled.current) return
            full += char
            setTyped((prev) => {
              const next = [...prev]
              next[i] = full
              return next
            })
            await sleep(charDelay())
          }
          full += ' '
          setTyped((prev) => {
            const next = [...prev]
            next[i] = full
            return next
          })
          await sleep(Math.random() * 170 + 80)
        }

        if (i < LINES.length - 1) await sleep(300)
      }

      // Blink the final cursor a couple times, then fade out
      for (let b = 0; b < 4; b++) {
        if (cancelled.current) return
        setCursorVisible((v) => !v)
        await sleep(300)
      }
      setCursorVisible(true)
      setCursorBlinkOut(true)

      setRevealReady(true)

      // ---- the rain, and what it does to the headline ----
      const title = titleRef.current
      const hero = heroRef.current
      if (!desktopRef.current || !title || !hero) return

      // Hand the mask each wired ring's centre in the title's own
      // coordinates; the radii themselves are keyframed against --hw.
      const hb = hero.getBoundingClientRect()
      const box = title.getBoundingClientRect()
      title.style.setProperty('--hw', `${hb.width}px`)
      title.style.setProperty('--hh', `${hb.height}px`)
      title.style.setProperty('--ox', `${hb.left - box.left}px`)
      title.style.setProperty('--oy', `${hb.top - box.top}px`)
      LIT.forEach((c, i) => {
        title.style.setProperty(`--c${i + 1}x`, `calc(var(--ox) + var(--hw) * ${c.x})`)
        title.style.setProperty(`--c${i + 1}y`, `calc(var(--oy) + var(--hh) * ${c.y})`)
      })

      // The closing wipe travels across the letters, not the full-width box:
      // it drops from the first line's centre to the second's as it goes.
      const rows = title.querySelectorAll<HTMLElement>('.hero-ink > div')
      const spans = title.querySelectorAll<HTMLElement>('.hero-ink .typewriter-text')
      if (rows.length === 2 && spans.length === 2) {
        const r1 = rows[0].getBoundingClientRect()
        const r2 = rows[1].getBoundingClientRect()
        const s1 = spans[0].getBoundingClientRect()
        const s2 = spans[1].getBoundingClientRect()
        title.style.setProperty('--y1', `${r1.top + r1.height / 2 - box.top}px`)
        title.style.setProperty('--y2', `${r2.top + r2.height / 2 - box.top}px`)
        title.style.setProperty('--x0', `${Math.max(s1.right, s2.right) - box.left + 100}px`)
        title.style.setProperty('--x1', '-100px')
      }

      setRaining(true)
      setLit(true)
      await sleep(RAIN_OUT) // the last ring has faded
      if (cancelled.current) return
      setLit(false)
      setWiping(true)
      await sleep(WIPE + 60)
      if (cancelled.current) return
      setWiping(false) // hand the window back to the pointer
    }

    run()
    return () => {
      cancelled.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  return (
    <section
      ref={heroRef}
      className={`hero min-h-screen flex items-center px-10 py-16${raining ? ' rain-on' : ''}`}
    >
      {/* Rain on still water — hairline rings carrying the house colours on
          their rims, through a shallow depth of field. Over the copy, so the
          soft foreground rings pass across the words. */}
      {isDesktop && (
        <div className="hero-fx" aria-hidden="true">
          {DROPS.map((d, i) => (
            <div
              key={i}
              className="hero-drop"
              style={{ '--x': d.x, '--y': d.y } as React.CSSProperties}
            >
              {d.rings.map((r, j) => (
                <i key={j} className={`hero-ring ${r.c}`} style={r.s as React.CSSProperties} />
              ))}
            </div>
          ))}
        </div>
      )}
      <div className="container-x w-full max-w-full">
        <h1
          ref={titleRef}
          // reveal-ready (and with it every hover rule — including the mask
          // hole punched in the ink) only ever applies on desktop; mobile is
          // purely the typewriter.
          className={`hero-title text-5xl leading-[1.2]${revealReady && isDesktop ? ' reveal-ready' : ''}${lit ? ' lit' : ''}${wiping ? ' wipe' : ''}`}
          onMouseMove={isDesktop ? handleTitleMove : undefined}
        >
          {/* Black ink layer — while the reveal is hovered, a hole matching
              the reveal circle is masked out of it so the rippling neon
              underneath is the only text inside the circle */}
          <div className="hero-ink">
            <div className="mb-10">
              <span className="typewriter-text">{typed[0]}</span>
              {activeLine === 0 && (
                <span
                  className={`typewriter-cursor ${cursorBlinkOut ? 'blinking-out' : ''}`}
                  style={{ opacity: cursorVisible ? 1 : 0 }}
                />
              )}
            </div>
            <div className="mb-16">
              <span className="typewriter-text">{typed[1]}</span>
              {activeLine === 1 && (
                <span
                  className={`typewriter-cursor ${cursorBlinkOut ? 'blinking-out' : ''}`}
                  style={{ opacity: cursorVisible ? 1 : 0 }}
                />
              )}
            </div>
          </div>

          {/* Rainbow layer beneath the ink — revealed in a soft circle that
              follows the cursor while hovering the headline. Each line mirrors
              the black layer exactly, including an invisible stand-in for the
              typewriter cursor (its inline-block grows the line box a few px;
              without the stand-in the two layers drift apart vertically).
              Desktop only — mobile gets the plain typewriter. */}
          {isDesktop && (
          <div
            className="hero-rainbow"
            aria-hidden="true"
            style={stripes ? { backgroundImage: stripes } : undefined}
          >
            <div className="mb-10">
              {typed[0]}
              {activeLine === 0 && (
                <span
                  className="typewriter-cursor"
                  style={{ visibility: 'hidden' }}
                />
              )}
            </div>
            <div className="mb-16">
              {typed[1]}
              {activeLine === 1 && (
                <span
                  className="typewriter-cursor"
                  style={{ visibility: 'hidden' }}
                />
              )}
            </div>
          </div>
          )}
        </h1>

        <p className="hero-body">{t.body}</p>

        {/* Two pill buttons (design 03 "Ink and blue"): Work first in solid
            blue with a film-frame icon, then the booking section in frosted
            glass with a speech-bubble icon. */}
        <div className="hero-actions">
          <a href="#work" className="hero-btn hero-btn-work">
            <span className="hero-btn-ic" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                <path d="M7.5 5v14M16.5 5v14M3 9.5h4.5M3 14.5h4.5M16.5 9.5H21M16.5 14.5H21" />
              </svg>
            </span>
            {t.ctaWork}
          </a>
          <a href="#contact" className="hero-btn hero-btn-connect">
            <span className="hero-btn-ic" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M20.5 11.6c0 4.2-3.8 7.4-8.5 7.4-1 0-2-.1-2.9-.4L4 20l1.2-3.6C4.1 15 3.5 13.4 3.5 11.6c0-4.2 3.8-7.4 8.5-7.4s8.5 3.2 8.5 7.4z" />
                <path d="M9 11.6h.01M12 11.6h.01M15 11.6h.01" strokeWidth="2.6" />
              </svg>
            </span>
            {t.cta}
          </a>
        </div>
      </div>

      {/* Constant gentle water for the neon hover reveal (.hero-rainbow) —
          the revealed letters keep rippling under the circle. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="hero-bubble" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.022"
            numOctaves="2"
            seed="7"
            result="bubble"
          >
            <animate
              attributeName="baseFrequency"
              dur="9s"
              values="0.012 0.022; 0.016 0.028; 0.012 0.022"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="bubble"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </section>
  )
}
