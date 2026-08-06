'use client'

import { useEffect, useRef, useState } from 'react'
import DeckAccess from './DeckAccess'
import StudyLightbox from './StudyLightbox'

// Interactive design studies. Each card embeds one of the self-contained
// scroll-choreographed pages served from /public/studies as a scaled, live
// iframe. On hover (or keyboard focus) we drive the embedded page's own Lenis
// instance — which every study exposes on `window.__lenis` — to smooth-scroll
// from top to bottom, so the full GSAP/ScrollTrigger choreography plays inside
// the thumbnail. Falls back to native smooth scroll, and skips motion entirely
// under prefers-reduced-motion.
//
// The iframe is rendered at a fixed desktop viewport (1280×800) and scaled to
// the card width, so the window shows a faithful mini-browser of the real page.
//
// Access model: before access the cards are non-interactive teasers and the
// gated CTA below (DeckAccess) captures a lead. AFTER access is granted, these
// same cards become clickable — clicking one opens it in the larger scroll-only
// review canvas (StudyLightbox). No duplicate gallery; the originals do the job.

type Study = {
  slug: string
  name: string
  descriptor: string
  tag: string
  accent: string
}

const STUDIES: Study[] = [
  {
    slug: 'meridian',
    name: 'MERIDIAN',
    descriptor: 'A mechanical watch, taken apart by scrolling.',
    tag: 'Dark cinematic luxury',
    accent: '#c9a96a',
  },
  {
    slug: 'aura',
    name: 'aura',
    descriptor: 'A serum argued one drop at a time.',
    tag: 'Light, liquid, organic',
    accent: '#e8c4c4',
  },
  {
    slug: 'volt',
    name: 'VOLT',
    descriptor: 'Headphones that shout back at the scroll.',
    tag: 'Brutalist kinetic',
    accent: '#d8ff00',
  },
]

const BASE_W = 1280
const BASE_H = 800

