'use client'

import { useEffect, useRef, useState } from 'react'

// A scroll-only "canvas" that embeds one study for review. Rules (per client
// direction): the visitor can only scroll up and down through the design — no
// clicking into it, no navigation — and the code behind it stays out of reach.
//
// The study is embedded with pointer-events:none (nothing to right-click /
// "view frame source"), covered by a transparent overlay that captures scroll
// and blocks the context menu + drag, and the raw file URL is never surfaced as
// a link. The overlay forwards vertical wheel/touch/keys to the embedded page's
// own Lenis instance (window.__lenis) so the design's scroll choreography plays;
// it falls back to native scroll when Lenis isn't present (e.g. reduced-motion,
// where the page is already fully visible and static).
//
// NOTE: strong, casual-proof protection — not DRM. Dev tools can still inspect
// network traffic; a true lock would need a server-side render/proxy.

const BASE_W = 1280

export default function ReviewCanvas({
  slug,
  name,
  autoFocus = false,
}: {
  slug: string
  name: string
  autoFocus?: boolean
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const targetRef = useRef(0)
  const [dims, setDims] = useState({ scale: 0.5, h: 900 })

  // Keep the embedded desktop page (1280-wide) scaled to fill the canvas, and
  // size its logical viewport to the visible slice so scroll math is correct.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const compute = () => {
      const scale = el.clientWidth / BASE_W
      setDims({ scale, h: el.clientHeight / scale })
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Drive the embedded page's internal scroll by a delta, clamped to its range.
  const scrollByDelta = (delta: number) => {
    const win = iframeRef.current?.contentWindow as
      | (Window & { __lenis?: any })
      | null
    const doc = iframeRef.current?.contentDocument
    if (!win || !doc) return
    const max = Math.max(0, doc.documentElement.scrollHeight - win.innerHeight)
    targetRef.current = Math.min(max, Math.max(0, targetRef.current + delta))
    if (win.__lenis) win.__lenis.scrollTo(targetRef.current, { duration: 0.4 })
    else win.scrollTo({ top: targetRef.current })
  }

  // Native (non-passive) listeners so preventDefault actually stops the outer
  // page from scrolling — React binds wheel/touch as passive, which wouldn't.
  useEffect(() => {
    const el = overlayRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      scrollByDelta(e.deltaY)
    }
    let ty = 0
    const onTouchStart = (e: TouchEvent) => {
      ty = e.touches[0].clientY
    }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY
      scrollByDelta(ty - y)
      ty = y
      e.preventDefault()
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.key === ' ' || e.key === 'PageDown' || e.key === 'PageUp' ? 600 : 90
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault()
      scrollByDelta(step)
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault()
      scrollByDelta(-step)
    }
  }

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden border border-black bg-white"
      style={{ height: 'min(80vh, 760px)' }}
    >
      <iframe
        ref={iframeRef}
        src={`/studies/${slug}.html`}
        title={`${name} — design review`}
        aria-hidden="true"
        tabIndex={-1}
        scrolling="no"
        onLoad={() => {
          targetRef.current = 0
        }}
        style={{
          width: BASE_W,
          height: dims.h,
          border: 0,
          transform: `scale(${dims.scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      />
      {/* Scroll-capture overlay: forwards vertical scroll, blocks clicks +
          context menu so the code/URL stays out of reach. */}
      <div
        ref={overlayRef}
        role="group"
        aria-label={`${name} design review — scroll up and down to explore`}
        tabIndex={0}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-black"
        style={{ cursor: 'ns-resize' }}
      />
    </div>
  )
}
