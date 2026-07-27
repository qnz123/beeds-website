'use client'

// Our Services — folio tabs (client-directed 2026-07-09, replacing the
// accordion rows and the separate Mini Folio strip). The section now speaks
// the Featured Work language directly: the four folio frames (shared data in
// folioData.tsx) render as SMALL TAB-PLATES — compact brand-color fields with
// the instrument watermark, specimen numeral and category — and clicking a
// tab shows that discipline's title + blurb in the panel beneath. One active
// tab at a time; proper tab semantics; reduced motion skips the crossfade.

import { Fragment, useState } from 'react'
import { getFrames } from './folioData'
import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

// Phrases that wear the yellow brush highlight inside the service panel copy —
// per locale. The Japanese phrases mirror the English ones in meaning: the
// "practical skills" payoff (AI) and the deliverables list (Production). Each
// must be an exact substring of the corresponding paragraph in folioData.
const HIGHLIGHT_PHRASES: Record<Locale, string[]> = {
  en: [
    'walk away with practical skills',
    'commercials, APPS, films, AI-powered content, digital platforms, and e-commerce websites',
  ],
  ja: [
    '仕事に活かせる実践力',
    '映像制作、アプリケーション開発、AIコンテンツ、デジタルプラットフォーム、ECサイト構築',
  ],
}

// Wraps any highlighted phrases found in a paragraph with .brush-highlight,
// leaving the rest as plain text. Returns a React node ready to render.
function renderWithHighlights(paragraph: string, phrases: string[]) {
  if (phrases.length === 0) return paragraph
  const pattern = new RegExp(
    `(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`
  )
  return paragraph.split(pattern).map((part, i) =>
    phrases.includes(part) ? (
      <span key={i} className="brush-highlight">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )
}

// Named in the section's right column — editorial sidebar next to the tabs.
const selectedClients = [
  'Condé Nast',
  'Champion Sports',
  'Jellybean',
  'Nestlé',
  'Pee Wee Harris Comics',
  'Shangri-La Hotels and Resorts',
  'Verizon',
  'Victoria Secret',
  'Waste Management',
  'Wise',
]

export default function Services({ lang = 'en' as Locale }: { lang?: Locale }) {
  const [active, setActive] = useState(0)
  const frames = getFrames(lang)
  const frame = frames[active]
  const t = getDictionary(lang).svc

  return (
    <section id="services" className="bg-white py-20 px-10 border-t border-black">
      <div className="container-x">
        <h2 className="eyebrow mb-12">{t.heading}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-x-16 gap-y-14">
          <div>
            <div className="svct-tabs" role="tablist" aria-label="Services">
              {frames.map((f, i) => (
                <button
                  key={f.title}
                  type="button"
                  role="tab"
                  id={`svct-tab-${f.num}`}
                  aria-selected={i === active}
                  aria-controls="svct-panel"
                  tabIndex={i === active ? 0 : -1}
                  className={`svct-tab${i === active ? ' svct-tab--active' : ''}`}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight') setActive((active + 1) % frames.length)
                    if (e.key === 'ArrowLeft') setActive((active + frames.length - 1) % frames.length)
                  }}
                >
                  <span className={`fw-field fw-field--${f.field}`} aria-hidden="true" />
                  <span className="fw-mark svct-mark" aria-hidden="true">
                    {f.mark}
                  </span>
                  <span className="svct-num" aria-hidden="true">
                    {f.num}
                  </span>
                  <span className="svct-cat">{f.category}</span>
                </button>
              ))}
            </div>

            <div
              id="svct-panel"
              role="tabpanel"
              aria-labelledby={`svct-tab-${frame.num}`}
              className="svct-panel"
              key={frame.num}
            >
              <div className="eyebrow text-[#666] mb-3">{frame.category}</div>
              <h3 className="text-2xl mb-4">{frame.title}</h3>
              {(frame.about ?? [frame.blurb]).map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-sm leading-[1.8] text-[#666] max-w-[600px] mb-4 last:mb-0"
                >
                  {renderWithHighlights(paragraph, HIGHLIGHT_PHRASES[lang])}
                </p>
              ))}
            </div>
          </div>

          {/* Selected Clients — editorial sidebar in the right column,
              set off by a vertical hairline on desktop. */}
          <aside className="lg:border-l lg:border-black lg:pl-12">
            <h3 className="eyebrow mb-6">{t.clients}</h3>
            <ul className="text-sm leading-[2.2]">
              {selectedClients.map((client) => (
                <li key={client}>{client}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
