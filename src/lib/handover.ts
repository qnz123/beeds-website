// The fade between /watermark/ and the rest of the site, both ways. The page being left fades to
// the ground with the cassette mark held in place, then navigates in the same tab; the page it
// opens starts under the same ground and fades up out of it (html.arrive in globals.css), with
// the cassette at the same size and place. The note between the two is a session-storage key that
// the head script in layout.tsx reads (as a string there: keep them in step).

export const ARRIVE_KEY = 'beeds:arrive'

// How long the leaving page takes to fade to the ground (the .wm-veil and html.leaving fades): half
// as long on a phone (his ask, 2026-10-01: the trip felt slow there). The CSS fades follow the same
// split at 767px; keep the two in step.
export const handoverMs = () => (window.matchMedia('(max-width: 767px)').matches ? 350 : 700)

// A plain left click, which the hand-over takes over; new-tab and modified clicks are left to the
// browser.
export const isPlainClick = (e: { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean }) =>
  e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey

// Leaves a note for the next page and goes once the fade is over (at once with reduced motion).
export function handOver(href: string) {
  try { sessionStorage.setItem(ARRIVE_KEY, '1') } catch {}
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.setTimeout(() => window.location.assign(href), still ? 0 : handoverMs())
}
