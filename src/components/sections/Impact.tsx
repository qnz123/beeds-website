'use client'

// Illustrative placeholder data — replace with real research/consulting figures
// before launch. Kept as top-of-file consts per the project's section convention.

import { useEffect, useRef, useState } from 'react'

const ACCENT = '#ccb718' // restrained accent for "growth" marks, used sparingly
const BASE_GREY = '#ccc' // baseline / comparison marks

/** A KPI stat: `value` is the authored display string (also the sr-only source
 *  of truth); `target`/`prefix`/`suffix`/`decimals` describe how to count it
 *  up from 0 on scroll-reveal without losing the exact final formatting. */
type StatDatum = {
  value: string
  label: string
  target: number
  prefix: string
  suffix: string
  decimals: number
}

const resultStats: StatDatum[] = [
  { value: '+142%', label: 'Average engagement lift across client channels', target: 142, prefix: '+', suffix: '%', decimals: 0 },
  { value: '3.2×', label: 'Increase in monthly content output', target: 3.2, prefix: '', suffix: '×', decimals: 1 },
  { value: '58%', label: 'Faster time-to-launch on new campaigns', target: 58, prefix: '', suffix: '%', decimals: 0 },
]

const channelLift = [
  { name: 'Organic Search', before: 100, after: 156 },
  { name: 'Paid Social', before: 100, after: 212 },
  { name: 'Search Ads', before: 100, after: 134 },
  { name: 'Email', before: 100, after: 178 },
]

// ---------------------------------------------------------------------------
// Scroll-reveal + count-up primitives
//
// `useInView` mirrors the `useRevealOnScroll` hook in VideoPortfolio.tsx: an
// IntersectionObserver fires once (threshold ~0.3, 10% bottom rootMargin) and
// disconnects. The hidden state is a *client-only* transition ('idle' ->
// 'hidden' -> 'visible') so SSR/no-JS output always renders in the 'idle'
// state, which is visually identical to 'visible' — nothing is ever
// permanently invisible if JS fails or the observer never fires.
// `prefers-reduced-motion` skips straight from 'idle' to 'visible'.
// ---------------------------------------------------------------------------

type AnimState = 'idle' | 'hidden' | 'visible'

function useInView<T extends Element>(threshold = 0.3) {
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
      { threshold, rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, state, dataAnimate: state === 'idle' ? undefined : state }
}

/** Elegant ease-out count-up from 0 to `stat.target`, ~1.1s, staggered by
 *  `delayMs`. Screen readers get the exact authored string regardless of
 *  animation timing: the animating number is aria-hidden, paired with a
 *  static sr-only span. */
function StatValue({ stat, state, delayMs }: { stat: StatDatum; state: AnimState; delayMs: number }) {
  const [display, setDisplay] = useState(stat.target)
  const startedRef = useRef(false)

  useEffect(() => {
    if (state === 'hidden') {
      setDisplay(0)
      return
    }
    if (state !== 'visible' || startedRef.current) return
    startedRef.current = true

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(stat.target)
      return
    }

    let raf = 0
    const duration = 1100
    const timer = setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        setDisplay(stat.target * eased)
        if (t < 1) raf = requestAnimationFrame(tick)
        else setDisplay(stat.target)
      }
      raf = requestAnimationFrame(tick)
    }, delayMs)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [state, stat.target, delayMs])

  const formatted = `${stat.prefix}${display.toFixed(stat.decimals)}${stat.suffix}`

  return (
    <div
      className="impact-stat border-t border-black pt-5"
      data-animate={state === 'idle' ? undefined : state}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <div className="text-4xl md:text-5xl mb-2 tabular-nums" aria-hidden="true">
        {formatted}
      </div>
      <span className="sr-only">{stat.value}</span>
      <div className="text-xs text-[#666] leading-snug">{stat.label}</div>
    </div>
  )
}

/** Stat callout grid, revealed + counted-up together once ~40% in view,
 *  staggered ~90ms per item. */
function StatsGrid({ stats, columnsClass }: { stats: StatDatum[]; columnsClass: string }) {
  const { ref, state } = useInView<HTMLDivElement>(0.4)
  return (
    <div ref={ref} className={`grid ${columnsClass} gap-x-8 gap-y-10 mb-16`}>
      {stats.map((s, i) => (
        <StatValue key={s.label} stat={s} state={state} delayMs={i * 90} />
      ))}
    </div>
  )
}

