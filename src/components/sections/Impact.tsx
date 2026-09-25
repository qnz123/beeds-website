'use client'

// Illustrative placeholder data — replace with real research/consulting figures
// before launch. Kept as top-of-file consts per the project's section convention.

import Image from 'next/image'
import { JetBrains_Mono } from 'next/font/google'
import { memo, useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { CRAFT_SVG, playCraft, restCraft } from './craftHeadline'

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

export default function Impact({ lang = 'en' as Locale }: { lang?: Locale }) {
  const t = getDictionary(lang).impact
  const wrapRef = useRef<HTMLDivElement>(null)
  const [counting, setCounting] = useState(false)

  // The headline plays once, when it is well into view; with reduced motion it simply sits there.
  useEffect(() => {
    const wrap = wrapRef.current
    const svg = wrap?.querySelector('svg')
    if (!wrap || !svg || typeof IntersectionObserver === 'undefined') return
    restCraft(wrap)
    if (reducedMotion()) return
    let stop: (() => void) | undefined
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      wrap.classList.remove('settled')
      wrap.classList.add('play')
      stop = playCraft(wrap, svg, () => wrap.classList.add('settled'))
    }, { threshold: 0.5 })
    io.observe(wrap)
    return () => { io.disconnect(); stop?.(); wrap.classList.remove('play', 'settled') }
  }, [])

  const phasesRef = useOnceInView<HTMLDivElement>(0.35, () => setCounting(true))

  return (
    <section id="impact" className={`ic bg-white py-20 px-10 ${mono.variable}`} aria-labelledby="ic-lede">
      <div className="container-x">
        <div className="ic-top">
          <div className="ic-hl" ref={wrapRef}>
            <h2 className="ic-title">
              <span className="sr-only">Craft</span>
              <CraftWord />
            </h2>
          </div>
          <p className="ic-lede" id="ic-lede">
            {t.lede} <span>{t.ledeRest}</span>
          </p>
        </div>

        <div className="ic-phases" ref={phasesRef}>
          {phases.map((p, i) => (
            <article className="ic-phase" key={p.img}>
              <figure className="ic-shot">
                <Image src={p.img} alt={t.alts[i]} width={1000} height={1250} sizes="(max-width: 760px) 100vw, 33vw" />
              </figure>
              <h3 className="ic-name">{t.phases[i]}</h3>
              <Figure stat={p.datum} run={counting} />
              <p className="ic-cap">{t.stats[p.stat]}</p>
            </article>
          ))}
        </div>

        <div className="ic-lift">
          <div className="ic-lift-head"><b>{t.liftHeading}</b></div>
          <div
            className="ic-lift-grid"
            role="img"
            aria-label={`${t.liftHeading}: ${channelLift.map((c, i) => `${t.channels[i]} 100 → ${c.after}`).join(', ')}.`}
          >
            <div className="ic-ruler" aria-hidden="true">
              {[0, 100, 150, 200].map((v) => (
                <span key={v} className={`ic-tick${v === 0 ? ' first' : ''}`} style={{ left: pct(v) }}><b>{v}</b></span>
              ))}
            </div>
            {channelLift.map((c, i) => (
              <div className="ic-row" key={c.glyph}>
                <div className="ic-ch"><Glyph name={c.glyph} />{t.channels[i]}</div>
                <div className="ic-track">
                  <div className="ic-base" style={{ width: pct(100) }} />
                  <div className="ic-gain" style={{ width: pct(c.after - 100) }} />
                </div>
                <div className="ic-up">+{c.after - 100}%</div>
                <div className="ic-end">{c.after}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="ic-note">{t.disclaimer}</p>
      </div>
    </section>
  )
}
