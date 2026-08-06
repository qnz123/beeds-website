'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

// Locale-aware nav. `lang` picks the copy; `switchHref` is the counterpart URL
// for the language toggle (the other-language version of the current page).
// Defaults keep the existing English pages working unchanged.
export default function Navigation({
  lang = 'en',
  switchHref = '/ja',
}: {
  lang?: Locale
  switchHref?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const t = getDictionary(lang).nav
  const isJa = lang === 'ja'
  const home = isJa ? '/ja' : '/'

  const navLinks = [
    { label: t.work, href: isJa ? '/ja/#work' : '/#work' },
    { label: t.about, href: isJa ? '/ja/about' : '/about' },
    { label: t.services, href: isJa ? '/ja/about#services' : '/about#services' },
    // Explore is English-only for now; both locales point to /explore until the
    // /ja/explore mirror ships (kept in English on the JA nav by client direction).
    { label: 'Explore', href: '/explore' },
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

  // Keep the document language in sync with the page locale. The root layout
  // renders a single <html lang> for all routes, so on the client we correct it
  // to the actual locale (screen readers announce JA content with a JA engine).
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  return (
    <nav className="nav sticky top-0 z-50">
      <div>
        <Link href={home}>BEEDS</Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-10 items-center">
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
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-base"
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-light border-b border-black px-10 py-4 flex flex-col gap-4 md:hidden">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
              {link.label}
            </Link>
          ))}
          <a
            href={switchHref}
            className="text-[#666]"
            onClick={() => {
              rememberChoice()
              setIsOpen(false)
            }}
          >
            {toggleLabel}
          </a>
        </div>
      )}
    </nav>
  )
}
