'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

// The "a note on trends" statement that opens the Design Trends journal. Light
// editorial treatment (see .trend-note in globals.css) with a restrained
// scroll-reveal: the two underlines — solid "stay", broken "break" — draw in
// when the block enters view. All motion lives inside a prefers-reduced-motion
// guard, so reduced-motion (or a JS failure) simply shows the finished state.
export default function TrendNote({ lang = 'en' }: { lang?: Locale }) {
  const t = getDictionary(lang).explore
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`trend-note${lang === 'ja' ? ' trend-note--ja' : ''}${
        inView ? ' is-in' : ''
      }`}
    >
      <p className="trend-note-lede">
        {t.trendLede}{' '}
        <span className="trend-note-stay">{t.trendStay}</span>{' '}
        <span className="trend-note-break">{t.trendBreak}</span>
      </p>
      {t.trendBody.map((paragraph) => (
        <p key={paragraph.slice(0, 16)} className="trend-note-body">
          {paragraph}
        </p>
      ))}
    </div>
  )
}
