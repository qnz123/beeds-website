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
import { getFrames, HIGHLIGHT_PHRASES, type CueIcon, type FrameDatum } from './folioData'
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
// The services as an accordion (client-approved 2026-10-05, from the "Services
// on One Screen" study): the heading and all four panels fit one screen. Click
// a panel and it widens while the others narrow; its coloured front, drawing
// and all, rolls up and away (and back down to close), uncovering the back on
// the section's own grey: the description, a four-step flow and four line
// icons ("Tone 1"), with the drawing pressed faintly behind. Everything on the
// back stays still: on a desktop it is laid out once at the OPEN panel's width
// (--fw-open-w, set below), so widening only uncovers it. One panel open at a
// time; click again or press Esc to close. Styles: "The Folio — accordion" in
// globals.css.
// ---------------------------------------------------------------------------

// The phrases the Services page brushes yellow are set a size up on the page.
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
      part
    )
  )
}

function Specimen({ frame }: { frame: FrameDatum }) {
  return (
    <span className="fw-artbox">
      <span className="fw-word" aria-hidden="true">
        {frame.word}
      </span>
      <span className="fw-mark" style={frame.markStyle}>
        {frame.mark}
      </span>
      <span className="fw-num" aria-hidden="true">
        {frame.num}
      </span>
    </span>
  )
}

// Line icons for the back (32-unit grid, 1px stroke set in CSS).
const CUE_ICONS: Record<CueIcon, React.ReactNode> = {
  compass: (<><circle cx="16" cy="16" r="12" /><path d="M20.5 11.5l-2.8 6.2-6.2 2.8 2.8-6.2z" /></>),
  people: (<><circle cx="12" cy="11" r="4" /><path d="M4 26c0-4.4 3.6-8 8-8s8 3.6 8 8" /><circle cx="23" cy="12" r="3" /><path d="M21 18.5c3.9-.6 7 2.3 7 6.5" /></>),
  speech: (<><path d="M5 7h22v14H14l-6 5v-5H5z" /><path d="M10 12h12M10 16h8" /></>),
  search: (<><circle cx="14" cy="14" r="8" /><path d="M20 20l7 7" /></>),
  spark: (<><path d="M16 4l2.6 7.4L26 14l-7.4 2.6L16 24l-2.6-7.4L6 14l7.4-2.6z" /><path d="M25 22l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z" /></>),
  flow: (<><circle cx="7" cy="16" r="3" /><circle cx="25" cy="8" r="3" /><circle cx="25" cy="24" r="3" /><path d="M10 15l12-6M10 17l12 6" /></>),
  tools: (<path d="M19 5a6 6 0 0 0-5.6 8.1L5 21.5 8.5 25l8.4-8.4A6 6 0 0 0 25 11l-3.5 3.5-3.5-.5-.5-3.5z" />),
  clock: (<><circle cx="16" cy="16" r="12" /><path d="M16 9v7l5 3" /></>),
  clapper: (<><rect x="4" y="9" width="24" height="17" rx="1" /><path d="M4 9l4-5h20l-4 5M12 4l-4 5M20 4l-4 5" /><path d="M14 14l6 3.5-6 3.5z" /></>),
  phone: (<><rect x="10" y="3" width="12" height="26" rx="2.5" /><path d="M14 25.5h4" /></>),
  window: (<><rect x="3" y="6" width="26" height="20" rx="1.5" /><path d="M3 11h26M8 15h9M8 19h14M8 23h6" /></>),
  hands: (<><path d="M4 15l6-6 5 3 5-3 8 6" /><path d="M9 18l4 4c1 1 2.5 1 3.5 0l1-1M15 16l5 5c1 1 2.5 1 3.5 0l.5-.5c1-1 1-2.5 0-3.5L19 12" /></>),
  globe: (<><circle cx="16" cy="16" r="12" /><ellipse cx="16" cy="16" rx="5" ry="12" /><path d="M4 16h24M6 10h20M6 22h20" /></>),
  chart: (<path d="M4 27h24M8 23v-6M14 23V12M20 23v-8M26 23V7" />),
}

