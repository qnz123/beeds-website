'use client'

import Link from 'next/link'
import { useState } from 'react'

const navLinks: { label: string; href: string; scroll?: boolean }[] = [
  { label: 'Work', href: '/#work' },
  { label: 'About', href: '/about' },
  // scroll:false — SmoothHashScroll on /about lands at the top and glides down
  // to Our Services instead of Next jumping straight to the anchor.
  { label: 'Services', href: '/about#services', scroll: false },
  { label: 'Contact', href: '/#contact' },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="nav sticky top-0 z-50">
      <div>
        <Link href="/">BEEDS</Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-10">
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} scroll={link.scroll}>
            {link.label}
          </Link>
        ))}
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
            <Link
              key={link.href}
              href={link.href}
              scroll={link.scroll}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
