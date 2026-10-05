'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import type { Locale } from '@/i18n/config'

// Phones only (max-width 767px): the three studies as an index that fits one
// screen, each row the study's name, tag and descriptor beside a small still of
// its opening screen. A tap pulls the row down to show that study live, and the
// reader scrolls it with their own finger. Nothing plays by itself (client
// direction 2026-10-01: the cards used to auto-scroll the embedded page once
// they reached mid-screen).
//
// One row is open at a time. Each open row holds a live study page (GSAP,
// Lenis, its own images), so keeping a single one alive keeps the phone light,
// and closing a row unloads its page. The iframe is only created when its row
// opens.
//
// The pull-down is transform-only: the panel takes its full height in one
// layout, then its contents slide down out from under the row header while the
// rows below slide down with them in lockstep, so the edge reads as one blind
// being drawn. No height animation, no scroll listener.
//
// The thumbnails are stills of each study's phone hero (390x844 at 2x, cropped
// 3:4, 252x336 webp, 3-7 KB each) in /public/studies/thumbs. They are
// screenshots, so regenerate them if a study's hero changes.

export type Slug = 'meridian' | 'aura' | 'volt'

type Row = {
  slug: Slug
  name: string
  accent: string
  copy: { descriptor: string[]; tag: string }
}

const STUDY_W = 390 // the studies' phone layout, as the cards embed it
const OPEN_MS = 460
const CLOSE_MS = 340
const EASE = 'cubic-bezier(0.22, 0.61, 0.36, 1)'

const COPY = {
  en: {
    close: 'Close',
    review: 'Full review',
    frame: 'mobile preview',
  },
  // 日本語（下書き：ネイティブ確認待ち / DRAFT — pending native review）
  ja: {
    close: '閉じる',
    review: 'フルレビュー',
    frame: 'モバイルプレビュー',
  },
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The nav is sticky, so "the top of the screen" for a row header is just below it.
const navBottom = () => {
  const nav = document.querySelector('.nav') as HTMLElement | null
  return nav ? nav.getBoundingClientRect().bottom : 64
}

// 'instant' matters: html { scroll-behavior: smooth } would otherwise turn a
// correction meant to be invisible into a visible glide.
const scrollByInstant = (dy: number) => {
  if (Math.abs(dy) >= 1) window.scrollTo({ top: window.scrollY + dy, behavior: 'instant' })
}

// Scroll anchoring would try to "help" while a row above the reader collapses,
// and fight the correction we make ourselves. Off for the length of the change.
const holdAnchoring = () => {
  const html = document.documentElement
  html.style.overflowAnchor = 'none'
  requestAnimationFrame(() => requestAnimationFrame(() => {
    html.style.overflowAnchor = ''
  }))
}

// The embed is a scroll-only teaser, as on the cards and in the review canvas:
// the reader moves through the design but cannot click into it (its links
// would navigate the frame, "← All studies" included), long-press it or tab
// into it. Same origin, so we can reach in once it has loaded.
function guardEmbed(iframe: HTMLIFrameElement) {
  try {
    const win = iframe.contentWindow
    const doc = iframe.contentDocument
    if (!win || !doc) return
    const stop = (e: Event) => {
      e.preventDefault()
      e.stopPropagation()
    }
    win.addEventListener('click', stop, true)
    win.addEventListener('contextmenu', stop, true)
    win.addEventListener('dragstart', stop, true)
    doc
      .querySelectorAll('a[href], button, input, select, textarea, [tabindex]')
      .forEach((el) => el.setAttribute('tabindex', '-1'))
    const style = doc.createElement('style')
    style.textContent =
      'html{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}'
    doc.head.appendChild(style)
  } catch {
    /* not reachable: the frame simply stays as it is */
  }
}

// The scroll guide is shown until the visitor has scrolled ONE sample; after
// that it stays away from the others for the rest of the visit in this tab.
const GUIDE_KEY = 'beeds:scrollGuide'
let guideDone = false
const isGuideDone = () => {
  if (guideDone) return true
  try {
    guideDone = window.sessionStorage.getItem(GUIDE_KEY) === 'done'
  } catch {
    /* storage denied: this page visit still remembers it */
  }
  return guideDone
}
const markGuideDone = () => {
  guideDone = true
  try {
    window.sessionStorage.setItem(GUIDE_KEY, 'done')
  } catch {
    /* storage denied: this page visit still remembers it */
  }
}

// The live study inside an open row: the 390px phone layout scaled to the
// window's width, its logical height sized to the window so the page's own
// 100vh hero fits. Scrolling is the browser's own (scrolling enabled,
// pointer events on), so it tracks the finger with real momentum, and at
// either end the swipe carries on into the page.
function StudyWindow({ row, title }: { row: Row; title: string }) {
  const winRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ scale: 1, h: 844 })
  const [loaded, setLoaded] = useState(false)
  // A small up-and-down guide sits on the sample until it has been scrolled a
  // little (his ask, 2026-10-05; it replaced the "scroll inside the frame" line).
  // A row opened only after another sample was scrolled never shows it.
  const [scrolled, setScrolled] = useState(() => typeof window !== 'undefined' && isGuideDone())

  useEffect(() => {
    const el = winRef.current
    if (!el) return
    const compute = () => {
      const scale = el.clientWidth / STUDY_W
      if (scale > 0) setDims({ scale, h: el.clientHeight / scale })
    }
    compute()
    const ro = new ResizeObserver(compute)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={winRef} className="si-window">
      {/* The cards' static poster, held underneath until the page has painted. */}
      <div className="si-poster" aria-hidden="true">
        <span>{row.name}</span>
        <i style={{ backgroundColor: row.accent }} />
      </div>
      <iframe
        src={`/studies/${row.slug}.html`}
        title={title}
        tabIndex={-1}
        onLoad={(e) => {
          guardEmbed(e.currentTarget)
          setLoaded(true)
          try {
            const win = e.currentTarget.contentWindow
            if (!win) return
            const onScroll = () => {
              if (win.scrollY > 24) {
                markGuideDone()
                setScrolled(true)
                win.removeEventListener('scroll', onScroll)
              }
            }
            win.addEventListener('scroll', onScroll, { passive: true })
          } catch {
            /* not reachable: the guide simply stays */
          }
        }}
        className={loaded ? 'is-loaded' : undefined}
        style={{
          width: STUDY_W,
          height: dims.h,
          transform: `scale(${dims.scale})`,
        }}
      />
      <span className={`si-cue${loaded && !scrolled ? ' is-shown' : ''}`} aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4" />
        </svg>
      </span>
    </div>
  )
}

