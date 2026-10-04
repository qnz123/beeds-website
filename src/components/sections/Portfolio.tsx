'use client'

// Featured Work — "The Folio", Edition B (client-approved 2026-07-09).
//
// Four 3:4 specimen plates on the brand color fields, in a horizontal
// scroll-snap filmstrip. Each plate: the discipline's instrument drawn past
// the edges (idling slowly), a giant outlined specimen numeral top-right,
// the discipline word ghosting through at press scale behind the copy, and
// category → title → blurb over a white hairline rule (the blurb reserves
// two lines so the rules align across frames — client-flagged fix).
//
// Motion: SCROLL-DRIVEN (client-directed 2026-07-09). Every animation inside
// the section is paused and scrubbed — its currentTime follows the section's
// travel through the viewport, so scrolling plays the folio and stopping
// holds it. SSR/no-JS output is fully visible with CSS animations simply
// running; prefers-reduced-motion renders everything static from the start.
// Styles live in the "Featured Work — The Folio" block of globals.css.

import { Fragment, useEffect, useRef, useState, type MutableRefObject } from 'react'
import { getFrames, HIGHLIGHT_PHRASES, type FrameDatum } from './folioData'
import type { Locale } from '@/i18n/config'
import { whenPassedUnseen } from '@/lib/passedUnseen'

// ---------------------------------------------------------------------------
// Scroll-reveal hook — mirrors `useInView` in Impact.tsx / `useRevealOnScroll`
// in VideoPortfolio.tsx. Tri-state ('idle' -> 'hidden' -> 'visible'): the
// hidden state is only ever entered client-side after mount, so SSR/no-JS
// output stays in 'idle' (styled identically to 'visible') and nothing is
// ever permanently invisible. Reduced motion skips straight to 'visible'.
// Gone past unseen (the nav's Contact link, straight to the booking form from
// another page), it is 'visible' at once with `still` set (no fade), so a
// reader coming back up finds it in place.
// ---------------------------------------------------------------------------

type AnimState = 'idle' | 'hidden' | 'visible'

function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null)
  const [state, setState] = useState<AnimState>('idle')
  const [still, setStill] = useState(false)

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
          unpass()
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(node)
    const unpass = whenPassedUnseen(node, () => {
      observer.disconnect()
      setStill(true)
      setState('visible')
    })
    return () => {
      observer.disconnect()
      unpass()
    }
  }, [threshold])

  return { ref, dataAnimate: state === 'idle' ? undefined : state, still }
}

// ---------------------------------------------------------------------------
// ScrambleWord — "Guesswork" scroll effect (client-directed 2026-07-13).
// When the heading scrolls into view, the word starts WHITE and DISORGANIZED
// (random letters drawn from the word itself), then on one shared clock the
// color fades white -> black while letters lock in left-to-right until the
// true word forms. Italic throughout. SSR/no-JS renders the real word in ink
// (never invisible); prefers-reduced-motion skips the effect entirely.
// JS-driven (rAF), so the section's scroll-scrub of CSS animations never
// freezes it.
// ---------------------------------------------------------------------------

const SCRAMBLE_MS = 2200
// The shuffle SPINS DOWN (client-directed 2026-07-13): letter swaps start at
// this cadence and smoothly stretch as the effect eases out, so the motion
// decelerates to rest instead of cutting off.
const SHUFFLE_MIN_MS = 40
const SHUFFLE_MAX_MS = 260

