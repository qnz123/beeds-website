'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Resolve on the caret's next blink boundary, where its opacity is 1, so the
// fade-out can take over without a jump. Falls back on a timer for anyone
// whose caret does not blink at all (reduced motion) or if the span is gone.
const nextBlinkBoundary = (el: HTMLElement | null) =>
  new Promise<void>((resolve) => {
    if (!el) return resolve()
    let done = false
    const finish = () => {
      if (done) return
      done = true
      clearTimeout(timer)
      el.removeEventListener('animationiteration', finish)
      resolve()
    }
    const timer = setTimeout(finish, 900)
    el.addEventListener('animationiteration', finish)
  })

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

// ---- Hero rain ----
// Seven drops fall once the typewriter has finished, purely as background.
// A drop is not one circle: each sends out one to three rings, the echoes
// following 0.3s apart and each carrying less light than the one before, the
// way real water does. They sit under every piece of copy and never touch it.
// The last drop is the exception — it is wider than the rest and its band
// carries the water hidden under the headline across the letters as it grows
// past them, then closes. Desktop only: that reveal needs .hero-rainbow,
// which only renders there.
//
// The closing ripple, centred off to the right so its band crosses the title
// from that side, so the band on the headline always sits exactly on a circle
// the visitor can see. Its timing lives here once, as CSS: the headline's mask is
// armed and disarmed by this very ring's own animation events, so the two can
// never drift — including in a background tab, where timers are throttled and
// CSS animations are not.
const CLOSER = { x: 0.72, y: 0.5, d: 160, t: '4.8s', delay: '5s' }

type Ring = { c: string; s: Record<string, string> }
const DROPS: { x: string; y: string; rings: Ring[] }[] = [
  { x: '18%', y: '22%', rings: [
    { c: 'hr-c', s: { '--d': '14%', '--t': '2.24s', '--delay': '0.17s', '--a': '.28', '--w': '1px', '--from': '120deg' } },
  ] },
  { x: '84%', y: '58%', rings: [
    { c: 'hr-a', s: { '--d': '110%', '--t': '3.91s', '--delay': '0.86s', '--a': '.14', '--w': '3px', '--from': '30deg' } },
    { c: 'hr-a', s: { '--d': '110%', '--t': '3.91s', '--delay': '1.16s', '--a': '.106', '--w': '3px', '--from': '70deg' } },
    { c: 'hr-a', s: { '--d': '110%', '--t': '3.91s', '--delay': '1.46s', '--a': '.078', '--w': '3px', '--from': '110deg' } },
  ] },
  { x: '38%', y: '70%', rings: [
    { c: 'hr-a', s: { '--d': '80%', '--t': '3.39s', '--delay': '1.35s', '--a': '.42', '--w': '1.5px', '--from': '90deg' } },
    { c: 'hr-a', s: { '--d': '80%', '--t': '3.39s', '--delay': '1.65s', '--a': '.319', '--w': '1.5px', '--from': '130deg' } },
  ] },
  { x: '8%', y: '62%', rings: [
    { c: 'hr-b', s: { '--d': '44%', '--t': '2.76s', '--delay': '1.79s', '--a': '.46', '--w': '1.5px', '--from': '270deg' } },
    { c: 'hr-b', s: { '--d': '44%', '--t': '2.76s', '--delay': '2.09s', '--a': '.35', '--w': '1.5px', '--from': '310deg' } },
  ] },
  { x: '26%', y: '90%', rings: [
    { c: 'hr-a', s: { '--d': '14%', '--t': '2.24s', '--delay': '2.45s', '--a': '.32', '--w': '1px', '--from': '270deg' } },
  ] },
  { x: '80%', y: '34%', rings: [
    { c: 'hr-b', s: { '--d': '110%', '--t': '3.91s', '--delay': '3.10s', '--a': '.14', '--w': '3px', '--from': '240deg' } },
    { c: 'hr-b', s: { '--d': '110%', '--t': '3.91s', '--delay': '3.40s', '--a': '.106', '--w': '3px', '--from': '280deg' } },
    { c: 'hr-b', s: { '--d': '110%', '--t': '3.91s', '--delay': '3.70s', '--a': '.078', '--w': '3px', '--from': '320deg' } },
  ] },
  { x: '68%', y: '50%', rings: [
    { c: 'hr-a slow', s: { '--d': '80%', '--t': '4.39s', '--delay': '3.49s', '--a': '.38', '--w': '1.5px', '--from': '90deg' } },
    { c: 'hr-a slow', s: { '--d': '80%', '--t': '4.39s', '--delay': '3.79s', '--a': '.289', '--w': '1.5px', '--from': '130deg' } },
  ] },
  { x: '90%', y: '80%', rings: [
    { c: 'hr-a slow', s: { '--d': '110%', '--t': '4.91s', '--delay': '4.38s', '--a': '.14', '--w': '3px', '--from': '30deg' } },
    { c: 'hr-a slow', s: { '--d': '110%', '--t': '4.91s', '--delay': '4.68s', '--a': '.106', '--w': '3px', '--from': '70deg' } },
  ] },
]


