'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

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
  const [prism, setPrism] = useState(false)
  const cancelled = useRef(false)
  const dispRef = useRef<SVGFEDisplacementMapElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    cancelled.current = false

    // Play once per browser session: when the visitor navigates back to the
    // homepage, the hero renders finished and static — no typewriter, no
    // cursor, no prism pass.
    let played = false
    try {
      played = window.sessionStorage.getItem('heroPlayed') === '1'
      if (!played) window.sessionStorage.setItem('heroPlayed', '1')
    } catch {
      /* storage unavailable — just play */
    }
    if (played) {
      setTyped([...LINES])
      setActiveLine(-1) // renders no cursor at all
      setCursorBlinkOut(true)
      return
    }

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

      // Half a beat after the typewriter lands, the prism focus pass plays:
      // the hero softens like glass and thin refraction lines drift across
      // while it pulls back into focus (see .hero-prism in globals.css).
      await sleep(500)
      if (cancelled.current) return
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setPrism(true)
        // Water refraction: the frame wobbles through the displacement filter
        // and settles to flat (scale 28 → 0) as the focus lands.
        const disp = dispRef.current
        if (disp) {
          const t0 = performance.now()
          const step = (t: number) => {
            const p = Math.min(1, (t - t0) / 2600)
            disp.setAttribute('scale', String(28 * Math.pow(1 - p, 3)))
            if (p < 1 && !cancelled.current) {
              rafRef.current = requestAnimationFrame(step)
            }
          }
          rafRef.current = requestAnimationFrame(step)
        }
      }
    }

    run()
    return () => {
      cancelled.current = true
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  return (
    <section
      className={`hero min-h-screen flex items-center px-10 py-16${prism ? ' hero-prism' : ''}`}
    >
      <div className="container-x w-full max-w-full hero-defocus">
        <h1 className="text-5xl leading-[1.2]">
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
        </h1>

        <p className="text-base max-w-[600px] leading-[1.8]">{t.body}</p>

        <a href="#contact" className="hero-cta">
          {t.cta}
        </a>
      </div>

      {/* Thin rainbow refraction lines for the prism pass */}
      <span className="hero-streaks" aria-hidden="true">
        <i className="hero-streak one" />
        <i className="hero-streak two" />
      </span>

      {/* Water refraction for the prism pass — referenced by .hero-defocus */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <filter id="hero-water" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.009 0.016"
            numOctaves="2"
            seed="4"
            result="noise"
          />
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="noise"
            scale="28"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </section>
  )
}
