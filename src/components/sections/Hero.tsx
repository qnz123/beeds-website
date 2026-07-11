'use client'

import { useEffect, useRef, useState } from 'react'

const LINES = ['SMALL FRAMES', 'BIG IMPACT']

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function charDelay() {
  const rand = Math.random()
  if (rand > 0.85) return Math.random() * 60 + 120 // occasional slow
  if (rand > 0.75) return Math.random() * 20 + 20 // fast burst
  if (rand > 0.6) return Math.random() * 40 + 50 // medium-slow
  return Math.random() * 30 + 40 // moderate
}

export default function Hero() {
  const [typed, setTyped] = useState<string[]>(LINES.map(() => ''))
  const [activeLine, setActiveLine] = useState(0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const [cursorBlinkOut, setCursorBlinkOut] = useState(false)
  const cancelled = useRef(false)

  useEffect(() => {
    cancelled.current = false

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
    }

    run()
    return () => {
      cancelled.current = true
    }
  }, [])

  return (
    <section className="hero min-h-screen flex items-center px-10 py-16">
      <div className="container-x w-full max-w-full">
        <h1 className="text-5xl leading-[1.2] mb-10">
          <span className="typewriter-text">{typed[0]}</span>
          {activeLine === 0 && (
            <span
              className={`typewriter-cursor ${cursorBlinkOut ? 'blinking-out' : ''}`}
              style={{ opacity: cursorVisible ? 1 : 0 }}
            />
          )}
        </h1>
        <h1 className="text-5xl leading-[1.2] mb-16">
          <span className="typewriter-text">{typed[1]}</span>
          {activeLine === 1 && (
            <span
              className={`typewriter-cursor ${cursorBlinkOut ? 'blinking-out' : ''}`}
              style={{ opacity: cursorVisible ? 1 : 0 }}
            />
          )}
        </h1>

        <p className="text-base max-w-[600px] leading-[1.8]">
          Your story is your brand. BEEDS ensures every creative asset is on point. Our AI engine
          audits tone and relevance. Combine judgement through human creative strategists weave in
          local nuance, patterns and governance.
        </p>
      </div>
    </section>
  )
}
