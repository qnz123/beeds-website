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

/** Holds the page where it is for downward scrolling until the returned release is called; scrolling up
 *  still works. While held, the page simply ends at the bottom of the screen: <main> is clipped there
 *  (with layout containment, which Firefox needs before it stops counting what lies below) and the
 *  footer set aside, so the browser's own scrolling stops as it does at the end of any page.
 *  Snapping back from a scroll listener could not do that in Chrome: a trackpad swipe or an animated
 *  wheel scroll already under way is not cancelable, so the browser kept moving the page down while the
 *  listener pulled it up every frame, and the screen shook. */
function holdScrollDown(): () => void {
  const floor = window.scrollY
  const root = document.documentElement
  const main = document.querySelector('main'), footer = document.querySelector('footer')
  const endHere = () => {
    if (!main) return
    const top = main.getBoundingClientRect().top + window.scrollY
    main.style.maxHeight = `${Math.max(0, floor + root.clientHeight - top)}px`
  }
  if (main) { main.style.overflowY = 'clip'; main.style.contain = 'layout'; if (footer) footer.style.display = 'none'; endHere() }
  // and no rubber-band bounce against that end, so the page stops dead. (With this on, a non-passive
  // wheel listener made WebKit refuse to scroll back up, so the end itself is the only stop now.)
  const prevOverscroll = root.style.overscrollBehaviorY
  root.style.overscrollBehaviorY = 'none'
  // a fallback only, for a browser without overflow: clip
  const scroll = () => { if (window.scrollY > floor + 1) window.scrollTo({ top: floor, behavior: 'instant' as ScrollBehavior }) }
  window.addEventListener('scroll', scroll, { passive: true })
  window.addEventListener('resize', endHere)
  return () => {
    window.removeEventListener('scroll', scroll)
    window.removeEventListener('resize', endHere)
    if (main) { main.style.removeProperty('max-height'); main.style.removeProperty('overflow-y'); main.style.removeProperty('contain') }
    if (footer) footer.style.removeProperty('display')
    root.style.overscrollBehaviorY = prevOverscroll
  }
}

/** The nav's Contact link announces a trip past this section to the booking form with this event
 *  (Navigation.tsx). Calls `done` once that trip's scroll is over: at scrollend (ignoring one straight
 *  after the click, which belongs to a scroll it cut short), once the page has been still for 250ms
 *  (Safari has no scrollend, and WebKit can start moving ~250ms after the click, hence the longer first
 *  wait), at the reader's own wheel, touch or key, or after 4s at most. Returns a cancel. */
