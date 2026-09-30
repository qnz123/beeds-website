// Entrances that wait for the reader (a fade-up, a count, CRAFT drawing itself) are there to be watched on
// the way down. When the page gets below one without it ever having been in view, it should simply stand
// finished for a reader who then comes back up: the nav's Contact link (straight to the booking form, from
// this page or another), a reload or the back button landing lower down, a dragged scrollbar.
//
// A plain IntersectionObserver cannot see that: an element that goes from below the screen to above it in
// one jump was out of view before and is out of view after, which is no change, so there is no callback.

/** Calls `passed` once `el` is found wholly above the screen (or under the sticky nav) before whatever
 *  reveals it has run: the page jumped past it, or a scroll carried it over the top without it ever being
 *  properly in view. Call the returned stop once the element has been revealed as usual (calling it again
 *  is harmless). */
export function whenPassedUnseen(el: Element, passed: () => void): () => void {
  if (typeof IntersectionObserver === 'undefined') return () => {}
  // the nav stays over the top of the screen, so what has gone under it is out of sight too
  const edge = document.querySelector<HTMLElement>('.nav')?.offsetHeight ?? 0
  let done = false
  const check = (entries: IntersectionObserverEntry[]) => {
    const r = entries[entries.length - 1].boundingClientRect
    // (an element with no box, display: none, reads as a zero rect at the top)
    if (done || r.height === 0 || r.bottom > edge) return
    stop()
    passed()
  }
  // This observer's screen reaches far up, so being above the real screen counts as being in view: a jump
  // from below to above then shows up as coming into view, and an element that is already above when it
  // starts is reported straight away (every observer reports its first reading).
  const jumped = new IntersectionObserver(check, { rootMargin: '1000000px 0px 0px 0px' })
  // This one's screen starts at the nav's lower edge: it reports the element going out of sight over it.
  const crossed = new IntersectionObserver(check, { rootMargin: `-${edge}px 0px 0px 0px` })
  jumped.observe(el)
  crossed.observe(el)
  function stop() {
    done = true
    jumped.disconnect()
    crossed.disconnect()
  }
  return stop
}
