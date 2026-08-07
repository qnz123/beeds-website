'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// In-memory flag (resets on full page load): the hero animates on every fresh
// visit or reload, but sits static when the visitor navigates back to the
// homepage from another page of the site (client-side navigation keeps the
// module alive, so the flag survives; a reload clears it).
let playedThisPageLoad = false

function charDelay() {
  const rand = Math.random()
  if (rand > 0.85) return Math.random() * 60 + 120 // occasional slow
  if (rand > 0.75) return Math.random() * 20 + 20 // fast burst
  if (rand > 0.6) return Math.random() * 40 + 50 // medium-slow
  return Math.random() * 30 + 40 // moderate
}

export default function Hero({ lang = 'en' }: { lang?: Locale }) {
  const t = getDictionary(lang).hero
  const LINES = [t.line1, t.line2]

  const [typed, setTyped] = useState<string[]>(['', ''])
  const [activeLine, setActiveLine] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [cursorBlinkOut, setCursorBlinkOut] = useState(false)
  // The neon hover reveal arms once the typewriter has finished
  const [revealReady, setRevealReady] = useState(false)
  // Mobile shows the typewriter only — the neon hover layer renders solely on
  // hover-capable desktop viewports (same gate as the Explore study cards)
  const [isDesktop, setIsDesktop] = useState(false)
  const cancelled = useRef(false)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (pointer: fine)')
    const sync = () => setIsDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // Stripe palette (client-supplied 2026-08-07): random-width vertical strips
  // of these colors run across the full headline (background-clip: text).
  // The arrangement is rolled fresh per page load — built client-side only so
  // SSR markup stays deterministic.
  const [stripes, setStripes] = useState<string | null>(null)
  useEffect(() => {
    const PALETTE = ['#faeb2c', '#f52789', '#e900ff', '#1685f8', '#3d144c']
    const stops: string[] = []
    let pos = 0
    let prev = -1
    while (pos < 100) {
      let idx = Math.floor(Math.random() * PALETTE.length)
      if (idx === prev) idx = (idx + 1) % PALETTE.length // no touching twins
      prev = idx
      const end = Math.min(100, pos + 1.2 + Math.random() * 2.8) // 1.2–4% wide, dense
      stops.push(`${PALETTE[idx]} ${pos.toFixed(2)}% ${end.toFixed(2)}%`)
      pos = end
    }
    setStripes(`linear-gradient(90deg, ${stops.join(', ')})`)
  }, [])

  // Feed the cursor position to the rainbow reveal mask (see .hero-rainbow)
  const handleTitleMove = (e: React.MouseEvent) => {
    const el = titleRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  useEffect(() => {
    cancelled.current = false

    if (playedThisPageLoad) {
      setTyped([...LINES])
      setActiveLine(-1) // renders no cursor at all
      setCursorBlinkOut(true)
      setRevealReady(true) // no animation to wait for — reveal armed at once
      return
    }
    playedThisPageLoad = true

    async function run() {
      for (let i = 0; i < LINES.length; i++) {
        setActiveLine(i)
        const words = LINES[i].split(' ')
        let full = ''

        for (const word of words) {
          for (const char of word) {
            if (cancelled.current) return
            full += char
            setTyped((prev) => {
              const next = [...prev]
              next[i] = full
              return next
            })
            await sleep(charDelay())
          }
          full += ' '
          setTyped((prev) => {
            const next = [...prev]
            next[i] = full
            return next
          })
          await sleep(Math.random() * 170 + 80)
        }

        if (i < LINES.length - 1) await sleep(300)
      }

      // Blink the final cursor a couple times, then fade out
      for (let b = 0; b < 4; b++) {
        if (cancelled.current) return
        setCursorVisible((v) => !v)
        await sleep(300)
      }
      setCursorVisible(true)
      setCursorBlinkOut(true)

      setRevealReady(true)
    }

    run()
    return () => {
      cancelled.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  return (
    <section className="hero min-h-screen flex items-center px-10 py-16">
      <div className="container-x w-full max-w-full">
        <h1
          ref={titleRef}
          className={`hero-title text-5xl leading-[1.2]${revealReady ? ' reveal-ready' : ''}`}
          onMouseMove={handleTitleMove}
        >
          {/* Black ink layer — while the reveal is hovered, a hole matching
              the reveal circle is masked out of it so the rippling neon
              underneath is the only text inside the circle */}
          <div className="hero-ink">
            <div className="mb-10">
              <span className="typewriter-text">{typed[0]}</span>
              {activeLine === 0 && (
                <span
                  className={`typewriter-cursor ${cursorBlinkOut ? 'blinking-out' : ''}`}
                  style={{ opacity: cursorVisible ? 1 : 0 }}
                />
              )}
            </div>
            <div className="mb-16">
              <span className="typewriter-text">{typed[1]}</span>
              {activeLine === 1 && (
                <span
                  className={`typewriter-cursor ${cursorBlinkOut ? 'blinking-out' : ''}`}
                  style={{ opacity: cursorVisible ? 1 : 0 }}
                />
              )}
            </div>
          </div>

          {/* Rainbow layer beneath the ink — revealed in a soft circle that
              follows the cursor while hovering the headline. Each line mirrors
              the black layer exactly, including an invisible stand-in for the
              typewriter cursor (its inline-block grows the line box a few px;
              without the stand-in the two layers drift apart vertically).
              Desktop only — mobile gets the plain typewriter. */}
          {isDesktop && (
          <div
            className="hero-rainbow"
            aria-hidden="true"
            style={stripes ? { backgroundImage: stripes } : undefined}
          >
            <div className="mb-10">
              {typed[0]}
              {activeLine === 0 && (
                <span
                  className="typewriter-cursor"
                  style={{ visibility: 'hidden' }}
                />
              )}
            </div>
            <div className="mb-16">
              {typed[1]}
              {activeLine === 1 && (
                <span
                  className="typewriter-cursor"
                  style={{ visibility: 'hidden' }}
                />
              )}
            </div>
          </div>
          )}
        </h1>

        <p className="text-base max-w-[600px] leading-[1.8]">{t.body}</p>

        <a href="#contact" className="hero-cta">
          {t.cta}
        </a>
      </div>

      {/* Constant gentle water for the neon hover reveal (.hero-rainbow) —
          the revealed letters keep rippling under the circle. */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="hero-bubble" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.022"
            numOctaves="2"
            seed="7"
            result="bubble"
          >
            <animate
              attributeName="baseFrequency"
              dur="9s"
              values="0.012 0.022; 0.016 0.028; 0.012 0.022"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="bubble"
            scale="12"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </section>
  )
}
