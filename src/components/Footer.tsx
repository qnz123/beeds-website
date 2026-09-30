import React from 'react'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

// Two lines, all in the grey: the copyright, then the cities and the email, the email last. The
// second line's items are set apart by a wide space, no dots. Each item keeps together, so a narrow
// screen wraps between them, never inside one.
export default function Footer({ lang = 'en' }: { lang?: Locale }) {
  const currentYear = new Date().getFullYear()
  const t = getDictionary(lang).footer

  return (
    // No side padding of its own on phones, where container-x's 40px already lines it up with the
    // bar (and leaves the second line room to stay one line).
    <footer className="bg-light py-16 md:px-10 text-xs">
      <div className="container-x">
        <p className="leading-[1.8] text-[#666]">
          <span className="whitespace-nowrap">© {currentYear} BEEDS</span>
          <br />
          {t.places.map((place) => (
            <React.Fragment key={place}>
              <span className="mr-[1em] whitespace-nowrap">{place}</span>{' '}
            </React.Fragment>
          ))}
          <a href="mailto:booking@beedstu.com" className="whitespace-nowrap text-[#666] no-underline hover:underline">
            booking@beedstu.com
          </a>
        </p>
      </div>
    </footer>
  )
}