const PASS_EVENT = 'beeds:pass'
function whenTripEnds(done: () => void): () => void {
  const t0 = performance.now()
  let over = false
  let idle = window.setTimeout(() => end(), 700)
  const max = window.setTimeout(() => end(), 4000)
  const onScroll = () => { window.clearTimeout(idle); idle = window.setTimeout(() => end(), 250) }
  const onScrollEnd = () => { if (performance.now() - t0 > 150) end() }
  const onInput = () => end()
  const stop = () => {
    window.clearTimeout(idle); window.clearTimeout(max)
    window.removeEventListener('scroll', onScroll); window.removeEventListener('scrollend', onScrollEnd)
    window.removeEventListener('wheel', onInput); window.removeEventListener('touchstart', onInput); window.removeEventListener('keydown', onInput)
  }
  function end() { if (over) return; over = true; stop(); done() }
  window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('scrollend', onScrollEnd)
  window.addEventListener('wheel', onInput, { passive: true }); window.addEventListener('touchstart', onInput, { passive: true }); window.addEventListener('keydown', onInput)
  return () => { if (!over) { over = true; stop() } }
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
  const playedRef = useRef(false)
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
    let heldAt = -1, played = false, passing = false, endTrip: (() => void) | undefined

    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || passing) return
      played = true; playedRef.current = true
      io.disconnect()
      wrap.classList.remove('settled', 'wait')
      wrap.classList.add('play')
      // arriving from above, the page holds here until the word has finished drawing (scrolling back up still works)
      heldAt = e.boundingClientRect.top > 0 ? window.scrollY : -1
      if (heldAt >= 0) unlock = holdScrollDown()
      stop = playCraft(wrap, svg, () => wrap.classList.add('settled'))
      balanced = window.setTimeout(() => { unbalance = balanceShades(wrap) }, CRAFT_END)
      // the moment the glasses catch on the A, the page lets go and glides on until the word sits just
      // under the nav, still in view above the photos, unless the reader scrolled back up meanwhile
      done = window.setTimeout(() => {
        unlock?.(); unlock = undefined
        const nav = document.querySelector<HTMLElement>('.nav')?.offsetHeight ?? 64
        const by = svg.getBoundingClientRect().top - nav - 20
        if (heldAt >= 0 && by > 0 && Math.abs(window.scrollY - heldAt) < 4)
          glide = easeScrollBy(by, 1100)
      }, CRAFT_LAND)
    }, { rootMargin: '0px 0px -50% 0px' })
    io.observe(wrap)
    // The nav's Contact link goes past on its way to the booking form: let go of any hold or glide, and
    // do not start the headline while the page goes by; look again once the trip is over (a reader who
    // scrolls back up then gets it as usual). The hero's "I want to build…" is not part of this: it
    // still stops here.
    const onPass = () => {
      passing = true
      unlock?.(); unlock = undefined; heldAt = -1; glide?.(); glide = undefined
      endTrip?.()
      endTrip = whenTripEnds(() => { passing = false; endTrip = undefined; if (!played) { io.unobserve(wrap); io.observe(wrap) } })
    }
    window.addEventListener(PASS_EVENT, onPass)
    return () => {
      window.removeEventListener(PASS_EVENT, onPass); endTrip?.()
      io.disconnect(); window.clearTimeout(done); window.clearTimeout(balanced); glide?.(); unlock?.(); unbalance?.(); stop?.(); wrap.classList.remove('play', 'settled', 'wait')
    }
  }, [])

  // The hero's "I want to build…" (a plain #contact link) is meant to stop at CRAFT, not run on to the
  // booking form. Left to the browser, whether it stopped depended on the headline being caught
  // mid-scroll, which Safari's fast smooth scroll skipped. So it now scrolls to CRAFT itself: to the point
  // where the headline starts and holds, if it has not played yet (the usual hold, play and glide follow);
  // otherwise, or with reduced motion, to the headline sitting under the nav. (The nav's Contact link is
  // the one that goes on to the booking form.)
  useEffect(() => {
    const onClick = (ev: MouseEvent) => {
      if (ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return
      if (!(ev.target instanceof Element) || !ev.target.closest('a.hero-btn-connect')) return
      const wrap = wrapRef.current, word = wrap?.querySelector('svg')
      if (!wrap || !word) return
      ev.preventDefault()
      const still = reducedMotion()
      const nav = document.querySelector<HTMLElement>('.nav')?.offsetHeight ?? 64
      const top = !still && !playedRef.current
        ? window.scrollY + wrap.getBoundingClientRect().top - window.innerHeight * 0.45
        : window.scrollY + word.getBoundingClientRect().top - nav - 20
      window.scrollTo({ top, behavior: still ? ('instant' as ScrollBehavior) : 'smooth' })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
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
    let raf = 0, cur = -1, last = 0, passing = false, endTrip: (() => void) | undefined
    // Both widths live on the container: --ic-phw is the photos' moving width; --ic-fitw is the width
    // they land at, which the bar block and the note below keep all the time (they do not shrink along)
    const host = el.parentElement ?? el
    let fitSet = -1
    const setFit = (w: number) => {
      if (w === fitSet) return
      fitSet = w
      if (w < 0) host.style.removeProperty('--ic-fitw')
      else host.style.setProperty('--ic-fitw', `${w.toFixed(1)}px`)
    }
    const target = () => {
      const box = el.parentElement ?? el, cs = getComputedStyle(box)
      const full = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const vh = window.innerHeight
      const fit = Math.min(full, Math.max(600, 2.4 * vh - 1230))
      if (fit >= full || reducedMotion()) { setFit(-1); return -1 }
      setFit(fit)
      const nav = document.querySelector<HTMLElement>('.nav')?.offsetHeight ?? 64
      const top = el.getBoundingClientRect().top
      // full size until the photos' top passes 40% of the screen, then shrink over half the stretch
      // down to the nav (so the smaller version arrives twice as soon), easing out so the last of it
      // slows into place
      const from = vh * 0.4, to = from - (from - (nav + 24)) / 2
      const p = passing ? 1 : Math.min(1, Math.max(0, (from - top) / (from - to)))
      return full - (full - fit) * (1 - Math.pow(1 - p, 3))
    }
    // the width follows the scroll through a short ease-out, so wheel steps glide instead of jumping
    const step = (now: number) => {
      raf = 0
      const want = target()
      if (want < 0) { cur = -1; host.style.removeProperty('--ic-phw'); return }
      const dt = last ? Math.min(64, now - last) : 16
      last = now
      cur = cur < 0 || passing ? want : cur + (want - cur) * (1 - Math.exp(-dt / 160))
      if (Math.abs(want - cur) < 0.3) cur = want
      host.style.setProperty('--ic-phw', `${cur.toFixed(1)}px`)
      if (cur !== want) raf = requestAnimationFrame(step)
      else last = 0
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(step) }
    // On the Contact link's trip past, the photos take their final size at once, before the page is
    // measured, so it does not change height on the way down and the booking form lands where aimed
    const onPass = () => {
      passing = true
      cancelAnimationFrame(raf); raf = 0; last = 0; step(performance.now())
      endTrip?.()
      endTrip = whenTripEnds(() => { passing = false; endTrip = undefined; queue() })
    }
    step(performance.now())
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    window.addEventListener(PASS_EVENT, onPass)
    return () => {
      cancelAnimationFrame(raf); endTrip?.()
      window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); window.removeEventListener(PASS_EVENT, onPass)
    }
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
          {/* inside the block, so it fades in with the bars rather than on its own */}
          <p className="ic-note">{t.disclaimer}</p>
        </div>
      </div>
    </section>
  )
}