function ScrambleWord({ word }: { word: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const startedRef = useRef(false)
  const [display, setDisplay] = useState(word)
  const [color, setColor] = useState<string | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const pool = word.split('')
    const scrambled = () =>
      word
        .split('')
        .map(() => pool[Math.floor(Math.random() * pool.length)])
        .join('')

    // Waiting state (post-hydration only): white + disorganized.
    setDisplay(scrambled())
    setColor('rgb(255,255,255)')

    let raf = 0
    let fallback = 0

    const runReveal = () => {
      const start = performance.now()
      let lastShuffle = 0

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / SCRAMBLE_MS)
        // Ease-out cubic: fast at first, smoothly decelerating to rest.
        const eased = 1 - Math.pow(1 - t, 3)
        // 1) color: white -> black, same (eased) clock as the letters
        const v = Math.round(255 * (1 - eased))
        setColor(t >= 1 ? null : `rgb(${v},${v},${v})`)
        // 2) letters: lock in left-to-right; the rest keep shuffling at a
        //    cadence that stretches as the effect winds down.
        const shuffleEvery = SHUFFLE_MIN_MS + (SHUFFLE_MAX_MS - SHUFFLE_MIN_MS) * eased
        if (now - lastShuffle >= shuffleEvery || t >= 1) {
          lastShuffle = now
          const locked = Math.floor(eased * word.length)
          const current = word
            .split('')
            .map((ch, i) => (i < locked || t >= 1 ? ch : pool[Math.floor(Math.random() * pool.length)]))
            .join('')
          setDisplay(t >= 1 ? word : current)
        }
        if (t < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return
        startedRef.current = true
        observer.disconnect()
        unpass()
        clearTimeout(fallback)
        runReveal()
      },
      { threshold: 0.6 }
    )
    observer.observe(node)

    // Gone past before it played (the nav's Contact link, straight to the
    // booking form from another page): the word stands in ink, unscrambled,
    // for a reader coming back up — no reveal behind their back or in view.
    const unpass = whenPassedUnseen(node, () => {
      if (startedRef.current) return
      startedRef.current = true
      observer.disconnect()
      clearTimeout(fallback)
      setDisplay(word)
      setColor(null)
    })

    // Safety net: the "waiting" state above has no time limit of its own —
    // it sits as a random jumble of the word's own letters (often without a
    // capital first letter) until 60% of this span scrolls into view. A
    // real visitor who never scrolls it that far, or an automated
    // screenshot/SEO crawler that renders once and never scrolls at all,
    // would otherwise be stuck looking at illegible text forever instead of
    // "Guesswork" — which reads as broken placeholder copy, not a tease.
    // Force the reveal after a short delay if the scroll trigger hasn't
    // fired yet.
    fallback = window.setTimeout(() => {
      if (startedRef.current) return
      startedRef.current = true
      observer.disconnect()
      unpass()
      runReveal()
    }, 2500)

    return () => {
      observer.disconnect()
      unpass()
      cancelAnimationFrame(raf)
      clearTimeout(fallback)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word])

  return (
    <span ref={ref} className="fw-journey-art" style={color ? { color } : undefined}>
      {display}
    </span>
  )
}

// ---------------------------------------------------------------------------
// The plate turns over (client-approved 2026-10-04, from the Service Plate
// Reveals study). Clicking a plate turns it like a thick duplex board: its side
// shows the field colour with a pale core, and the face darkens as it turns
// from the light. The back carries the front's artwork mirrored (as if seen
// through the card), the long description up top, and the front's caption,
// readable, at the foot. As the back comes into view it lies under moving
// water, and one ripple spreads from the spot that was clicked and wipes the
// water away (the BEEDS intro's water). Clicking again turns it back; one
// plate is open at a time. Styles: "The Folio — turning plates" in globals.css.
// Timings there and here must agree (TURN_MS = --fw-dur, REVEAL_MS = --fw-rev).
// ---------------------------------------------------------------------------

const TURN_MS = 1733
const REVEAL_MS = 2000

type Point = { x: number; y: number }

