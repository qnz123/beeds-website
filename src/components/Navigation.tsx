'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
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
  // The bar's bottom edge is absent until the page has scrolled past the
  // bar's own height, so the nav reads as part of the hero until content
  // genuinely passes behind it.
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const t = getDictionary(lang).nav
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
    // The edge and the frosted ground wait until the page has scrolled past
    // the bar's own bottom. Before that the content sliding up is still the
    // strip the bar was sitting on, and nothing has really gone behind it;
    // from that point on it has, and the bar needs its own ground to stay
    // legible. Height is read from the element, so it holds at any breakpoint.
    let depth = navRef.current?.offsetHeight ?? 64
    const onScroll = () => setScrolled(window.scrollY > depth)
    const remeasure = () => {
      depth = navRef.current?.offsetHeight ?? 64
      onScroll()
    }
    onScroll()                                    // a page restored mid-scroll starts with its edge
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', remeasure)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', remeasure)
    }
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
    <nav ref={navRef} className={`nav sticky top-0 z-50${scrolled ? ' is-scrolled' : ''}`}>
      {/* The wordmark stays in the house serif; only the link row goes sans. */}
      <div className="nav-wordmark">
        <Link href={home}>BEEDS</Link>
      </div>

      {/* Desktop Navigation */}
      <div className="nav-links hidden md:flex gap-10 items-center">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href}>
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

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden text-base"
        aria-label="Open menu"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        ☰
      </button>

    </nav>

    {/* Mobile menu: a full-screen sheet, not a dropdown. It sits above the nav so the
        nav's own bottom rule is covered, and it draws no horizontal rules itself. */}
    {isOpen && (
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="fixed inset-0 z-[60] bg-light md:hidden flex flex-col"
      >
        <div className="flex items-center justify-between px-10 py-5">
          <Link href={home} onClick={() => setIsOpen(false)} className="text-xs uppercase tracking-[1px]">
            BEEDS
          </Link>
          <button onClick={() => setIsOpen(false)} className="text-base" aria-label="Close menu">
            ✕
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-7 px-10 pb-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-[34px] leading-none"
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
