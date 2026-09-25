'use client'

// Illustrative placeholder data — replace with real research/consulting figures
// before launch. Kept as top-of-file consts per the project's section convention.

import Image from 'next/image'
import { JetBrains_Mono } from 'next/font/google'
import React, { memo, useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { balanceShades, CRAFT_END, CRAFT_SVG, playCraft, restCraft } from './craftHeadline'

const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--ic-mono', display: 'swap' })

/** A KPI figure: `value` is the authored display string (also the sr-only source
 *  of truth); `target`/`prefix`/`suffix`/`decimals` describe how to count it up
 *  from 0 on scroll-reveal without losing the exact final formatting. */
type StatDatum = { value: string; target: number; prefix: string; suffix: string; decimals: number }

// One lollipop at three stages is the mark for each phase. `stat` indexes the
// dictionary's `stats` labels (engagement, output, time-to-launch).
const phases: { img: string; stat: number; datum: StatDatum }[] = [
  { img: '/impact/phase-1.jpg', stat: 2, datum: { value: '58%', target: 58, prefix: '', suffix: '%', decimals: 0 } },
  { img: '/impact/phase-2.jpg', stat: 1, datum: { value: '3.2×', target: 3.2, prefix: '', suffix: '×', decimals: 1 } },
  { img: '/impact/phase-3.jpg', stat: 0, datum: { value: '+142%', target: 142, prefix: '+', suffix: '%', decimals: 0 } },
]

// Indexed to 100 before the engagement; the track runs 0–220.
const channelLift = [
  { after: 156, glyph: 'organic' },
  { after: 212, glyph: 'social' },
  { after: 134, glyph: 'ads' },
  { after: 178, glyph: 'email' },
] as const
const SCALE = 220
const pct = (v: number) => `${((v / SCALE) * 100).toFixed(2)}%`

function Glyph({ name }: { name: (typeof channelLift)[number]['glyph'] }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.4}>
      {name === 'organic' && (<><circle cx="8.4" cy="8.4" r="5.4" /><path d="M12.4 12.4L17 17" /></>)}
      {name === 'social' && <path d="M3 3h14v10H9l-4 4v-4H3z" />}
      {name === 'ads' && <path d="M4.5 2.5v14l3.6-3.4 2.4 4.6 2.1-1.1-2.3-4.4h4.6z" />}
      {name === 'email' && (<><rect x="2.5" y="4.5" width="15" height="11" /><path d="M2.5 5.2L10 11l7.5-5.8" /></>)}
    </svg>
  )
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The headline's markup is set once and then driven directly by craftHeadline.ts. It must never
// re-render: React would rewrite the markup and wipe the drawn letters mid-animation.
const CRAFT_HTML = { __html: CRAFT_SVG }
const CraftWord = memo(function CraftWord() {
  return <svg className="ic-word" viewBox="-10 -84 374 98" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={CRAFT_HTML} />
})

/** Blocks scrolling further down (wheel, touch, keys, scrollbar) until the returned release is called. */
function holdScrollDown(): () => void {
  const floor = window.scrollY
  let touchY = 0
  const wheel = (e: WheelEvent) => { if (e.deltaY > 0) e.preventDefault() }
  const touchStart = (e: TouchEvent) => { touchY = e.touches[0]?.clientY ?? 0 }
  const touchMove = (e: TouchEvent) => { if ((e.touches[0]?.clientY ?? 0) < touchY) e.preventDefault() }
  const keys = new Set(['ArrowDown', 'PageDown', 'End', ' ', 'Spacebar'])
  const key = (e: KeyboardEvent) => {
    const el = e.target as HTMLElement | null
    if (keys.has(e.key) && !e.shiftKey && !el?.closest('input, textarea, select, [contenteditable]')) e.preventDefault()
  }
  const scroll = () => { if (window.scrollY > floor) window.scrollTo({ top: floor, behavior: 'instant' as ScrollBehavior }) }
  window.addEventListener('wheel', wheel, { passive: false })
  window.addEventListener('touchstart', touchStart, { passive: true })
  window.addEventListener('touchmove', touchMove, { passive: false })
  window.addEventListener('keydown', key)
  window.addEventListener('scroll', scroll)
  return () => {
    window.removeEventListener('wheel', wheel)
    window.removeEventListener('touchstart', touchStart)
    window.removeEventListener('touchmove', touchMove)
    window.removeEventListener('keydown', key)
    window.removeEventListener('scroll', scroll)
  }
}

/** Fires once when `ref` is well into view. */
function useOnceInView<T extends Element>(threshold: number, onEnter: () => void) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); onEnter() } }, { threshold })
    io.observe(node)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold])
  return ref
}

