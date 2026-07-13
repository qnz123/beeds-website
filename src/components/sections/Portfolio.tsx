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

import { useEffect, useRef, useState } from 'react'
import { frames, type FrameDatum } from './folioData'

// ---------------------------------------------------------------------------
// Scroll-reveal hook — mirrors `useInView` in Impact.tsx / `useRevealOnScroll`
// in VideoPortfolio.tsx. Tri-state ('idle' -> 'hidden' -> 'visible'): the
// hidden state is only ever entered client-side after mount, so SSR/no-JS
// output stays in 'idle' (styled identically to 'visible') and nothing is
// ever permanently invisible. Reduced motion skips straight to 'visible'.
// ---------------------------------------------------------------------------

type AnimState = 'idle' | 'hidden' | 'visible'

function useInView<T extends Element>(threshold = 0.2) {
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
      { threshold, rootMargin: '0px 0px -8% 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, dataAnimate: state === 'idle' ? undefined : state }
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

const SCRAMBLE_MS = 1600
const SHUFFLE_EVERY_MS = 45

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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return
        startedRef.current = true
        observer.disconnect()

        const start = performance.now()
        let lastShuffle = 0
        let current = display

        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / SCRAMBLE_MS)
          // 1) color: white -> black, same clock as the letters
          const v = Math.round(255 * (1 - t))
          setColor(t >= 1 ? null : `rgb(${v},${v},${v})`)
          // 2) letters: lock in left-to-right, the rest keep shuffling
          if (now - lastShuffle >= SHUFFLE_EVERY_MS || t >= 1) {
            lastShuffle = now
            const locked = Math.floor(t * word.length)
            current = word
              .split('')
              .map((ch, i) => (i < locked || t >= 1 ? ch : pool[Math.floor(Math.random() * pool.length)]))
              .join('')
            setDisplay(t >= 1 ? word : current)
          }
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.6 }
    )
    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word])

  return (
    <span ref={ref} className="fw-journey-art" style={color ? { color } : undefined}>
      {display}
    </span>
  )
}

function FolioFrame({ frame }: { frame: FrameDatum }) {
  return (
    <div className="fw-cell">
      <div className="fw-plate">
        <div className={`fw-field fw-field--${frame.field}`} />
        <span className="fw-word" aria-hidden="true">
          {frame.word}
        </span>
        <span className="fw-mark" style={frame.markStyle}>
          {frame.mark}
        </span>
        <span className="fw-num" aria-hidden="true">
          {frame.num}
        </span>
        <div className="fw-meta">
          <div className="fw-rule">
            <div className="fw-cat">{frame.category}</div>
            <h3>{frame.title}</h3>
            <p>{frame.blurb}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null)
  const { ref: folioRef, dataAnimate } = useInView<HTMLDivElement>(0.15)

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
      <div ref={folioRef} data-animate={dataAnimate} className="fw-folio">
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
        >
          {frames.map((frame) => (
            <FolioFrame key={frame.title} frame={frame} />
          ))}
        </div>
      </div>
    </section>
  )
}
