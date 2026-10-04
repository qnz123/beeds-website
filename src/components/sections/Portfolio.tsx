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
// The plate writes its description: "Ink on paper" (client-approved
// 2026-10-04, from the Service Plate Writing study; it replaced the turning
// plate). Clicking a plate turns its coloured field into an ivory page with
// the artwork pressed faintly into it, and the description writes on, letter
// by letter, in ink; the caption turns to ink too and
// the book fills solid. The ink is black on every plate (his ask). Clicking
// again clears it; one plate is open at a time.
// Styles: "The Folio — ink on paper" in globals.css.
// ---------------------------------------------------------------------------

const SETTLE_MS = 350 // the page settles before the writing starts
const WRITE_MS = 1700

// The description as letters. In spaced scripts words are kept whole so lines
// wrap as normal text; Japanese wraps between any letters. The phrases the
// Services page brushes yellow are set a size up.
const CJK = /[　-鿿＀-￯]/
function Letters({ paragraph, phrases }: { paragraph: string; phrases: string[] }) {
  const hit = phrases.filter((p) => paragraph.includes(p))
  const segs: { text: string; lift: boolean }[] = []
  if (hit.length) {
    const pattern = new RegExp(`(${hit.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`)
    for (const part of paragraph.split(pattern)) if (part) segs.push({ text: part, lift: hit.includes(part) })
  } else segs.push({ text: paragraph, lift: false })
  const out: React.ReactNode[] = []
  let k = 0
  for (const seg of segs) {
    const cls = seg.lift ? 'fw-l fw-lift' : 'fw-l'
    if (CJK.test(seg.text)) {
      for (const ch of Array.from(seg.text))
        out.push(
          <span key={k++} className={cls}>
            {ch}
          </span>
        )
      continue
    }
    for (const tok of seg.text.split(/(\s+)/)) {
      if (!tok) continue
      if (/^\s+$/.test(tok)) {
        out.push(
          <span key={k++} className="fw-l">
            {' '}
          </span>
        )
        continue
      }
      out.push(
        <span key={k++} className="fw-w">
          {Array.from(tok).map((ch, i) => (
            <span key={i} className={cls}>
              {ch}
            </span>
          ))}
        </span>
      )
    }
  }
  return <>{out}</>
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
  open,
  onToggle,
}: {
  frame: FrameDatum
  phrases: string[]
  open: boolean
  onToggle: () => void
}) {
  const descRef = useRef<HTMLDivElement>(null)
  const mounted = useRef(false)
  const text = frame.card ?? frame.about ?? [frame.blurb]

  useEffect(() => {
    const desc = descRef.current
    if (!desc) return
    if (!mounted.current) {
      mounted.current = true
      return
    }
    const letters = Array.from(desc.querySelectorAll<HTMLElement>('.fw-l'))
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let timer = 0
    if (open) {
      desc.classList.remove('is-leaving')
      desc.scrollTop = 0
      letters.forEach((l) => l.classList.remove('is-on'))
      if (reduce) {
        letters.forEach((l) => l.classList.add('is-on'))
      } else {
        // written on time, not on scroll: a letter for each slice of WRITE_MS
        timer = window.setTimeout(() => {
          const t0 = performance.now()
          let shown = 0
          const tick = (now: number) => {
            const t = Math.min(1, (now - t0) / WRITE_MS)
            const n = Math.round(t * letters.length)
            for (; shown < n; shown++) letters[shown].classList.add('is-on')
            if (t < 1) raf = requestAnimationFrame(tick)
          }
          raf = requestAnimationFrame(tick)
        }, SETTLE_MS)
      }
    } else {
      desc.classList.add('is-leaving')
      timer = window.setTimeout(
        () => {
          letters.forEach((l) => l.classList.remove('is-on'))
          desc.classList.remove('is-leaving')
        },
        reduce ? 0 : 400
      )
    }
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [open])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onToggle()
    }
  }

  return (
    <div className="fw-cell">
      <div
        className={`fw-plate${open ? ' is-open' : ''}`}
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={onToggle}
        onKeyDown={onKey}
      >
        <div className={`fw-field fw-field--${frame.field}`} />
        <div className="fw-paper" aria-hidden="true" />
        <Specimen frame={frame} />
        <div ref={descRef} className="fw-desc" aria-hidden={!open}>
          {text.map((p, i) => (
            <p key={i}>
              <Letters paragraph={p} phrases={phrases} />
            </p>
          ))}
        </div>
        <Caption frame={frame} cue />
      </div>
    </div>
  )
}

export default function Portfolio({ lang = 'en' as Locale }: { lang?: Locale }) {
  const frames = getFrames(lang)
  const phrases = HIGHLIGHT_PHRASES[lang] ?? []
  const [openIndex, setOpenIndex] = useState<number | null>(null)
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
        >
          {frames.map((frame, i) => (
            <FolioFrame
              key={frame.title}
              frame={frame}
              phrases={phrases}
              open={openIndex === i}
              onToggle={() => setOpenIndex((cur) => (cur === i ? null : i))}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