// The phrases the Services page brushes yellow, set a size up on the card.
function withLifts(paragraph: string, phrases: string[]) {
  const hit = phrases.filter((p) => paragraph.includes(p))
  if (hit.length === 0) return paragraph
  const pattern = new RegExp(`(${hit.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`)
  return paragraph.split(pattern).map((part, i) =>
    hit.includes(part) ? (
      <span key={i} className="fw-lift">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}

// The ripple, driven here rather than by a CSS animation of a registered
// property: Safari did not pass such an animated value on to the layers inside
// the card, so the ripple never showed there. Each frame sets the radius on the
// three layers that draw it (the clear card, the water outside it, the ring).
// The water itself is a FIXED filter (drawn once and reused): changing its
// settings every frame made Firefox, which draws it on the CPU, lag.
const easeOut = (t: number) => 1 - Math.pow(1 - t, 2.2)

function runRipple(cell: HTMLElement, delay: number, ms: number) {
  const layers = ['.fw-reveal', '.fw-haze', '.fw-ring']
    .map((sel) => cell.querySelector<HTMLElement>(sel))
    .filter((el): el is HTMLElement => el !== null)
  const ring = cell.querySelector<HTMLElement>('.fw-ring')
  const set = (r: number, ringOpacity: number) => {
    for (const el of layers) el.style.setProperty('--fw-r', `${r.toFixed(2)}%`)
    ring?.style.setProperty('opacity', ringOpacity.toFixed(3))
  }
  const clear = () => {
    for (const el of layers) el.style.removeProperty('--fw-r')
    ring?.style.removeProperty('opacity')
    cell.classList.remove('is-revealing')
  }
  set(0, 0)
  cell.classList.add('is-revealing')
  let raf = 0
  let t0 = 0
  const timer = window.setTimeout(() => {
    const tick = (now: number) => {
      if (!t0) t0 = now
      const t = Math.min(1, (now - t0) / ms)
      const ringOpacity = t < 0.75 ? 1 - 0.4 * (t / 0.75) : 0.6 * (1 - (t - 0.75) / 0.25)
      set(115 * easeOut(t), ringOpacity)
      if (t < 1) raf = requestAnimationFrame(tick)
      else clear()
    }
    raf = requestAnimationFrame(tick)
  }, delay)
  return () => {
    clearTimeout(timer)
    cancelAnimationFrame(raf)
    clear()
  }
}

function Specimen({ frame }: { frame: FrameDatum }) {
  return (
    <>
      <span className="fw-word" aria-hidden="true">
        {frame.word}
      </span>
      <span className="fw-mark" style={frame.markStyle}>
        {frame.mark}
      </span>
      <span className="fw-num" aria-hidden="true">
        {frame.num}
      </span>
    </>
  )
}

function Caption({ frame }: { frame: FrameDatum }) {
  return (
    <div className="fw-meta">
      <div className="fw-rule">
        <div className="fw-cat">{frame.category}</div>
        <h3>{frame.title}</h3>
        <p>{frame.blurb}</p>
      </div>
    </div>
  )
}

// The back's contents: the front's artwork mirrored, the description, the caption.
function BackFace({ frame, phrases }: { frame: FrameDatum; phrases: string[] }) {
  const text = frame.card ?? frame.about ?? [frame.blurb]
  return (
    <>
      <div className="fw-mirror" aria-hidden="true">
        <Specimen frame={frame} />
      </div>
      <div className="fw-back-in">
        <div className="fw-back-top">
          <div className="fw-back-body">
            {text.map((p, i) => (
              <p key={i}>{withLifts(p, phrases)}</p>
            ))}
          </div>
        </div>
        <Caption frame={frame} />
      </div>
    </>
  )
}

function FolioFrame({
  frame,
  phrases,
  open,
  onToggle,
  lastPoint,
}: {
  frame: FrameDatum
  phrases: string[]
  open: boolean
  onToggle: () => void
  lastPoint: MutableRefObject<Point | null>
}) {
  const cellRef = useRef<HTMLDivElement>(null)
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)

  useEffect(() => {
    const cell = cellRef.current
    if (!cell) return
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Focus follows the card only for a keyboard turn (no point recorded): a
    // pointer turn would otherwise light the focus ring on the card.
    const byKeyboard = lastPoint.current === null
    let flipTimer = 0
    let focusTimer = 0
    let stopRipple: (() => void) | null = null
    if (!reduce) {
      // the turn's shading plays on every turn, either way
      cell.classList.remove('is-turning')
      void cell.offsetWidth
      cell.classList.add('is-turning')
      flipTimer = window.setTimeout(() => cell.classList.remove('is-turning'), TURN_MS + 50)
    }
    if (open) {
      // The ripple starts where the plate was clicked; the back is the front
      // seen from behind, so that spot is mirrored left to right.
      const card = cell.getBoundingClientRect()
      const pt = lastPoint.current
      let x = 0.5
      let y = 0.5
      if (pt && pt.x >= card.left && pt.x <= card.right && pt.y >= card.top && pt.y <= card.bottom) {
        x = (pt.x - card.left) / card.width
        y = (pt.y - card.top) / card.height
      }
      cell.style.setProperty('--fw-ox', `${(1 - x) * 100}%`)
      cell.style.setProperty('--fw-oy', `${y * 100}%`)
      // The back is under water from the start of the turn, so no clear frame
      // can flash as it comes into view; the ripple starts at the half-turn.
      if (!reduce) stopRipple = runRipple(cell, TURN_MS / 2, REVEAL_MS)
      if (byKeyboard)
        focusTimer = window.setTimeout(() => backRef.current?.focus({ preventScroll: true }), reduce ? 0 : TURN_MS / 2 + 50)
    } else {
      if (byKeyboard)
        focusTimer = window.setTimeout(() => frontRef.current?.focus({ preventScroll: true }), reduce ? 0 : TURN_MS / 2 + 50)
    }
    return () => {
      clearTimeout(flipTimer)
      clearTimeout(focusTimer)
      stopRipple?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      lastPoint.current = null
      onToggle()
    }
  }

  return (
    <div
      ref={cellRef}
      className={`fw-cell${open ? ' is-open' : ''}`}
      style={{ ['--fw-solid' as string]: FIELD_SOLID[frame.field] }}
    >
      <div className="fw-card">
        <span className="fw-edge" aria-hidden="true" />
        <span className="fw-edge fw-edge--r" aria-hidden="true" />
        <div
          ref={frontRef}
          className="fw-face fw-front"
          role="button"
          tabIndex={open ? -1 : 0}
          aria-expanded={open}
          aria-hidden={open}
          onClick={onToggle}
          onKeyDown={onKey}
        >
          <div className="fw-plate">
            <div className={`fw-field fw-field--${frame.field}`} />
            <Specimen frame={frame} />
            <Caption frame={frame} />
          </div>
          <span className="fw-shade" aria-hidden="true" />
        </div>
        <div
          ref={backRef}
          className={`fw-face fw-back fw-field--${frame.field}`}
          role="button"
          tabIndex={open ? 0 : -1}
          aria-hidden={!open}
          onClick={onToggle}
          onKeyDown={onKey}
        >
          <div className="fw-haze" aria-hidden="true">
            <div className="fw-haze-in">
              <BackFace frame={frame} phrases={phrases} />
            </div>
          </div>
          <div className="fw-reveal">
            <BackFace frame={frame} phrases={phrases} />
          </div>
          <span className="fw-ring" aria-hidden="true" />
          <span className="fw-shade" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}

// The deep end of each field's gradient: the colour of the board's skins on its edge.
const FIELD_SOLID: Record<FrameDatum['field'], string> = {
  gold: '#8b7d0a',
  navy: '#1d2a41',
  red: '#a13636',
  charcoal: '#262626',
}

export default function Portfolio({ lang = 'en' as Locale }: { lang?: Locale }) {
  const frames = getFrames(lang)
  const phrases = HIGHLIGHT_PHRASES[lang] ?? []
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const lastPoint = useRef<Point | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { ref: folioRef, dataAnimate, still } = useInView<HTMLDivElement>(0.15)

  // The spin-down (client-directed, 2026-07-09): once the section enters the
  // viewport, its motion is DRIVEN BY THE PAGE SCROLL (client-directed
  // 2026-07-09, replacing the earlier 3s spin-down): every animation inside
  // the section is paused and scrubbed — its currentTime follows the
  // section's travel through the viewport, so scrolling down plays the folio
  // forward, scrolling up rewinds it, and when the reader stops, the plates
  // hold. All animations share one scrub clock (progress × 14s), preserving
  // their designed relative speeds (the needle swings while the aperture
  // barely turns). Under prefers-reduced-motion nothing ever animates (CSS),
  // so there is nothing to scrub. Without JS, the CSS animations simply keep
  // running time-based (acceptable degradation).
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (typeof section.getAnimations !== 'function') return

    // The scrub clock: how much animation time one full viewport traverse
    // of the section plays. Long enough to feel alive, slow enough to stay
    // editorial.
    const SCRUB_SPAN_MS = 14000

    let anims: Animation[] = []
    let raf = 0
    let ticking = false

    const collect = () => {
      anims = section.getAnimations({ subtree: true })
      for (const anim of anims) {
        try {
          anim.pause()
        } catch {
          // an animation whose target left the DOM can throw — skip it
        }
      }
    }

    const scrub = () => {
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 when the section's top touches the viewport bottom; 1 when its
      // bottom leaves the viewport top — the full scroll journey.
      const progress = Math.min(Math.max((vh - rect.top) / (vh + rect.height), 0), 1)
      const time = progress * SCRUB_SPAN_MS
      for (const anim of anims) {
        try {
          anim.currentTime = time
        } catch {
          // same guard as above
        }
      }
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      raf = requestAnimationFrame(() => {
        scrub()
        ticking = false
      })
    }

    // Collect after paint so all CSS animations exist, then take the first
    // scrub position immediately (no dead frame on load).
    raf = requestAnimationFrame(() => {
      collect()
      scrub()
    })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="featured-work" ref={sectionRef} className="pb-14">
      <div ref={folioRef} data-animate={dataAnimate} data-still={still ? '' : undefined} className="fw-folio">
        <div className="fw-head">
          {/* Heading in the About-BEEDS lede voice (client-directed 2026-07-13):
              large serif statement, sentence case, centered. */}
          <h2 className="fw-journey-stack">
            <span className="fw-journey">We help you visualize your idea</span>
            <span className="fw-journey">
              Without the&nbsp;
              <ScrambleWord word="Guesswork" />
            </span>
          </h2>
        </div>
        <div
          className="fw-strip"
          tabIndex={0}
          role="region"
          aria-label="Featured work — four frames, scrolls horizontally"
          onPointerDown={(e) => {
            lastPoint.current = { x: e.clientX, y: e.clientY }
          }}
        >
          {frames.map((frame, i) => (
            <FolioFrame
              key={frame.title}
              frame={frame}
              phrases={phrases}
              open={openIndex === i}
              onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
              lastPoint={lastPoint}
            />
          ))}
        </div>
        {/* The water on the back of a turning plate (fixed: see runRipple). */}
        <svg width="0" height="0" className="fw-water-defs" aria-hidden="true" focusable="false">
          <filter id="fw-water" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.03" numOctaves={2} seed={7} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="34" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
      </div>
    </section>
  )
}
