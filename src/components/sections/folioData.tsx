// Shared data for the "Folio" Featured Work system (client-approved
// 2026-07-09): the four frames — instrument marks, specimen words, copy —
// used at full size on the homepage (Portfolio.tsx) and in the mini strip
// inside the /about Services section (MiniFolio.tsx).

import type { CSSProperties, ReactNode } from 'react'

export type FrameDatum = {
  num: string
  word: string
  category: string
  title: string
  blurb: string
  /** Optional long-form description for the /about Services tab panel
   *  (paragraphs). The homepage plate always uses the short `blurb`. */
  about?: string[]
  field: 'gold' | 'navy' | 'red' | 'charcoal'
  mark: ReactNode
  /** Per-frame offset of the oversized instrument, from the approved plates. */
  markStyle?: CSSProperties
}

/* Instrument plates — watermark hairlines (stroke set in CSS) with gold
   accents and translucent white fills. Idle motion classes: fw-needle /
   fw-pulse / fw-blades / fw-dash. */

const compassMark = (
  <svg viewBox="0 0 220 220" role="img" aria-label="Compass plate">
    <circle cx="110" cy="110" r="92" />
    <circle cx="110" cy="110" r="64" />
    <line x1="110" y1="6" x2="110" y2="30" />
    <line x1="110" y1="190" x2="110" y2="214" />
    <line x1="6" y1="110" x2="30" y2="110" />
    <line x1="190" y1="110" x2="214" y2="110" />
    <g className="fw-needle">
      <polygon className="fw-goldfill" points="110,110 148,58 122,116" />
      <polygon className="fw-whitefill" points="110,110 72,162 98,104" />
    </g>
    <circle className="fw-whitefill" cx="110" cy="110" r="5" />
  </svg>
)

const networkMark = (
  <svg viewBox="0 0 220 220" role="img" aria-label="Network plate">
    <line x1="40" y1="60" x2="110" y2="40" />
    <line x1="40" y1="60" x2="70" y2="130" />
    <line x1="110" y1="40" x2="70" y2="130" />
    <line x1="110" y1="40" x2="170" y2="70" />
    <line x1="70" y1="130" x2="130" y2="120" />
    <line x1="130" y1="120" x2="170" y2="70" />
    <line x1="70" y1="130" x2="90" y2="185" />
    <line x1="130" y1="120" x2="90" y2="185" />
    <line x1="130" y1="120" x2="180" y2="160" />
    <line x1="170" y1="70" x2="180" y2="160" />
    <line x1="90" y1="185" x2="180" y2="160" />
    <circle className="fw-whitefill" cx="40" cy="60" r="7" />
    <circle className="fw-whitefill" cx="110" cy="40" r="7" />
    <circle className="fw-whitefill" cx="170" cy="70" r="7" />
    <circle className="fw-whitefill" cx="70" cy="130" r="7" />
    <circle className="fw-whitefill" cx="90" cy="185" r="7" />
    <circle className="fw-pulse fw-goldfill" cx="130" cy="120" r="12" />
  </svg>
)

const apertureMark = (
  <svg viewBox="0 0 220 220" role="img" aria-label="Aperture plate">
    <circle cx="110" cy="110" r="92" />
    <circle cx="110" cy="110" r="68" />
    <g className="fw-blades">
      <line x1="110" y1="42" x2="136" y2="84" />
      <line x1="169" y1="76" x2="121" y2="87" />
      <line x1="178" y1="144" x2="133" y2="123" />
      <line x1="110" y1="178" x2="84" y2="136" />
      <line x1="51" y1="144" x2="99" y2="133" />
      <line x1="42" y1="76" x2="87" y2="97" />
    </g>
    <circle className="fw-goldfill" cx="110" cy="110" r="24" />
  </svg>
)

const globeMark = (
  <svg viewBox="0 0 220 220" role="img" aria-label="Globe plate">
    <ellipse cx="110" cy="110" rx="92" ry="92" />
    <ellipse cx="110" cy="110" rx="40" ry="92" />
    <ellipse cx="110" cy="110" rx="92" ry="40" />
    <path className="fw-dash" d="M45 140 Q 110 30 178 84" strokeDasharray="4 6" />
    <circle className="fw-whitefill" cx="45" cy="140" r="6" />
    <circle className="fw-pulse fw-goldfill" cx="178" cy="84" r="7" />
    <circle className="fw-goldstroke" cx="178" cy="84" r="15" />
  </svg>
)

/* Copy is verbatim from the pre-redesign bands (unchanged since the tiles). */

export const frames: FrameDatum[] = [
  {
    num: '01',
    word: 'STRATEGY',
    category: 'Strategy',
    title: 'Creative Strategic Consulting',
    blurb: 'Brand direction, positioning, and creative diagnosis that sharpens how your story lands.',
    about: [
      "Sometimes the biggest challenge isn't making content\u2014it's knowing what story to tell. We help you find the right direction by understanding your business, your audience, and what makes your brand different. Together, we'll shape a strategy that feels authentic and gets people to pay attention.",
    ],
    field: 'gold',
    mark: compassMark,
  },
  {
    num: '02',
    word: 'AI ENABLEMENT',
    category: 'AI Enablement',
    title: 'AI Learning & Workshops',
    blurb: 'Hands-on adoption of AI into your team — built to kick-start results and unlock efficiency.',
    about: [
      "AI moves fast, and it can be hard to know where to start. We help teams and individuals learn AI through hands-on workshops and real projects\u2014not just presentations. You'll walk away with practical skills you can use right away to work smarter and create more.",
    ],
    field: 'navy',
    mark: networkMark,
    markStyle: { left: '-20%', top: '10%' },
  },
  {
    num: '03',
    word: 'PRODUCTION',
    category: 'Production',
    title: 'Full Content Production',
    blurb: 'End-to-end content, from first concept to final cut.',
    about: [
      "Have an idea but not sure how to bring it to life? We help turn it into something people can see, experience, and connect with. From the first conversation to the final launch, we create commercials, APPS, films, AI-powered content, digital platforms, and e-commerce websites\u2014all with the right team for the job. Whether it's telling your story or building the platform behind it, we make sure everything works together from start to finish.",
    ],
    field: 'red',
    mark: apertureMark,
    markStyle: { top: '12%' },
  },
  {
    num: '04',
    word: 'EXPANSION',
    category: 'Market Expansion',
    title: 'APAC & U.S. Growth',
    blurb: 'Guiding startups and businesses as they expand into new markets across APAC and the U.S.',
    about: [
      "Breaking into a new market isn't easy\u2014we've been there. Whether you're expanding into APAC or the U.S., we help you navigate the challenges, avoid common mistakes, and figure out what works for the local market.",
      'From strategy and partnerships to brand localization and launch, we work alongside your team to make the process smoother, faster, and more effective\u2014so you can focus on growing your business.',
    ],
    field: 'charcoal',
    mark: globeMark,
    markStyle: { left: '-10%', top: '12%' },
  },
]