/** Ease-out count-up from 0, ~1.1s. Screen readers get the exact authored string. */
function Figure({ stat, run }: { stat: StatDatum; run: boolean }) {
  const [display, setDisplay] = useState(stat.target)
  useEffect(() => {
    if (!run || reducedMotion()) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1100)
      setDisplay(stat.target * (1 - Math.pow(1 - t, 3)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    setDisplay(0)
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, stat.target])
  return (
    <>
      <div className="ic-fig" aria-hidden="true">{`${stat.prefix}${display.toFixed(stat.decimals)}${stat.suffix}`}</div>
      <span className="sr-only">{stat.value}</span>
    </>
  )
}

/** Counts from `from` to `to` once `run` flips on, after `delay` ms, easing out. */
function Count({ from, to, run, delay, dur = 700, fmt = (v: number) => String(Math.round(v)) }: { from: number; to: number; run: boolean; delay: number; dur?: number; fmt?: (v: number) => string }) {
  const [v, setV] = useState(to)
  useEffect(() => {
    if (!run || reducedMotion()) return
    let raf = 0
    setV(from)
    const start = performance.now() + delay
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / dur))
      setV(from + (to - from) * (1 - Math.pow(1 - t, 3)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, from, to, delay, dur])
  return <>{fmt(v)}</>
}

export default function Impact({ lang = 'en' as Locale }: { lang?: Locale }) {
  const t = getDictionary(lang).impact
  const wrapRef = useRef<HTMLDivElement>(null)
  const [counting, setCounting] = useState(false)

  // The headline stays hidden until its top reaches the middle of the screen, then plays once from
  // nothing while the page holds; the glasses then balance with the scroll; with reduced motion (or no JS) the finished word simply sits there.
  useEffect(() => {
    const wrap = wrapRef.current
    const svg = wrap?.querySelector('svg')
    if (!wrap || !svg || typeof IntersectionObserver === 'undefined') return
    restCraft(wrap)
    if (reducedMotion()) return
    wrap.classList.add('wait')
    let stop: (() => void) | undefined, unlock: (() => void) | undefined, unbalance: (() => void) | undefined
    let done = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      wrap.classList.remove('settled', 'wait')
      wrap.classList.add('play')
      // arriving from above, the page holds here until the word has finished drawing (scrolling back up still works)
      const heldAt = e.boundingClientRect.top > 0 ? window.scrollY : -1
      if (heldAt >= 0) unlock = holdScrollDown()
      stop = playCraft(wrap, svg, () => wrap.classList.add('settled'))
      done = window.setTimeout(() => {
        unlock?.(); unlock = undefined
        unbalance = balanceShades(wrap)
        // then glide on until the word sits just under the nav, still in view above the photos,
        // unless the reader scrolled back up meanwhile
        const nav = document.querySelector<HTMLElement>('.nav')?.offsetHeight ?? 64
        const by = svg.getBoundingClientRect().top - nav - 20
        if (heldAt >= 0 && by > 0 && Math.abs(window.scrollY - heldAt) < 4)
          window.scrollTo({ top: window.scrollY + by, behavior: 'smooth' })
      }, CRAFT_END)
    }, { rootMargin: '0px 0px -50% 0px' })
    io.observe(wrap)
    return () => { io.disconnect(); window.clearTimeout(done); unlock?.(); unbalance?.(); stop?.(); wrap.classList.remove('play', 'settled', 'wait') }
  }, [])

  const phasesRef = useOnceInView<HTMLDivElement>(0.35, () => setCounting(true))
  const [growing, setGrowing] = useState(false)
  const liftRef = useOnceInView<HTMLDivElement>(0.4, () => setGrowing(true))

  // Soft scroll-through: blocks fade up as they arrive. Armed only once JS runs (and not
  // with reduced motion), so without it everything simply shows.
  const sectionRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const root = sectionRef.current
    if (!root || typeof IntersectionObserver === 'undefined' || reducedMotion()) return
    const items = root.querySelectorAll<HTMLElement>('[data-rv]')
    root.classList.add('ic-armed')
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('ic-in'); io.unobserve(e.target) }
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' })
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section id="impact" ref={sectionRef} className={`ic py-20 px-10 ${mono.variable}`} aria-labelledby="ic-lede">
      <div className="container-x">
        <div className="ic-top">
          <div className="ic-hl" ref={wrapRef}>
            <h2 className="ic-title">
              <span className="sr-only">Craft</span>
              <CraftWord />
            </h2>
          </div>
          <p className="ic-lede" id="ic-lede" data-rv>
            {t.lede} <span>{t.ledeRest}</span>
          </p>
        </div>

        <div className="ic-phases" ref={phasesRef}>
          {phases.map((p, i) => (
            <article className="ic-phase" key={p.img} data-rv style={{ '--i': i } as React.CSSProperties}>
              <figure className="ic-shot">
                <Image src={p.img} alt={t.alts[i]} width={1000} height={1250} sizes="(max-width: 760px) 100vw, 33vw" />
              </figure>
              <h3 className="ic-name">{t.phases[i]}</h3>
              <Figure stat={p.datum} run={counting} />
              <p className="ic-cap">{t.stats[p.stat]}</p>
            </article>
          ))}
        </div>

        {/* growth is a data attribute, not a class: React rewriting className would drop the fade-up's ic-in */}
        <div className="ic-lift" ref={liftRef} data-rv data-grow={growing ? '' : undefined}>
          <div className="ic-lift-head"><b>{t.liftHeading}</b></div>
          <div
            className="ic-lift-grid"
            role="img"
            aria-label={`${t.liftHeading}: ${channelLift.map((c, i) => `${t.channels[i]} 100 → ${c.after}`).join(', ')}.`}
          >
            <div className="ic-ruler" aria-hidden="true">
              {[0, 100, 150, 200].map((v) => (
                <span key={v} className="ic-tick" style={{ left: pct(v) }}><b>{v}</b></span>
              ))}
            </div>
            {channelLift.map((c, i) => (
              <div className="ic-row" key={c.glyph} style={{ '--i': i } as React.CSSProperties}>
                <div className="ic-ch"><Glyph name={c.glyph} />{t.channels[i]}</div>
                <div className="ic-track">
                  <div className="ic-base" style={{ width: pct(100) }} />
                  <div className="ic-gain" style={{ width: pct(c.after - 100) }} />
                </div>
                <div className="ic-up">+<Count from={0} to={c.after - 100} run={growing} delay={120 + i * 110} dur={800} />%</div>
                <div className="ic-end"><Count from={100} to={c.after} run={growing} delay={120 + i * 110} dur={800} /></div>
              </div>
            ))}
          </div>
        </div>

        <p className="ic-note" data-rv>{t.disclaimer}</p>
      </div>
    </section>
  )
}
