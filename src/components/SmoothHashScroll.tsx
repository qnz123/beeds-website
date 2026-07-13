'use client'

import { useEffect } from 'react'

/**
 * When the About page is opened at `#services` (e.g. from the nav's Services
 * link, or a direct/bookmarked link), start at the very top and then smoothly
 * scroll DOWN to the Our Services section — a short guided tour from the top,
 * instead of an instant jump. Respects `prefers-reduced-motion`.
 */
export default function SmoothHashScroll({ targetId = 'services' }: { targetId?: string }) {
  useEffect(() => {
    if (window.location.hash !== `#${targetId}`) return
    const el = document.getElementById(targetId)
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Override any browser/Next hash jump and start at the top…
    window.scrollTo(0, 0)
    // …then, once the top has painted, glide down to the section.
    const t = setTimeout(() => {
      el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    }, 300)

    return () => clearTimeout(t)
  }, [targetId])

  return null
}