export default function Hero({ lang = 'en' }: { lang?: Locale }) {
  const t = getDictionary(lang).hero
  const LINES = [t.line1, t.line2]

  const [typed, setTyped] = useState<string[]>(['', ''])
  const [activeLine, setActiveLine] = useState(0)
  const [cursorBlinkOut, setCursorBlinkOut] = useState(false)
  // The neon hover reveal arms once the typewriter has finished
  const [revealReady, setRevealReady] = useState(false)
  // Mobile shows the typewriter only — the neon hover layer renders solely on
  // hover-capable desktop viewports (same gate as the Explore study cards)
  const [isDesktop, setIsDesktop] = useState(false)
  // The rain, and the two ways it touches the headline
  const [raining, setRaining] = useState(false)
  const [wiping, setWiping] = useState(false)
  // Set by the first real pointer event on the headline. Until then the lens
  // has no position, so the reveal stays shut even if :hover is already true.
  const [lens, setLens] = useState(false)
  // A per-run token, not a shared flag: cleanup bumps it, so a run still
  // sleeping inside the typewriter can never be revived by the next effect.
  const runId = useRef(0)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const closerRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLSpanElement>(null)
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

  // Feed the pointer position to the rainbow reveal mask (see .hero-rainbow).
  // Until this runs the headline carries no .lens class, so the reveal stays
  // shut: :hover can be true with no pointer event at all.
  const handleTitleMove = (e: React.MouseEvent) => {
    const el = titleRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
    if (!lens) setLens(true)
  }

  useEffect(() => {
    const myRun = ++runId.current
    const alive = () => runId.current === myRun

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
            if (!alive()) return
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

      // Hold the blinking cursor a beat, then fade it out. The fade has to
      // start on a blink boundary: .typewriter-cursor blinks from CSS, and a
      // CSS animation beats an inline opacity, so swapping in blink-out at an
      // arbitrary moment snapped the cursor from invisible to solid black
      // before fading — a flick right as the typewriter finished.
      await sleep(1200)
      if (!alive()) return
      await nextBlinkBoundary(cursorRef.current)
      if (!alive()) return
      setCursorBlinkOut(true)

      setRevealReady(true)

      // ---- the rain, and the ripple that lights the headline on its way out ----
      const title = titleRef.current
      const hero = heroRef.current
      if (!desktopRef.current || !title || !hero) return

      const hb = hero.getBoundingClientRect()
      const box = title.getBoundingClientRect()
      title.style.setProperty('--wcx', `${hb.left + hb.width * CLOSER.x - box.left}px`)
      title.style.setProperty('--wcy', `${hb.top + hb.height * CLOSER.y - box.top}px`)
      title.style.setProperty('--wre', `${(hb.width * CLOSER.d) / 200}px`)
      title.style.setProperty('--wt', CLOSER.t)

      // The headline is armed by the closing ripple itself (see the effect
      // below), never by a timer of its own.
      setRaining(true)
    }

    run()
    return () => {
      runId.current++
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  // The closing ripple arms and disarms the headline's band on its own clock.
  // Listening to the ring means the band is on screen for exactly as long as
  // the circle it rides, whatever the browser does to timers in the meantime.
  useEffect(() => {
    const ring = closerRef.current
    if (!raining || !ring) return
    const on = (e: AnimationEvent) => {
      if (e.animationName === 'hero-grow') setWiping(true)
    }
    const off = (e: AnimationEvent) => {
      if (e.animationName === 'hero-grow') setWiping(false)
    }
    ring.addEventListener('animationstart', on)
    ring.addEventListener('animationend', off)
    return () => {
      ring.removeEventListener('animationstart', on)
      ring.removeEventListener('animationend', off)
      setWiping(false)
    }
  }, [raining])

  return (
    <section
      ref={heroRef}
      className={`hero min-h-screen flex items-center px-10 py-16${raining ? ' rain-on' : ''}`}
    >
      {/* Rain on still water — hairline rings carrying the house colours on
          their rims. Behind the copy, and cheap by construction: only
          transform and opacity animate, so the layer stays on the
          compositor. Depth reads through line weight and opacity. */}
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

      {/* The closing ripple rides in its own layer, IN FRONT of the copy. The
          rain belongs behind the words, but this is the ring whose band lights
          the headline, and behind the letters it disappeared at exactly the
          moment it mattered. Its animation events arm and disarm the reveal. */}
      {isDesktop && (
        <div className="hero-fx hero-fx-front" aria-hidden="true">
          <div
            className="hero-drop"
            style={{ '--x': `${CLOSER.x * 100}%`, '--y': `${CLOSER.y * 100}%` } as React.CSSProperties}
          >
            <i
              ref={closerRef}
              className="hero-ring hr-b"
              style={{
                '--d': `${CLOSER.d}%`,
                '--t': CLOSER.t,
                '--delay': CLOSER.delay,
                '--a': '.75',
                '--w': '2px',
                '--from': '210deg',
              } as React.CSSProperties}
            />
          </div>
        </div>
      )}
      <div className="container-x w-full max-w-full">
        <h1
          ref={titleRef}
          // reveal-ready (and with it every hover rule — including the mask
          // hole punched in the ink) only ever applies on desktop; mobile is
          // purely the typewriter.
          className={`hero-title text-5xl leading-[1.2]${revealReady && isDesktop ? ' reveal-ready' : ''}${lens ? ' lens' : ''}${wiping && isDesktop ? ' wipe' : ''}`}
          onMouseMove={isDesktop ? handleTitleMove : undefined}
          onMouseEnter={isDesktop ? handleTitleMove : undefined}
        >
          {/* Black ink layer — while the reveal is hovered, a hole matching
              the reveal circle is masked out of it so the rippling neon
              underneath is the only text inside the circle */}
          <div className="hero-ink">
            <div className="mb-10">
              <span className="typewriter-text">{typed[0]}</span>
              {activeLine === 0 && (
                <span
                  ref={cursorRef}
                  className={`typewriter-cursor ${cursorBlinkOut ? 'blinking-out' : ''}`}
                />
              )}
            </div>
            <div className="mb-16">
              <span className="typewriter-text">{typed[1]}</span>
              {activeLine === 1 && (
                <span
                  ref={cursorRef}
                  className={`typewriter-cursor ${cursorBlinkOut ? 'blinking-out' : ''}`}
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