// An open book at the end of the category line: there is more to read on the back.
const bookCue = (
  <svg className="fw-cue" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 6.6C9.6 5 6.6 4.6 3.5 5.4v13.1c3.1-.8 6.1-.4 8.5 1.2" />
    <path d="M12 6.6c2.4-1.6 5.4-2 8.5-1.2v13.1c-3.1-.8-6.1-.4-8.5 1.2z" />
    <path className="fw-cue-page" d="M12 6.6c1.9-1.3 4.2-1.7 6.6-1.3" />
  </svg>
)

function Caption({ frame, cue = false }: { frame: FrameDatum; cue?: boolean }) {
  return (
    <div className="fw-meta">
      <div className="fw-rule">
        <div className="fw-cat-row">
          <div className="fw-cat">{frame.category}</div>
          {cue && bookCue}
        </div>
        <h3>{frame.title}</h3>
        <p>{frame.blurb}</p>
      </div>
    </div>
  )
}

function FolioFrame({
  frame,
  phrases,
  labels,
  open,
  onToggle,
}: {
  frame: FrameDatum
  phrases: string[]
  labels: { steps: string }
  open: boolean
  onToggle: () => void
}) {
  const descRef = useRef<HTMLDivElement>(null)
  const text = frame.card ?? frame.about ?? [frame.blurb]

  // each opening starts at the top of the description (it can scroll on small phones)
  useEffect(() => {
    if (open && descRef.current) descRef.current.scrollTop = 0
  }, [open])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }

  return (
    <div
      className={`fw-panel${open ? ' is-open' : ''}`}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onClick={onToggle}
      onKeyDown={onKey}
    >
      <div className={`fw-field fw-field--${frame.field}`} />
      <div className="fw-paper" aria-hidden="true">
        <div className="fw-press">
          <Specimen frame={frame} />
        </div>
      </div>
      <div ref={descRef} className="fw-desc" aria-hidden={!open}>
        {text.map((p, i) => (
          <p key={i}>{withLifts(p, phrases)}</p>
        ))}
        <div className="fw-extra">
          <div className="fw-blk">
            <span className="fw-lbl">{labels.steps}</span>
            <div className="fw-flow">
              {frame.steps.map(([name, note], k) => (
                <div key={k} className="fw-step">
                  <span className="fw-dot">{k + 1}</span>
                  {name}
                  <small>{note}</small>
                </div>
              ))}
            </div>
          </div>
          <div className="fw-blk">
            <span className="fw-lbl">{frame.makeLabel}</span>
            <div className="fw-icons">
              {frame.make.map((m) => (
                <div key={m.label} className="fw-ic">
                  <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
                    {CUE_ICONS[m.icon]}
                  </svg>
                  {m.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="fw-cover" aria-hidden="true">
        <div className={`fw-cover-in fw-field--${frame.field}`}>
          <Specimen frame={frame} />
        </div>
      </div>
      <Caption frame={frame} cue />
    </div>
  )
}

export default function Portfolio({ lang = 'en' as Locale }: { lang?: Locale }) {
  const frames = getFrames(lang)
  const phrases = HIGHLIGHT_PHRASES[lang] ?? []
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const panelsRef = useRef<HTMLDivElement>(null)
  const labels = { steps: lang === 'ja' ? '進め方' : 'How it runs' }

  // The open and closed panel widths, for the still back and the front drawing
  // (see the header above): four panels, three 14px gaps, open grows 3 : 0.7.
  useEffect(() => {
    const el = panelsRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const set = () => {
      const free = el.clientWidth - 3 * 14
      el.style.setProperty('--fw-open-w', `${(free * 3) / (3 + 3 * 0.7)}px`)
      el.style.setProperty('--fw-closed-w', `${free / 4}px`)
    }
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (openIndex === null) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenIndex(null)
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [openIndex])
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
        <div ref={panelsRef} className={`fw-panels${openIndex !== null ? ' has-open' : ''}`}>
          {frames.map((frame, i) => (
            <FolioFrame
              key={frame.title}
              frame={frame}
              phrases={phrases}
              labels={labels}
              open={openIndex === i}
              onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
