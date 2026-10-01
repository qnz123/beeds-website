// The fade between /watermark/ and the rest of the site. Only the underwater page fades, both ways
// (his call, 2026-10-01): leaving it, it fades to the ground and then goes; arriving at it from the
// site's cassette, it starts under the ground and fades up out of it (html.arrive in globals.css),
// with the cassette at the same size and place. The site's own pages never fade: on an iPhone,
// Safari's floating toolbar shows a page's content through it, and no fixed layer reaches under
// it, so a fading page left a strip of itself showing there. The note that asks for the fade-up is
// a session-storage key that the head script in layout.tsx reads (as a string there: keep them in
// step).

export const ARRIVE_KEY = 'beeds:arrive'

// How long the underwater page takes to fade to the ground (.wm-veil) and back up: half
// as long on a phone (his ask, 2026-10-01: the trip felt slow there). The CSS fades follow the same
// split at 767px; keep the two in step.
export const handoverMs = () => (window.matchMedia('(max-width: 767px)').matches ? 350 : 700)

// A plain left click, which the hand-over takes over; new-tab and modified clicks are left to the
// browser.
export const isPlainClick = (e: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean }) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey

// Leaving the underwater page: goes once its fade is over (at once with reduced motion).
export function handOver(href: string) {
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.setTimeout(() => window.location.assign(href), still ? 0 : handoverMs())
}

// The site's cassette: goes at once, with a note that the underwater page should fade up.
export function toWater(href: string) {
  try { sessionStorage.setItem(ARRIVE_KEY, '1') } catch {}
  window.location.assign(href)
}
