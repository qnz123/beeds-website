'use client'

import { useEffect, useRef, useState } from 'react'
import ReviewCanvas, { type ReviewMode } from './ReviewCanvas'
import DeviceToggle from './DeviceToggle'

// Lightbox that opens a study in the larger scroll-only review canvas, in the
// same page. Standard dialog behaviour: Escape and backdrop click close it,
// focus is moved in on open and restored on close, focus is trapped inside, and
// the background page is scroll-locked while it's open.
//
// Device switch: a Desktop/Mobile segmented control swaps ReviewCanvas's mode.
// A toggle (rather than side-by-side) was chosen so each rendering gets the
// canvas's full width — a phone silhouette squeezed next to a 1280px desktop
// view inside a ~1100px lightbox would read cramped on both sides. ReviewCanvas
// remounts on mode change (key={mode}) so each embed starts fresh at the top.
export default function StudyLightbox({
  slug,
  name,
  onClose,
}: {
  slug: string
  name: string
  onClose: () => void
}) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [mode, setMode] = useState<ReviewMode>('desktop')

  useEffect(() => {
    const returnFocus = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      // Trap focus within the panel.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      )
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = prevOverflow
      returnFocus?.focus?.()
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 md:p-8"
      onMouseDown={(e) => {
        // Backdrop click (not a click inside the panel) closes.
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${name} — design review`}
        className="flex w-full flex-col bg-[#f5f5f5] border border-black"
        style={{ maxWidth: 'min(1100px, 94vw)' }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black px-5 py-3">
          <span className="eyebrow text-[#666]">{name} — Review</span>

          <div className="flex items-center gap-4">
            {/* Desktop / Mobile rounded pill switch. */}
            <DeviceToggle mode={mode} onChange={setMode} />

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close review"
              className="text-[13px] uppercase tracking-[1.5px] underline underline-offset-4 hover:opacity-55"
            >
              Close ✕
            </button>
          </div>
        </div>

        <div className="p-3 md:p-4">
          <ReviewCanvas key={mode} slug={slug} name={name} mode={mode} />
          <p className="mt-3 text-sm text-[#666]">
            {mode === 'mobile'
              ? 'Scroll up and down to review the mobile layout.'
              : 'Scroll up and down to review the design.'}
          </p>
        </div>
      </div>
    </div>
  )
}