function StudyCard({
  study,
  granted,
  onOpen,
}: {
  study: Study
  granted: boolean
  onOpen: (slug: string) => void
}) {
  const windowRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const rafRef = useRef<number | null>(null)

  const [scale, setScale] = useState(1)
  const [inView, setInView] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Only run the live iframe where hover exists and the viewport is wide enough;
  // small/touch screens get the lightweight static poster and tap-to-open.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Defer loading the embedded page until the card is near the viewport.
  useEffect(() => {
    const el = windowRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Keep the iframe scaled to the card width (mini-browser at a real 1280px layout).
  useEffect(() => {
    const el = windowRef.current
    if (!el) return
    const compute = () => setScale(el.clientWidth / BASE_W)
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const prefersReduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const cancelRaf = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  // rAF fallback for pages without Lenis (e.g. reduced-motion inside the frame).
  const nativeScrollTo = (win: Window, to: number, ms: number) => {
    cancelRaf()
    const doc = win.document
    const start = doc.documentElement.scrollTop || doc.body.scrollTop || 0
    const delta = to - start
    let t0: number | null = null
    const step = (t: number) => {
      if (t0 == null) t0 = t
      const p = Math.min(1, (t - t0) / ms)
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      win.scrollTo(0, start + delta * eased)
      if (p < 1) rafRef.current = requestAnimationFrame(step)
      else rafRef.current = null
    }
    rafRef.current = requestAnimationFrame(step)
  }

  const play = () => {
    if (prefersReduced()) return
    const iframe = iframeRef.current
    const win = iframe?.contentWindow as (Window & { __lenis?: any }) | null
    const doc = iframe?.contentDocument
    if (!win || !doc) return
    const max = Math.max(0, doc.documentElement.scrollHeight - win.innerHeight)
    if (max <= 0) return
    const duration = Math.min(18, Math.max(6, max / 520)) // ~520px/sec, clamped
    if (win.__lenis) {
      win.__lenis.scrollTo(max, { duration, easing: (t: number) => t })
    } else {
      nativeScrollTo(win, max, duration * 1000)
    }
  }

  const rewind = () => {
    cancelRaf()
    const win = iframeRef.current?.contentWindow as
      | (Window & { __lenis?: any })
      | null
    if (!win) return
    if (win.__lenis) win.__lenis.scrollTo(0, { duration: 1 })
    else win.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => cancelRaf, [])

  const showFrame = isDesktop && inView

  // When access is granted the window becomes a real, keyboard-operable control
  // that opens the full review canvas.
  const interactiveProps = granted
    ? {
        role: 'button' as const,
        tabIndex: 0,
        'aria-label': `Open the full ${study.name} review`,
        onClick: () => onOpen(study.slug),
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpen(study.slug)
          }
        },
      }
    : {}

  return (
    <div className="flex flex-col">
      <div
        className={`group relative block overflow-hidden border border-black bg-white${
          granted
            ? ' cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black'
            : ''
        }`}
        style={{ aspectRatio: `${BASE_W} / ${BASE_H}` }}
        onMouseEnter={play}
        onMouseLeave={rewind}
        {...interactiveProps}
      >
        <div ref={windowRef} className="absolute inset-0" aria-hidden="true">
          {showFrame ? (
            <iframe
              ref={iframeRef}
              src={`/studies/${study.slug}.html`}
              title={`${study.name} — interactive study preview`}
              tabIndex={-1}
              scrolling="no"
              loading="lazy"
              style={{
                width: BASE_W,
                height: BASE_H,
                border: 0,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                pointerEvents: 'none',
              }}
            />
          ) : (
            // Static poster (mobile / pre-load): brand name + palette, BEEDS type.
            <div
              className="flex h-full w-full flex-col items-center justify-center gap-4"
              style={{ backgroundColor: '#0d0d0d' }}
            >
              <span
                className="text-3xl md:text-4xl tracking-wide"
                style={{ color: '#f2f2f2' }}
              >
                {study.name}
              </span>
              <span className="h-1 w-14" style={{ backgroundColor: study.accent }} />
            </div>
          )}
        </div>

        {/* Hover affordance */}
        <span className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 text-[11px] uppercase tracking-[0.12em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 bg-gradient-to-t from-black/70 to-transparent">
          <span>Hover to scroll</span>
          <span>{granted ? 'Click to review →' : 'Full study — customers only'}</span>
        </span>
      </div>

      {/* Caption — BEEDS editorial */}
      <div className="mt-4 pt-4 border-t border-black">
        <h3 className="text-xl leading-none">{study.name}</h3>
        <p className="mt-3 text-sm leading-[1.6] text-[#666]">{study.descriptor}</p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-[#999]">
          {study.tag}
        </p>
      </div>
    </div>
  )
}

export default function StudyShowcase() {
  const [granted, setGranted] = useState(false)
  const [active, setActive] = useState<string | null>(null)

  // Returning visitors who already unlocked get the interactive cards straight away.
  useEffect(() => {
    if (window.localStorage.getItem('deckAccess') === '1') setGranted(true)
  }, [])

  const handleGranted = () => {
    window.localStorage.setItem('deckAccess', '1')
    setGranted(true)
  }

  const activeStudy = STUDIES.find((s) => s.slug === active) ?? null

  return (
    <section className="py-14 px-10 border-t border-black">
      <div className="container-x">
        <h2 className="eyebrow mb-3">Interactive Studies</h2>
        <p className="text-sm leading-[1.6] text-[#666] max-w-[560px] mb-10">
          <span className="brush-highlight">Hover a frame</span> to watch it play
          from top to bottom
          {granted ? ', or click to open the full review.' : '.'}
        </p>

        <div className="grid gap-x-8 gap-y-12 md:grid-cols-3">
          {STUDIES.map((study) => (
            <StudyCard
              key={study.slug}
              study={study}
              granted={granted}
              onOpen={setActive}
            />
          ))}
        </div>

        {granted ? (
          <p className="mt-12 pt-8 border-t border-black eyebrow text-[#666]">
            Access granted — click any study above to open its full review.
          </p>
        ) : (
          // Single gated CTA — one-click Google sign-in + email fallback.
          <DeckAccess onGranted={handleGranted} />
        )}
      </div>

      {activeStudy && (
        <StudyLightbox
          slug={activeStudy.slug}
          name={activeStudy.name}
          onClose={() => setActive(null)}
        />
      )}
    </section>
  )
}
