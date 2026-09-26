'use client'

// Illustrative placeholder data — replace with real research/consulting figures
// before launch. Kept as top-of-file consts per the project's section convention.

import Image from 'next/image'
import { JetBrains_Mono } from 'next/font/google'
import React, { memo, useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { balanceShades, CRAFT_END, CRAFT_LAND, CRAFT_SVG, playCraft, restCraft } from './craftHeadline'

// preload: false — first used by the data block ~4,400px down; a preload made every page
// (via the '/' prefetch) download it and competed with the hero on first paint.
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--ic-mono', display: 'swap', preload: false })

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

/** Scrolls the page down by `by` px over `dur` ms with a cubic ease-out (fast start, soft landing).
 *  The reader's own wheel, touch or key input takes over at once. Returns a cancel. */
function easeScrollBy(by: number, dur: number): () => void {
  const from = window.scrollY, t0 = performance.now()
  let raf = 0
  const cancel = () => {
    cancelAnimationFrame(raf)
    for (const ev of ['wheel', 'touchstart', 'keydown'] as const) window.removeEventListener(ev, cancel)
  }
  const step = (now: number) => {
    const t = Math.min(1, (now - t0) / dur)
    window.scrollTo({ top: from + by * (1 - Math.pow(1 - t, 3)), behavior: 'instant' as ScrollBehavior })
    if (t < 1) raf = requestAnimationFrame(step)
    else cancel()
  }
  for (const ev of ['wheel', 'touchstart', 'keydown'] as const) window.addEventListener(ev, cancel, { passive: true })
  raf = requestAnimationFrame(step)
  return cancel
}

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
  // with JS and motion the figure reads 0 until its count-up starts, so it never shows the final value and then snaps back
  useEffect(() => { if (!reducedMotion() && typeof IntersectionObserver !== 'undefined') setDisplay(0) }, [])
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
    let done = 0, balanced = 0, glide: (() => void) | undefined
    let heldAt = -1

    // A swipe or fling already under way when the hold starts can't be cancelled by the hold's touchmove:
    // the browser keeps scrolling past the floor while the hold snaps back each frame, so the page shivers.
    // For that one gesture the page is briefly frozen instead. The freeze is on body's overflow-y, not html:
    // html{overflow:hidden} would stop body's overflow-x from reaching the viewport, body would become the
    // sticky nav's scroller and the nav would jump off screen.
    const body = document.body
    let touchDown = false, lastTouchEnd = -1e9, frozen = false, thaw = 0
    const unfreeze = () => {
      window.clearTimeout(thaw)
      if (!frozen) return
      frozen = false
      // only lift our own lock: the mobile menu sets the whole `overflow` itself and restores it itself
      if (!body.style.overflowX) body.style.removeProperty('overflow-y')
    }
    const onTouchStart = () => { touchDown = true }
    const onTouchEnd = () => {
      touchDown = false; lastTouchEnd = performance.now()
      if (frozen) { window.clearTimeout(thaw); thaw = window.setTimeout(unfreeze, 300) }
    }
    const topts = { passive: true, capture: true } as const
    window.addEventListener('touchstart', onTouchStart, topts)
    window.addEventListener('touchend', onTouchEnd, topts)
    window.addEventListener('touchcancel', onTouchEnd, topts)

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      wrap.classList.remove('settled', 'wait')
      wrap.classList.add('play')
      // arriving from above, the page holds here until the word has finished drawing (scrolling back up still works)
      heldAt = e.boundingClientRect.top > 0 ? window.scrollY : -1
      if (heldAt >= 0) {
        unlock = holdScrollDown()
        // a touch gesture in flight (finger down, or a fling from one that just lifted) is stopped at the floor;
        // never with a classic scrollbar (a touchscreen laptop), whose disappearing would shift the layout
        if ((touchDown || performance.now() - lastTouchEnd < 1500) && window.innerWidth === document.documentElement.clientWidth && !body.style.overflowY) {
          frozen = true; body.style.overflowY = 'hidden'
          if (!touchDown) thaw = window.setTimeout(unfreeze, 300)
        }
      }
      stop = playCraft(wrap, svg, () => wrap.classList.add('settled'))
      balanced = window.setTimeout(() => { unbalance = balanceShades(wrap) }, CRAFT_END)
      // the moment the glasses catch on the A, the page lets go and glides on until the word sits just
      // under the nav, still in view above the photos, unless the reader scrolled back up meanwhile
      done = window.setTimeout(() => {
        unlock?.(); unlock = undefined; unfreeze()
        const nav = document.querySelector<HTMLElement>('.nav')?.offsetHeight ?? 64
        const by = svg.getBoundingClientRect().top - nav - 20
        if (heldAt >= 0 && by > 0 && Math.abs(window.scrollY - heldAt) < 4)
          glide = easeScrollBy(by, 1100)
      }, CRAFT_LAND)
    }, { rootMargin: '0px 0px -50% 0px' })
    io.observe(wrap)
    return () => {
      unfreeze(); window.removeEventListener('touchstart', onTouchStart, topts); window.removeEventListener('touchend', onTouchEnd, topts); window.removeEventListener('touchcancel', onTouchEnd, topts)
      io.disconnect(); window.clearTimeout(done); window.clearTimeout(balanced); glide?.(); unlock?.(); unbalance?.(); stop?.(); wrap.classList.remove('play', 'settled', 'wait')
    }
  }, [])

  const phasesRef = useOnceInView<HTMLDivElement>(0.35, () => setCounting(true))
  // On a phone the stacked row is taller than the screen: the first figure can come into view before the
  // row is 35% in (in landscape it never gets there), so the count also starts the moment that figure appears.
  useEffect(() => {
    const fig = phasesRef.current?.querySelector('.ic-fig')
    if (!fig || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); setCounting(true) } })
    io.observe(fig)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The photos start at full width and shrink as they scroll up toward the nav, landing at the width
  // where photos, figures and bars fit one screen (~420px of text and bars below 4:5 photos).
  useEffect(() => {
    const el = phasesRef.current
    if (!el) return
    let raf = 0, cur = -1, last = 0
    const target = () => {
      const box = el.parentElement ?? el, cs = getComputedStyle(box)
      const full = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const vh = window.innerHeight
      const fit = Math.min(full, Math.max(600, 2.4 * vh - 1230))
      if (fit >= full || reducedMotion()) return -1
      const nav = document.querySelector<HTMLElement>('.nav')?.offsetHeight ?? 64
      const top = el.getBoundingClientRect().top
      // full size until the photos' top passes 40% of the screen, then shrink over the last stretch,
      // easing out so the last of it slows into place
      const from = vh * 0.4, to = nav + 24
      const p = Math.min(1, Math.max(0, (from - top) / (from - to)))
      return full - (full - fit) * (1 - Math.pow(1 - p, 3))
    }
    // the width follows the scroll through a short ease-out, so wheel steps glide instead of jumping
    const step = (now: number) => {
      raf = 0
      const want = target()
      if (want < 0) { cur = -1; el.style.removeProperty('--ic-phw'); return }
      const dt = last ? Math.min(64, now - last) : 16
      last = now
      cur = cur < 0 ? want : cur + (want - cur) * (1 - Math.exp(-dt / 160))
      if (Math.abs(want - cur) < 0.3) cur = want
      el.style.setProperty('--ic-phw', `${cur.toFixed(1)}px`)
      if (cur !== want) raf = requestAnimationFrame(step)
      else last = 0
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(step) }
    step(performance.now())
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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
              {[100].map((v) => (
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
