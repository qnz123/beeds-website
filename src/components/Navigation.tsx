'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

// Locale-aware nav. `lang` picks the copy; `switchHref` is the counterpart URL
// for the language toggle (the other-language version of the current page).
// Defaults keep the existing English pages working unchanged.
export default function Navigation({
  lang = 'en',
  // Trailing slash on purpose: next.config sets trailingSlash, so '/ja' would
  // cost every visitor who uses the toggle a 308 hop before the page loads.
  switchHref = '/ja/',
}: {
  lang?: Locale
  switchHref?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  // The sheet stays mounted for its short fade-out after closing (see .mm-sheet.is-out).
  const [sheetUp, setSheetUp] = useState(false)
  useEffect(() => {
    if (isOpen) { setSheetUp(true); return }
    const t = window.setTimeout(() => setSheetUp(false), 200)
    return () => window.clearTimeout(t)
  }, [isOpen])
  // The bar's bottom edge is absent at the top of the page and fades in once
  // the page has moved, so the nav reads as part of the hero until it starts
  // to overlap content.
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const t = getDictionary(lang).nav
  const router = useRouter()
  // /explore/'s prefetch carries preload hints for the Showcase's nine webfonts
  // (~265 KB), so a viewport prefetch from the desktop bar made every page
  // download them. That one link prefetches on intent (hover, focus, touch)
  // instead.
  // The mobile sheet keeps its normal prefetch: opening it is already intent.
  const prefetchOnIntent = (href: string) =>
    href.endsWith('/explore')
      ? {
          prefetch: false as const,
          onMouseEnter: () => router.prefetch(href),
          onFocus: () => router.prefetch(href),
          onTouchStart: () => router.prefetch(href), // tablets ≥768px get this bar
        }
      : {}
  const isJa = lang === 'ja'
  const home = isJa ? '/ja' : '/'

  const navLinks = [
    { label: t.work, href: isJa ? '/ja/#work' : '/#work' },
    { label: t.about, href: isJa ? '/ja/about' : '/about' },
    { label: t.services, href: isJa ? '/ja/about#services' : '/about#services' },
    // Explore label stays in English on both locales (client direction).
    { label: 'Explore', href: isJa ? '/ja/explore' : '/explore' },
    { label: t.contact, href: isJa ? '/ja/#contact' : '/#contact' },
  ]

  // ...and once this page has finished loading and the browser is idle, fetch /explore/ (and its
  // fonts) quietly anyway, so a quick click on Explore finds them cached instead of showing a
  // fallback face. Off the first load, so it costs the page nothing; skipped on Save-Data / 2G.
  const exploreHref = isJa ? '/ja/explore' : '/explore'
  useEffect(() => {
    const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
    if (c?.saveData || /2g/.test(c?.effectiveType ?? '')) return
    let timer = 0, idle = 0
    const fetchIt = () => {
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(() => router.prefetch(exploreHref), { timeout: 4000 })
      else router.prefetch(exploreHref) // Safari has no requestIdleCallback
    }
    const afterLoad = () => { timer = window.setTimeout(fetchIt, 2500) }
    if (document.readyState === 'complete') afterLoad()
    else window.addEventListener('load', afterLoad, { once: true })
    return () => {
      window.removeEventListener('load', afterLoad)
      window.clearTimeout(timer)
      if (idle && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle)
    }
  }, [router, exploreHref])

  // Toggle shows the OTHER language's name and links to its URL.
  const toggleLabel = isJa ? 'English' : '日本語'
  const targetLocale = isJa ? 'en' : 'ja'

  // Persist the manual choice so the detection middleware respects it and
  // doesn't redirect the visitor back on their next visit to the root.
  const rememberChoice = () => {
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; samesite=lax`
  }

  // Publish the bar's own height, so the hero can reach up underneath it and
  // let the rain fill the strip behind a now-transparent nav.
  useEffect(() => {
    const publish = () => {
      const h = navRef.current?.offsetHeight
      if (h) document.documentElement.style.setProperty('--nav-h', `${h}px`)
    }
    publish()
    window.addEventListener('resize', publish)
    return () => window.removeEventListener('resize', publish)
  }, [])

  useEffect(() => {
    // The edge and the frosted ground come in as soon as the page moves,
    // which is the behaviour this was specified with. The delayed thresholds
    // tried on 2026-09-24 (one bar-height, then two) are gone.
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()                                    // a page restored mid-scroll starts with its edge
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Keep the document language in sync with the page locale. The root layout
  // renders a single <html lang> for all routes, so on the client we correct it
  // to the actual locale (screen readers announce JA content with a JA engine).
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // While the full-screen menu is up, the page behind it must not scroll, and
  // Escape should close it the way any dialog does.
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    document.addEventListener('keydown', onKey)
    // The sheet is hidden by a `md:hidden` utility, so growing the viewport
    // past the breakpoint used to take it off screen while this lock stayed
    // on — a scroll-locked page with no visible way to close it. Close it
    // with the breakpoint instead.
    const wide = window.matchMedia('(min-width: 768px)')
    const closeIfWide = () => { if (wide.matches) setIsOpen(false) }
    closeIfWide()
    wide.addEventListener('change', closeIfWide)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
      wide.removeEventListener('change', closeIfWide)
    }
  }, [isOpen])

  return (
    <>
    <nav ref={navRef} className={`nav sticky top-0 z-50${scrolled ? ' is-scrolled' : ''}${isOpen ? ' menu-open' : sheetUp ? ' menu-closing' : ''}`}>
      {/* The wordmark stays in the house serif; only the link row goes sans. */}
      <div className="nav-wordmark">
        <Link href={home} onClick={() => setIsOpen(false)}>BEEDS</Link>
      </div>

      {/* Desktop Navigation */}
      <div className="nav-links hidden md:flex gap-10 items-center">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} {...prefetchOnIntent(link.href)}>
            {link.label}
          </Link>
        ))}
        {/* Plain <a>, NOT next/link: a Link would prefetch switchHref, and the
            middleware redirects a prefetched "/" to "/ja" and caches it, so the
            JA→EN toggle would bounce back to Japanese. A full navigation sets the
            cookie first, then re-runs middleware with it. */}
        <a
          href={switchHref}
          className="text-[#666]"
          aria-label={`Switch language to ${toggleLabel}`}
          onClick={rememberChoice}
        >
          {toggleLabel}
        </a>
      </div>

      {/* Mobile menu toggle: two long lines that fold into an X. It stays in the bar, which
          sits above the open sheet, so the wordmark and the toggle never move. */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`nav-burger nav-tap md:hidden${isOpen ? ' is-open' : ''}`}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

    </nav>

    {/* Mobile menu: a full-screen sheet, not a dropdown. The bar itself stays on top of it
        (.nav.menu-open), with its edge and frosted ground switched off, so the one wordmark and
        the toggle keep their exact place; the sheet draws no header or rules of its own. */}
    {(isOpen || sheetUp) && (
      <div
        id="mobile-menu"
        aria-label="Menu"
        className={`mm-sheet fixed inset-0 z-[60] md:hidden flex flex-col${isOpen ? '' : ' is-out'}`}
      >
        <div aria-hidden="true" style={{ height: 'var(--nav-h, 64px)', flex: 'none' }} />

        <div className="flex-1 flex flex-col justify-center gap-7 px-10 pb-10">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="mm-item text-[34px] leading-none"
              style={{ '--i': i } as React.CSSProperties}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* The language switch is a utility, not a sixth destination, so it sits
            apart from the list rather than reading as one more link. */}
        <div className="px-10 pb-12">
          <a
            href={switchHref}
            className="text-xs uppercase tracking-[2px] text-[#666]"
            onClick={() => {
              rememberChoice()
              setIsOpen(false)
            }}
          >
            {toggleLabel}
          </a>
        </div>
      </div>
    )}
    </>
  )
}
