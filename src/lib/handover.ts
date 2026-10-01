// The way between /watermark/ and the rest of the site (his calls, 2026-10-01). The site's cassette
// goes at once, and the underwater page opens as it always does, fading up from the ground.
// Leaving the underwater page, it fades to the ground, then the page it opens fades its content up
// out of that ground (html.arrive in globals.css). No page lays a ground over itself: on an iPhone,
// Safari's floating toolbar shows a page's content through it and no fixed layer reaches under it,
// so a ground over a page left a strip of the page showing there. The note that asks for the
// fade-up is a session-storage key that the head script in layout.tsx reads (as a string there:
// keep them in step).

export const ARRIVE_KEY = 'beeds:arrive'

// How long the underwater page takes to fade to the ground (.wm-veil): half
// as long on a phone (his ask, 2026-10-01: the trip felt slow there). The CSS fades follow the same
// split at 767px; keep the two in step.
export const handoverMs = () => (window.matchMedia('(max-width: 767px)').matches ? 350 : 700)

// A plain left click, which the hand-over takes over; new-tab and modified clicks are left to the
// browser.
export const isPlainClick = (e: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean }) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey

// Leaving the underwater page: leaves the note for the next page and goes once the fade is over
// (at once with reduced motion).
export function handOver(href: string) {
  try { sessionStorage.setItem(ARRIVE_KEY, '1') } catch {}
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.setTimeout(() => window.location.assign(href), still ? 0 : handoverMs())
}

// The site's cassette: goes at once; the underwater page fades up on its own.
export function toWater(href: string) {
  window.location.assign(href)
}
