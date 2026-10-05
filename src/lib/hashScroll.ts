// In-page links (the nav's Work / Services / Contact, the hero's two buttons) scroll the page
// themselves, at Chrome's pace, in every browser (his ask, 2026-10-05).
//
// Left to the browser, the same click lands very differently: Chrome's native smooth scroll grows
// with the distance (measured on the live site: 510ms over 964px, 913ms over 2957px), while Safari
// takes a flat ~210ms whatever the distance, so a trip down the homepage arrives almost at once and
// Firefox is quick in the same way. This matches Chrome's profile everywhere — about
// 17ms per √px, floored and capped — on an ease-in-out, so the page sets off and settles gently.
//
// Reduced motion jumps, as the browsers' own smooth scrolling does.

const MIN_MS = 300
const MAX_MS = 1000

export const hashScrollDuration = (distance: number) =>
  Math.round(Math.min(MAX_MS, Math.max(MIN_MS, 17 * Math.sqrt(Math.abs(distance)))))

let raf = 0

/**
 * Scrolls the window to a destination on Chrome's cadence. The destination is read again on every
 * frame, because the page can change height on the way: the trip to the booking form tells the CRAFT
 * section to finish, which takes about 1500px out from above the form — a target fixed at the click
 * would then land well short of it. Cancels any scroll of ours already running.
 */
export function hashScrollTo(dest: number | (() => number | null)) {
  cancelAnimationFrame(raf)
  const read = () => {
    const v = typeof dest === 'function' ? dest() : dest
    if (v === null) return null
    return Math.max(0, Math.min(v, document.documentElement.scrollHeight - window.innerHeight))
  }
  const startY = window.scrollY
  const first = read()
  if (first === null) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || Math.abs(first - startY) < 2) {
    window.scrollTo({ top: first, left: 0, behavior: 'instant' as ScrollBehavior })
    return
  }
  const dur = hashScrollDuration(first - startY)
  const t0 = performance.now()
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / dur)
    const endY = read() ?? first
    // 'instant' matters: html { scroll-behavior: smooth } would otherwise turn each of these
    // per-frame calls into its own smooth scroll toward a target that has already moved.
    window.scrollTo({ top: startY + (endY - startY) * ease(p), left: 0, behavior: 'instant' as ScrollBehavior })
    if (p < 1) raf = requestAnimationFrame(step)
    else settle()
  }
  // The arrival is held for a moment: the trip to the booking form lets the CRAFT section finish,
  // and the page loses and regains height for a few frames afterwards, which would otherwise leave
  // the form well below the screen. Any touch of the page gives it up at once.
  const settle = () => {
    const until = performance.now() + 900
    let go = true
    const off = () => { go = false }
    const opts = { passive: true, once: true } as AddEventListenerOptions
    window.addEventListener('wheel', off, opts)
    window.addEventListener('touchstart', off, opts)
    window.addEventListener('keydown', off, { once: true })
    const hold = (now: number) => {
      const endY = read()
      if (!go || endY === null || now > until) {
        window.removeEventListener('wheel', off)
        window.removeEventListener('touchstart', off)
        window.removeEventListener('keydown', off)
        return
      }
      if (Math.abs(window.scrollY - endY) > 2) {
        window.scrollTo({ top: endY, left: 0, behavior: 'instant' as ScrollBehavior })
      }
      raf = requestAnimationFrame(hold)
    }
    raf = requestAnimationFrame(hold)
  }
  raf = requestAnimationFrame(step)
}

/** Where a hash target sits, honouring its own scroll-margin-top (the sticky bar's allowance). */
export function hashTargetTop(id: string) {
  const el = document.getElementById(id)
  if (!el) return null
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
  return el.getBoundingClientRect().top + window.scrollY - margin
}

/**
 * Takes over plain left-clicks on links that point at a #section of the page already open, so every
 * browser scrolls there at the same pace. Anything else — another page, a new tab, a modified click,
 * a handler that already called preventDefault — is left alone.
 */
export function installHashScroll() {
  const onClick = (e: MouseEvent) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return
    const url = new URL(link.href, window.location.href)
    if (url.origin !== window.location.origin) return
    const here = url.pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '')
    if (!here || !url.hash || url.hash.length < 2) return
    const id = decodeURIComponent(url.hash.slice(1))
    // The booking form is left to the browser: its link first tells the CRAFT section to finish,
    // which takes ~1600px out of the page mid-trip, and only the browser's own scrolling (which
    // keeps resolving against the document as it reflows) lands on the form.
    if (id === 'contact' || hashTargetTop(id) === null) return
    e.preventDefault()
    hashScrollTo(() => hashTargetTop(id))
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${url.hash}`)
  }
  document.addEventListener('click', onClick)
  return () => {
    document.removeEventListener('click', onClick)
    cancelAnimationFrame(raf)
  }
}
