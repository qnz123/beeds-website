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
// Two modes share this exact protection:
//  - 'desktop' (default, unchanged): the page is embedded at its real 1280px
//    desktop viewport and scaled down to fill the canvas width.
//  - 'mobile': the page is embedded at a real ~390px logical viewport — below
//    the studies' own ~900px responsive breakpoint — so it renders its actual
//    mobile layout, then scaled/centered inside an editorial phone frame.
// In both cases the iframe's *logical* width (its real layout viewport, via
// inline width + CSS scale) is what the embedded page measures — only the
// number changes.
//
// NOTE: strong, casual-proof protection — not DRM. Dev tools can still inspect
// network traffic; a true lock would need a server-side render/proxy.

export type ReviewMode = 'desktop' | 'mobile'

const BASE_WIDTHS: Record<ReviewMode, number> = { desktop: 1280, mobile: 390 }
// Logical phone height used only to shape the mobile frame's aspect ratio
// (roughly a modern phone's viewport) — the embedded page still scrolls to
// its own full content height regardless of this number.
const MOBILE_FRAME_H = 844
// Breathing room around the phone silhouette inside the mobile canvas.
const MOBILE_FRAME_MARGIN = 24
// On narrow (phone-width) canvases the frame instead hugs the side edges.
const NARROW_MARGIN = 4
const NARROW_MAX = 560

export default function ReviewCanvas({
  slug,
  name,
  autoFocus = false,
  mode = 'desktop',
}: {
  slug: string
  name: string
  autoFocus?: boolean
  mode?: ReviewMode
}) {
  const baseW = BASE_WIDTHS[mode]
  // Measured element: the full clipping box in desktop mode, or the centering
  // wrap (from which we derive the best-fit phone size) in mobile mode.
  const measureRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const targetRef = useRef(0)
  // Live scale for the scroll handlers (bound once, so state would go stale)
  const scaleRef = useRef(0.5)
  const [dims, setDims] = useState({ scale: 0.5, h: 900 })
  const [frame, setFrame] = useState({ w: 0, h: 0 })

  // Keep the embedded page scaled to fill the canvas (desktop: full width; mobile:
  // a best-fit phone silhouette), and size its logical viewport to the visible
  // slice so scroll math is correct.
  useEffect(() => {
    const el = measureRef.current
    if (!el) return
    const compute = () => {
      if (mode === 'mobile') {
        const narrow = el.clientWidth <= NARROW_MAX
        const margin = narrow ? NARROW_MARGIN : MOBILE_FRAME_MARGIN
        const availW = Math.max(0, el.clientWidth - margin * 2)
        const availH = Math.max(0, el.clientHeight - margin * 2)
        const aspect = baseW / MOBILE_FRAME_H
        let w: number
        let h: number
        if (narrow) {
          // Phone screens: fill the width edge-to-edge (client direction);
          // the height takes everything the canvas offers, capped at true
          // phone proportions.
          w = availW
          h = Math.min(availH, w / aspect)
        } else {
          // Wide canvases: best-fit phone silhouette, height-driven.
          w = availH * aspect
          h = availH
          if (w > availW) {
            w = availW
            h = availW / aspect
          }
        }
        setFrame({ w, h })
        const scale = w > 0 ? w / baseW : 0.5
        scaleRef.current = scale
        setDims({ scale, h: scale > 0 ? h / scale : 900 })
      } else {
        const scale = el.clientWidth / baseW
        scaleRef.current = scale
        setDims({ scale, h: el.clientHeight / scale })
      }
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [mode, baseW])

  // Drive the embedded page's internal scroll by a SCREEN-pixel delta, clamped
  // to its range. The delta is converted to the page's logical pixels (÷ scale)
  // so the content tracks the finger/wheel 1:1 visually — without this, a
  // heavily scaled-down embed (e.g. 1280px page in a 350px phone canvas)
  // scrolls at a crawl.
  const scrollByDelta = (delta: number) => {
    const win = iframeRef.current?.contentWindow as
      | (Window & { __lenis?: any })
      | null
    const doc = iframeRef.current?.contentDocument
    if (!win || !doc) return
    // 0.45 damping on top of the 1:1 conversion — a calm, deliberate review
    // pace (client-tuned).
    const logical = (delta * 0.45) / (scaleRef.current || 1)
    const max = Math.max(0, doc.documentElement.scrollHeight - win.innerHeight)
    targetRef.current = Math.min(max, Math.max(0, targetRef.current + logical))
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

  const overlayLabel =
    mode === 'mobile'
      ? `${name} mobile design review — scroll up and down to explore`
      : `${name} design review — scroll up and down to explore`

  const canvasBody = (
    <>
      <iframe
        ref={iframeRef}
        src={`/studies/${slug}.html`}
        title={`${name} — ${mode} design review`}
        aria-hidden="true"
        tabIndex={-1}
        scrolling="no"
        onLoad={() => {
          targetRef.current = 0
        }}
        style={{
          width: baseW,
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
        aria-label={overlayLabel}
        tabIndex={0}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autoFocus}
        onKeyDown={onKeyDown}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="absolute inset-0 outline-none focus-visible:ring-2 focus-visible:ring-black"
        style={{ cursor: 'ns-resize' }}
      />
    </>
  )

  return (
    <div
      className="relative w-full overflow-hidden border border-black bg-white"
      style={{ height: 'min(80vh, 760px)' }}
    >
      {mode === 'mobile' ? (
        <div
          ref={measureRef}
          className="flex h-full w-full items-center justify-center bg-[#e9e9e9]"
        >
          {/* Editorial phone bezel — a hairline-consistent frame, not a
              skeuomorphic device render. */}
          <div
            className="relative overflow-hidden bg-white border-[6px] border-black rounded-[24px]"
            style={{ width: frame.w || undefined, height: frame.h || undefined }}
          >
            {canvasBody}
          </div>
        </div>
      ) : (
        <div ref={measureRef} className="relative h-full w-full">
          {canvasBody}
        </div>
      )}
    </div>
  )
}
