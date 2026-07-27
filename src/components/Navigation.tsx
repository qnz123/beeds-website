'use client'

import Link from 'next/link'
import { useState } from 'react'
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
        <Link
          href={switchHref}
          className="text-[#666]"
          aria-label={`Switch language to ${toggleLabel}`}
          onClick={rememberChoice}
        >
          {toggleLabel}
        </Link>
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
          <Link
            href={switchHref}
            className="text-[#666]"
            onClick={() => {
              rememberChoice()
              setIsOpen(false)
            }}
          >
            {toggleLabel}
          </Link>
        </div>
      )}
    </nav>
  )
}