export default function StudyIndex({
  rows,
  lang,
  granted,
  onReview,
}: {
  rows: Row[]
  lang: Locale
  granted: boolean
  onReview: (slug: Slug) => void
}) {
  const t = COPY[lang] ?? COPY.en
  const [open, setOpen] = useState<Slug | null>(null)
  const openRef = useRef<Slug | null>(null)
  openRef.current = open

  const listRef = useRef<HTMLUListElement>(null)
  const items = useRef<Partial<Record<Slug, HTMLLIElement | null>>>({})
  const heads = useRef<Partial<Record<Slug, HTMLButtonElement | null>>>({})
  const panels = useRef<Partial<Record<Slug, HTMLDivElement | null>>>({})
  const inners = useRef<Partial<Record<Slug, HTMLDivElement | null>>>({})
  // The move in flight, with what must happen when it ends (or is cut short).
  const running = useRef<{ anims: Animation[]; done: () => void } | null>(null)
  // Set by toggle(), consumed after React has committed the newly opened panel.
  const pending = useRef<{ slug: Slug; anchorTop: number | null } | null>(null)

  // Everything that sits below a row and so has to travel with its edge: the
  // rows after it, then whatever follows the list in this section (the deck
  // access CTA). Nothing outside the section is touched.
  const followers = (slug: Slug) => {
    const out: HTMLElement[] = []
    let n = items.current[slug]?.nextElementSibling as HTMLElement | null
    while (n) {
      out.push(n)
      n = n.nextElementSibling as HTMLElement | null
    }
    n = listRef.current?.nextElementSibling as HTMLElement | null
    while (n) {
      out.push(n)
      n = n.nextElementSibling as HTMLElement | null
    }
    return out
  }

  // A second tap mid-move lands the first move on its end state, then acts.
  // Done by hand rather than with finish(): its finish event arrives a task
  // later, after the second tap has already changed which row is open.
  const settle = () => {
    const move = running.current
    if (!move) return
    running.current = null
    move.anims.forEach((a) => a.cancel())
    move.done()
  }

  const start = (anims: Animation[], done: () => void) => {
    const move = { anims, done }
    running.current = move
    anims[0].onfinish = () => {
      if (running.current !== move) return
      running.current = null
      // done() first, then drop the transforms, all in one task: the rows below
      // are already drawn where the new layout puts them, so nothing moves.
      done()
      anims.forEach((a) => a.cancel())
    }
  }

  const slide = (els: HTMLElement[], from: number, to: number, ms: number) =>
    els.map((el) =>
      el.animate(
        [{ transform: `translateY(${from}px)` }, { transform: `translateY(${to}px)` }],
        { duration: ms, easing: EASE, fill: 'forwards' },
      ),
    )

  // Bring an opened row's header up under the nav, so the header, the study
  // window and the Close row share one screen. Only when it isn't already there.
  const bringUp = (slug: Slug) => {
    const head = heads.current[slug]
    if (!head) return
    const top = navBottom() + 8
    const dy = head.getBoundingClientRect().top - top
    if (Math.abs(dy) < 4) return
    window.scrollTo({
      top: window.scrollY + dy,
      behavior: reducedMotion() ? 'instant' : 'smooth',
    })
  }

  // Closing a row hands the reader back to the index: if the list's top has
  // gone up under the nav, the page returns so all three rows are on screen
  // again. The list's top sits above every panel, so the collapse can't move it
  // and the target is known before the collapse runs.
  const backToIndex = (behavior: ScrollBehavior) => {
    const list = listRef.current
    if (!list) return
    const dy = list.getBoundingClientRect().top - (navBottom() + 16)
    if (dy < 0) window.scrollTo({ top: window.scrollY + dy, behavior })
  }

  const close = (slug: Slug) => {
    const panel = panels.current[slug]
    const inner = inners.current[slug]
    const head = heads.current[slug]
    if (!panel || !inner || !head) return
    // Reader is deep in the panel with its header off the top: a blind drawn up
    // out of sight would just look like the page jumping, so close at once.
    if (reducedMotion() || head.getBoundingClientRect().top < navBottom()) {
      holdAnchoring()
      flushSync(() => setOpen(null))
      backToIndex('instant')
      return
    }
    const h = panel.offsetHeight
    start([...slide([inner], 0, -h, CLOSE_MS), ...slide(followers(slug), 0, -h, CLOSE_MS)], () => {
      holdAnchoring()
      flushSync(() => setOpen(null))
    })
    backToIndex('smooth')
  }

  const toggle = (slug: Slug) => {
    settle()
    const current = openRef.current
    if (current === slug) {
      close(slug)
      return
    }
    // Opening a row while another is open: the other closes at once, and if it
    // sat above, the page is corrected so the tapped row stays under the finger.
    pending.current = {
      slug,
      anchorTop: current ? heads.current[slug]?.getBoundingClientRect().top ?? null : null,
    }
    if (current) holdAnchoring()
    setOpen(slug)
  }

  useLayoutEffect(() => {
    const p = pending.current
    if (!p || p.slug !== open) return
    pending.current = null
    const head = heads.current[p.slug]
    const panel = panels.current[p.slug]
    const inner = inners.current[p.slug]
    if (!head || !panel || !inner) return
    if (p.anchorTop !== null) scrollByInstant(head.getBoundingClientRect().top - p.anchorTop)
    if (!reducedMotion()) {
      const h = panel.offsetHeight
      start([...slide([inner], -h, 0, OPEN_MS), ...slide(followers(p.slug), -h, 0, OPEN_MS)], () => {})
    }
    bringUp(p.slug)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Leaving the phone layout (or the page) mid-move: drop any transforms.
  useEffect(() => () => running.current?.anims.forEach((a) => a.cancel()), [])

  // QA hook: ?study=aura opens that row on load (for stills and checks).
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('study')
    if (q && rows.some((r) => r.slug === q)) {
      pending.current = { slug: q as Slug, anchorTop: null }
      setOpen(q as Slug)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ul ref={listRef} className="study-index" role="list" lang={lang}>
      {rows.map((row) => {
        const isOpen = open === row.slug
        const btnId = `si-btn-${row.slug}`
        const panelId = `si-panel-${row.slug}`
        return (
          <li
            key={row.slug}
            ref={(el) => {
              items.current[row.slug] = el
            }}
            className="si-item"
          >
            <h3 className="si-heading">
              <button
                ref={(el) => {
                  heads.current[row.slug] = el
                }}
                id={btnId}
                type="button"
                className="si-toggle"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(row.slug)}
              >
                {/* Decorative: the row's name is the text beside it. A 3-7 KB
                    still already at its display size, so next/image adds nothing. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="si-thumb"
                  src={`/studies/thumbs/${row.slug}.webp`}
                  alt=""
                  width={84}
                  height={112}
                  decoding="async"
                />
                <span className="si-text">
                  <span className="si-name">{row.name}</span>
                  <span className="si-tag">{row.copy.tag}</span>
                  <span className="si-desc">
                    {row.copy.descriptor.map((line, i) => (
                      <span key={line}>
                        {i > 0 && <br />}
                        {line}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="si-sign" aria-hidden="true" />
              </button>
            </h3>
            <div
              ref={(el) => {
                panels.current[row.slug] = el
              }}
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className="si-panel"
              hidden={!isOpen}
            >
              {isOpen && (
                <div
                  ref={(el) => {
                    inners.current[row.slug] = el
                  }}
                  className="si-inner"
                >
                  <StudyWindow row={row} title={`${row.name} — ${t.frame}`} />
                  <div className="si-actions">
                    <span className="si-buttons">
                      {granted && (
                        <button type="button" className="si-btn" onClick={() => onReview(row.slug)}>
                          {t.review}
                        </button>
                      )}
                      <button
                        type="button"
                        className="si-btn"
                        onClick={() => {
                          toggle(row.slug)
                          heads.current[row.slug]?.focus({ preventScroll: true })
                        }}
                      >
                        {t.close}
                      </button>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