/** Grouped bar chart (before / after) used for the per-channel lift illustration. */
function ChannelLiftChart() {
  const width = 600
  const height = 240
  const padTop = 34
  const padBottom = 48
  const padX = 12
  const max = Math.max(...channelLift.map((d) => d.after)) * 1.08
  const plotH = height - padTop - padBottom
  const baselineY = padTop + plotH
  const groupWidth = (width - padX * 2) / channelLift.length
  const barWidth = 34
  const barGap = 8

  const barY = (value: number) => padTop + plotH * (1 - value / max)
  const barH = (value: number) => plotH * (value / max)

  const { ref, state } = useInView<HTMLElement>(0.3)

  return (
    <figure ref={ref} data-animate={state === 'idle' ? undefined : state}>
      <div className="flex items-center gap-5 mb-3 text-xs text-[#666]">
        <span className="flex items-center gap-2">
          <span style={{ width: 10, height: 10, background: BASE_GREY, display: 'inline-block' }} />
          Before
        </span>
        <span className="flex items-center gap-2">
          <span style={{ width: 10, height: 10, background: ACCENT, display: 'inline-block' }} />
          After
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: '100%', height: 'auto' }}
        role="img"
        aria-label={`Grouped bar chart comparing an illustrative before-and-after index per channel: ${channelLift
          .map((c) => `${c.name} up ${c.after - c.before}%`)
          .join(', ')}.`}
      >
        <title>Illustrative before/after lift by channel</title>
        <line x1={padX} y1={baselineY} x2={width - padX} y2={baselineY} stroke="#000" strokeWidth={1} />
        {channelLift.map((c, i) => {
          const groupCenter = padX + groupWidth * i + groupWidth / 2
          const beforeX = groupCenter - barGap / 2 - barWidth
          const afterX = groupCenter + barGap / 2
          const beforeH = barH(c.before)
          const afterH = barH(c.after)
          const pairDelay = i * 110
          return (
            <g key={c.name}>
              <rect
                className="impact-bar"
                x={beforeX}
                y={barY(c.before)}
                width={barWidth}
                height={beforeH}
                fill={BASE_GREY}
                style={{ transitionDelay: `${pairDelay}ms` }}
              />
              <rect
                className="impact-bar"
                x={afterX}
                y={barY(c.after)}
                width={barWidth}
                height={afterH}
                fill={ACCENT}
                style={{ transitionDelay: `${pairDelay + 90}ms` }}
              />
              <text
                className="impact-lift-label"
                x={afterX + barWidth / 2}
                y={barY(c.after) - 8}
                textAnchor="middle"
                fontSize={12}
                fill={ACCENT}
                fontFamily="'Times New Roman', Times, serif"
                style={{ transitionDelay: `${pairDelay + 840}ms` }}
              >
                +{c.after - c.before}%
              </text>
              <text
                x={groupCenter}
                y={baselineY + 20}
                textAnchor="middle"
                fontSize={11}
                letterSpacing={0.4}
                fill="#666"
                fontFamily="'Times New Roman', Times, serif"
              >
                {c.name}
              </text>
            </g>
          )
        })}
      </svg>
    </figure>
  )
}

export default function Impact() {
  const block2 = useInView<HTMLDivElement>(0.25)

  return (
    <section id="impact" className="bg-white py-20 px-10 border-t border-black">
      <div className="container-x">
        {/* Results of Creative Consulting */}
        <div ref={block2.ref} className="impact-reveal" data-animate={block2.dataAnimate}>
          <p className="text-2xl leading-[1.55] max-w-[780px] mb-12">
            Creative consulting doesn&apos;t end with recommendations. It continues through
            production. This is what happens when strategy is transformed into stories,
            experiences, and results.
          </p>
          <StatsGrid stats={resultStats} columnsClass="grid-cols-1 md:grid-cols-3" />
          <div className="max-w-[720px]">
            <ChannelLiftChart />
          </div>
        </div>

        <p className="text-xs text-[#999] mt-16">Figures are demonstration purposes.</p>
      </div>
    </section>
  )
}
