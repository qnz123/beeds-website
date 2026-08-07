'use client'

import { useEffect, useRef, useState } from 'react'

// The "a note on trends" statement that opens the Design Trends journal. Light
// editorial treatment (see .trend-note in globals.css) with a restrained
// scroll-reveal: the two underlines — solid "stay", broken "break" — draw in
// when the block enters view. All motion lives inside a prefers-reduced-motion
// guard, so reduced-motion (or a JS failure) simply shows the finished state.
export default function TrendNote() {
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
    <div ref={ref} className={`trend-note${inView ? ' is-in' : ''}`}>
      <p className="trend-note-lede">
        Trends are trends.{' '}
        <span className="trend-note-stay">Some stay.</span>{' '}
        <span className="trend-note-break">Some break.</span>
      </p>
      <p className="trend-note-body">
        The above is our own human read on what’s moving in design — not a
        rulebook or a “this is it.” Not every trend deserves a permanent place in
        a brand. Knowing which ones to build on, and which to let pass, is the
        work. That is exactly why we’re here.
      </p>
    </div>
  )
}
