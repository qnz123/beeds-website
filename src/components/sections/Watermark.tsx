'use client'

import { Bodoni_Moda, Reenie_Beanie } from 'next/font/google'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import CassetteMark from '@/components/CassetteMark'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'
import { handOver, handoverMs, isPlainClick } from '@/lib/handover'
import { mountWater, type Water } from '@/lib/water'

// Drawn into the water on canvas, so they are only ever used by family name (see mountWater).
// Bodoni Moda with its optical-size axis, as in the study: at this size it picks the display cut.
const bodoni = Bodoni_Moda({ subsets: ['latin'], axes: ['opsz'], display: 'swap' })
const reenie = Reenie_Beanie({ subsets: ['latin'], weight: '400', display: 'swap' })

// /watermark/ and /ja/watermark/: the underwater landing page, and the way into the site. Entering
// at / or /ja/, a visitor is shown this page at that same address (middleware.ts), and ENTER THE
// ROOM loads the address again, now the homepage. The BEEDS wordmark and the cassette mark lie
// under live water, a carved stone on the wordmark, and the ways into the site at the bottom.
// The cassette sits where the site's bar has it, under the water here and not a link. Leaving,
// the page fades to the ground while a sharp copy of the cassette surfaces over the water one,
// then the site opens with the same cassette in its bar (lib/handover.ts). Arriving from the site's
// cassette, the page fades up with the sharp copy held, then it sinks back under the water.
export default function Watermark({ lang = 'en' }: { lang?: Locale }) {
  const t = getDictionary(lang).watermark
  const home = lang === 'ja' ? '/ja/' : '/'
  const booking = lang === 'ja' ? '/ja/booking/' : '/booking/'
  const waterRef = useRef<HTMLDivElement>(null)
  const markRef = useRef<HTMLDivElement>(null)
  const water = useRef<Water | null>(null)
  const [leaving, setLeaving] = useState(false)
  // arriving from the site's cassette: the sharp copy holds until the page has faded up and the
  // water has the cassette drawn into it, then sinks (html.arrive in globals.css)
  const [settled, setSettled] = useState(false)
  const router = useRouter()
  // The page a button opens has stylesheets this one doesn't load; they are warmed on intent, and
  // on the click at the latest, so the fade isn't left waiting on them (Firefox shows white). Shown
  // at the homepage's own address, the router counts the homepage as already loaded and fetches
  // nothing, so that address is warmed under a query instead: the stylesheets are the same.
  const prefetch = (href: string) => router.prefetch(href === window.location.pathname ? href + '?enter' : href)
  const warm = (href: string) => ({ onMouseEnter: () => prefetch(href), onFocus: () => prefetch(href), onTouchStart: () => prefetch(href) })

  useEffect(() => {
    // Entering the site at a part of the homepage (a shared /#contact), the intro (middleware.ts)
    // stood in its place with the #part kept: take them on to it. Shown at the homepage's own
    // address, a jump to home#part would only scroll this page, so this entry is first renamed to
    // the page's own path, and the jump becomes a real load of the homepage, which replaces it.
    if (window.location.hash) {
      const to = home + window.location.hash
      window.history.replaceState(null, '', lang === 'ja' ? '/ja/watermark/' : '/watermark/')
      window.location.replace(to)
      return
    }
    // no Navigation here to set it (the root layout says en)
    document.documentElement.lang = lang
    const host = waterRef.current
    if (!host) return
    const w = mountWater(host, {
      ground: '#f5f5f5',
      fit: 0.66,
      rainSeconds: 7,
      carve: ['the sky people..', 'do you hear us?'],
      fonts: { mark: bodoni.style.fontFamily, carve: reenie.style.fontFamily },
      // the sharp copy is invisible at rest; the water draws it where it stands
      under: markRef.current?.querySelector('svg') ?? undefined,
      // the water reaches almost to the top of the screen, so the cassette is under it
      edge: { top: 0.015 },
    })
    water.current = w
    let alive = true
    if (document.documentElement.classList.contains('arrive')) {
      const faded = new Promise((r) => window.setTimeout(r, handoverMs() + 50))
      const giveUp = new Promise((r) => window.setTimeout(r, 2500))   // never leave it up for good
      Promise.race([Promise.all([w.ready, faded]), giveUp]).then(() => { if (alive) setSettled(true) })
    }
    return () => { alive = false; w.destroy(); water.current = null }
  }, [home, lang])

  // Back from the site: the browser may restore this page as it was left, faded out. Bring it back.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) setLeaving(false) }
    window.addEventListener('pageshow', onShow)
    return () => window.removeEventListener('pageshow', onShow)
  }, [])

  // Any link: a stone drops where it was pressed, the page fades to the ground, then it goes.
  const leave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isPlainClick(e)) return
    e.preventDefault()
    const a = e.currentTarget
    // from the keyboard there is no pointer, so the stone lands on the link itself
    const r = a.getBoundingClientRect()
    const x = e.detail ? e.clientX : r.left + r.width / 2
    const y = e.detail ? e.clientY : r.top + r.height / 2
    water.current?.drop(x, y)
    setLeaving(true)
    prefetch(new URL(a.href).pathname)
    handOver(a.href)
  }

  // Plain <a>s, not next/link: leaving is a full page load, so the next page runs its head script
  // and arrives from the ground.
  /* eslint-disable @next/next/no-html-link-for-pages */
  return (
    <div className={`wm${leaving ? ' is-leaving' : ''}${settled ? ' is-settled' : ''}`}>
      <main className="wm-stage">
        <h1 className="sr-only">{t.heading}</h1>
        <div ref={waterRef} className="wm-water" role="img" aria-label={t.water} />
        <div ref={markRef} className="wm-mark" aria-hidden="true">
          <CassetteMark />
        </div>
        <div className="wm-bottom">
          <p className="wm-pitch" lang={lang}>
            {t.pitch}{' '}
            {/* the cities set apart by a bar */}
            <span>{t.cities[0]} <span aria-hidden="true">|</span> {t.cities[1]}{t.citiesEnd}</span>{' '}
            <span className="wm-copy">© {new Date().getFullYear()} BEEDS</span>
          </p>
          <div className="wm-acts">
            <a className="wm-btn wm-btn-primary" href={home} {...warm(home)} onClick={leave}>
              {t.enter}
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </a>
            <a className="wm-btn" href={booking} {...warm(booking)} onClick={leave}>{t.book}</a>
          </div>
        </div>
      </main>
      <div className="wm-veil" aria-hidden="true" />
    </div>
  )
  /* eslint-enable @next/next/no-html-link-for-pages */
}
