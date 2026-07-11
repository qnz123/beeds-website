# BEEDS — Primary Design System

This is the **canonical design** for the BEEDS site, ported from `preview.html` into the
Next.js app on 2026-06-22 and last updated **2026-07-09** (Featured Work rebuilt as
"The Folio" Edition B filmstrip with client-directed scroll-driven motion).
Treat this document and the live
components as the source of truth for all future work. The reference mockup lives at
`preview.html`.

**Stack:** Next.js 15 (App Router) + React 19, TypeScript, Tailwind + `globals.css`,
Prisma 7 / libsql (SQLite), Resend email. (Upgraded from Next 14 / React 18 on 2026-07-06.)

## Design language

Editorial / minimalist print aesthetic.

| Token        | Value                                   | Notes                                  |
|--------------|-----------------------------------------|----------------------------------------|
| Font         | `Times New Roman, Times, serif`         | Headings `font-weight: 400`            |
| Background   | `#f5f5f5` (light) / `#fff` (panels)     |                                        |
| Text         | `#000`, muted body `#666`               |                                        |
| Borders      | `1px solid #000` section dividers       | Sharp, hairline rules                  |
| Eyebrows     | 12px, uppercase, `letter-spacing: 2px`  | `.eyebrow` utility                     |
| Accent grads | gold `#ccb718`, blue `#233452`, red `#b73d3d`, charcoal `#333` | Work tiles only |
| Corners      | Sharp everywhere **except** the booking success card `.booking-info` (8px radius — the Concierge's underline blanks need no rounding) |

Global CSS classes live in `src/app/globals.css` (`.nav`, `.fw-*` (Featured Work folio strip),
`.service-item`, `.client-list`, `.video-grid`, `.video-item`, `.video-thumbnail`,
`.video-play-icon`, `.work-cover*` (featured cinema-poster cover), `.video-services*`
(CSS-only tile captions), `.video-modal*`, `.gallery-overlay*`, `.brush-highlight`,
`.eyebrow`, `.container-x`, typewriter + the Concierge booking styles (`.sentence`,
`.blank`, `.concierge-*`, `.cg-reveal`, `.booking-info`)).

**Brush-highlight utility (`.brush-highlight`, 2026-07-10).** A hand-drawn yellow
highlighter swipe behind a phrase — a rough two-stroke SVG in the gold family (`#eed63c` /
`#e3c92e`, translucent) painted as the element's **own background** with
`box-decoration-break: clone`, so a **multi-line phrase gets the swipe repainted on every
line** (an earlier `inline-block` + absolute-pseudo version didn't wrap). The wrapped text
sharpens to black ink. Wrap any phrase in `<span className="brush-highlight">`; in the
`/about` Services tab copy it's applied to data-driven phrases via `renderWithHighlights`
(so no markup lives in the `folioData` strings). In use on /about: "Think backwards", "We
help business who ask for change", "walk away with practical skills", and the Production
services list.

## Page structure (homepage)

`src/app/page.tsx`: Navigation → Hero → VideoPortfolio (Selected Work) → Portfolio (Featured
Work) → Clients (Selected Clients) → Impact (Results of Creative Consulting) →
BookingCalendar (Contact) → Footer. **Services was moved off the homepage onto `/about`.**

**Other routes** (all share the `Navigation → <main> → Footer` chrome + a `metadata` export):
`/about`, `/booking`, and **`/terms`** — an editorial Terms of Use page (`src/app/terms/page.tsx`,
built 2026-07-10, eyebrow-labelled clauses in hairline-divided two-column rows). Note: the
footer link to `/terms` was removed at client direction, so the page currently exists but is
unlinked.

| Section          | Component                                  | Notes |
|------------------|--------------------------------------------|-------|
| Nav              | `components/Navigation.tsx`                 | Sticky, `BEEDS` left. Order: **Work · About · Services · Contact**. Links: Work → `/#work` (the Selected Work section), About → `/about`, Services → `/about#services`, Contact → `/#contact` |
| Hero             | `components/sections/Hero.tsx`              | Client component; typewriter headline. Body copy is client-authored ("Your story is your brand…"); the old "Start a Project" CTA was removed |
| Selected Work    | `components/sections/VideoPortfolio.tsx`    | Client component; `id="work"`, first section under Hero (no top divider). Thumbnail grid, click a tile to open a video modal or image-gallery overlay — see the dedicated section below |
| Featured Work    | `components/sections/Portfolio.tsx`         | Client component; `id="featured-work"`. "The Folio" (Edition B): 4 specimen plates on brand-color fields in a horizontal filmstrip (instrument watermark + outlined numeral + ghost word + copy), with scroll-driven motion (scrolling scrubs the animations; stopping holds them). Content: Creative Strategic Consulting · AI Learning & Workshops · Full Video Production · APAC & U.S. Growth — see the dedicated section below |
| Clients          | `components/sections/Clients.tsx`           | Client component; "Selected Clients" — black-ink logos in a full-bleed hairline index strip on the light ground ("colophon strip"); see the dedicated section below |
| Impact           | `components/sections/Impact.tsx`            | Client component; animated scroll-reveal charts. Now a SINGLE block — "Results of Creative Consulting" (stat count-ups + quarterly line chart + before/after bar chart). Market Research and How We Deliver blocks were removed. All figures illustrative placeholders. See the dedicated section below |
| Booking/Contact  | `components/BookingCalendar.tsx`            | "The Concierge" — booking as three editorial sentence-stanzas with underline blanks (see the dedicated section below) |
| Footer           | `components/Footer.tsx`                      | **Contact / Information** columns (2026-07-10). Contact column: "Business Email — booking@beedstu.com" (`mailto:`). The old Follow/Instagram link and a briefly-added "Terms of use" link were both removed |

Services (`components/sections/Services.tsx`, `id="services"`) now lives on the `/about`
page, not the homepage. **Folio tabs since 2026-07-09** (client component — this replaced,
in the same day's iterations: the always-open numbered list → accordion rows → these tabs,
absorbing the short-lived Mini Folio strip): the section speaks the Featured Work language
directly — the four folio frames (shared `folioData.tsx`) render as **small tab-plates**
(brand field + instrument watermark + specimen numeral + category, `.svct-*` classes),
active tab at full opacity with a 1px offset hairline frame, inactive dimmed; clicking a
tab shows that frame's category/title/blurb in the panel beneath with a soft crossfade.
Proper tab semantics (`role=tablist/tab/tabpanel`, `aria-selected`, arrow-key switching);
reduced-motion skips the fade. The old service copy (Creative Strategy / Video Production /
Localization / Creative Diagnosis) was replaced by the Featured Work copy at client
direction. It closes with a **Mini Folio**
(`MiniFolio.tsx`, added 2026-07-09): the homepage Featured Work plates duplicated at
reduced scale under a small "Featured Work" label — same treatment (fields, idling
instrument watermarks, specimen numerals, ghost words, category → title over the hairline
rule; blurbs omitted at this size). Frame data is shared via `folioData.tsx` (single
source for both the homepage strip and the mini); mini styles are the `.fw-mini` /
`.fw-strip--mini` modifiers in the Folio CSS block. Plain idle motion (no scroll scrub at
this scale); same reduced-motion stilling.

## Featured Work — "The Folio", Edition B filmstrip

`components/sections/Portfolio.tsx` (`id="featured-work"`, client component). **Shipped
2026-07-09**, replacing the "Signed Reel" projection bands (see decision record below).
Under a flex header row — "Featured Work" eyebrow left, muted **"drag →"** cue right —
runs a **horizontal scroll-snap filmstrip** (`.fw-strip`: `scroll-snap-type: x mandatory`,
thin scrollbar, `scroll-padding: 0 40px` so the mandatory snap doesn't swallow the gutter
and frame 01 stays aligned with the eyebrow). Four cells (`.fw-cell`,
`width: clamp(280px, 34vw, 400px)`; **≤760px: `clamp(280px, 78vw, 400px)`** — one plate per
screen with the next peeking), each a **3:4 specimen plate** (`.fw-plate`) on a brand-color
gradient field plus a paper-ground counter ("01 / 04") underneath. Plate layers, back to
front:

- the **ghost discipline word** (`.fw-word`) at press scale behind the copy —
  `rgba(255,255,255,.06)`, `bottom: 24%`, nowrap, drifting counter-phase to the numeral;
- the discipline's **instrument drawn past the plate edges** (`.fw-mark`, width 132%,
  center-left, per-frame offsets inline from `frames[]`) as a watermark:
  `stroke rgba(255,255,255,.16)` at `.8` weight, gold accents `rgba(204,183,24,.4)`
  (goldstroke `.45`), white fills `rgba(255,255,255,.2)`. Compass (Strategy — includes the
  four tick lines from the approved plate) / neural network (AI) / aperture (Production) /
  globe + flight path (Expansion), each idling: needle sway 7s, node pulse 3.2s, blades
  46s, dashes travel 7s, plus a shared 30s whole-plate drift on the svg;
- a **giant outlined specimen numeral** (`.fw-num`) top-right —
  `-webkit-text-stroke: 1px rgba(255,255,255,.32)` (solid `@supports` fallback),
  `min(17vw, 190px)`, drifting ±10px over 28s;
- **"Frame NN"** label (`.fw-plabel`) top-left; **category → title → blurb** (`.fw-meta` /
  `.fw-rule`) over a `rgba(255,255,255,.6)` hairline rule. The blurb reserves two lines via
  `min-height: calc(1.6em * 2)` so the rules sit at the same height in every frame even for
  the one-line Production blurb — **client-flagged fix, keep it**.

| Frame | Field gradient | Category | Title | Ghost word |
|-------|----------------|----------|-------|------------|
| 01 | gold `#a89613 → #6e6400` (deepened from `#ccb718` for white-type contrast) | Strategy | Creative Strategic Consulting | STRATEGY |
| 02 | navy `#233452 → #16202f` | AI Enablement | AI Learning & Workshops | AI ENABLEMENT |
| 03 | red `#b73d3d → #8b2e2e` | Production | Full Video Production | PRODUCTION |
| 04 | charcoal `#333 → #1a1a1a` | Market Expansion | APAC & U.S. Growth | EXPANSION |

Copy is verbatim from the pre-redesign tiles/bands. The specimen sizes (`17vw` numeral /
`7vw` word) were tuned against ~34vw cells, so the ≤760px block rescales them
(`min(44vw,190px)` / `min(17vw,74px)`) to keep the approved proportion of the plate.

**Accessibility:** the scroller has `tabindex="0"`, `role="region"`, an aria-label, and a
`2px solid #000` `:focus-visible` outline (the `.video-item` pattern); arrow keys scroll it
natively once focused. Numeral and ghost word are `aria-hidden`; each instrument svg keeps
`role="img"` + label.

**Motion — scroll-driven scrub (client-directed 2026-07-09, replacing the earlier 3s
spin-down).** The folio's motion is *aligned to the page scroll*: on mount (rAF after
paint), Portfolio.tsx collects every animation inside the section
(`section.getAnimations({ subtree: true })`, feature-checked), **pauses them, and scrubs
their `currentTime`** from a passive rAF-throttled scroll handler. Progress =
`(viewportH − rect.top) / (viewportH + rect.height)` clamped 0..1 (the section's full
journey through the viewport), mapped onto one shared **14s scrub clock**
(`currentTime = progress × 14000ms`) so all animations keep their designed relative
speeds — scrolling down plays the folio forward, scrolling up rewinds it, stopping holds
it. Verified via CDP: 17 folio animations all `paused`, `fw-sway` currentTime advancing on
scroll-down and rewinding on scroll-up. Guards: `prefers-reduced-motion` renders everything
static from the start (all `fw-*` animations off in CSS, effect exits early); no-JS/SSR
output is fully visible with the CSS animations simply running time-based (acceptable
degradation). The reveal fade-up transition is intentionally NOT scrubbed (it starts after
collection). The section body keeps the house **once-only fade-up reveal**
(`.fw-folio[data-animate]`, same tri-state `useInView` as `Impact.tsx` — SSR-safe,
reduced-motion skips to final state). All styles live in the "Featured Work — The Folio"
block of `globals.css`.

### Featured Work redesign — decision record

**2026-07-09 — "The Folio", Edition B (IMPLEMENTED, supersedes below):** review round 4 —
https://claude.ai/code/artifact/4e836cc4-763a-4161-bd03-9e539cae1f2f — merged the
instrument-room and specimen-plate concepts into "The Folio" and showed it in two editions;
the **client picked Edition B ("On the brand fields") with the filmstrip geometry**, first
with a 3s spin-down motion, revised the same day to **scroll-driven scrub** ("instead of
making it stop, let it interact align while scrolling down in this page"). This supersedes the
Projection bands **and** the Whisper Tone stills: the parallax/whisper CSS and the `bands[]`
still data were removed, but the curated frames in `public/featured/` stay on disk as
alternates.

**2026-07-08 — "Signed Reel" projection bands (superseded):** three artifact rounds —
tile concepts (https://claude.ai/code/artifact/a247f63b-a8a2-454c-812f-fa8f6fffa9ff, Hybrid
C+A "Signed Reel" approved — the instrument marks: compass = Strategy, neural network = AI,
aperture = Production, globe+flight path = Expansion — these survive into the Folio),
geometry studies (https://claude.ai/code/artifact/da70ebc1-43a6-44b1-a7ea-7e09150f2d58 —
"The Projection" full-bleed bands shipped per recommendation; the client has now explicitly
locked the Filmstrip instead), and image treatments
(https://claude.ai/code/artifact/3afd22f3-6c89-4dac-a9fa-9ea14b2bdc82 — "Whisper Tone",
retired with the bands).

## Selected Clients — "colophon strip"

`components/sections/Clients.tsx` (client component). **Redesigned 2026-07-08** when the
Signed Reel landed above it: the old flat dark-navy band (`#1b2436`) read as a second,
unrelated dark field right after the charcoal band 04 and had none of the site's hairline
discipline. The section now **returns the page to paper**: heading **"Selected Clients"**
(standard black eyebrow, `px-10 pt-12 pb-8` — compact on purpose; this section is a
punctuation mark between Featured Work and Impact, not a feature) on the `#f5f5f5` ground,
above a **full-bleed hairline-divided index strip** of the five client marks set as
**black ink**.

**Logos as ink:** the PNGs in `public/clients/` (Condé Nast, The New York Times, Champion,
Verizon, Victoria's Secret) are supplied pre-coloured white; `.client-logo` renders them
black via `filter: invert(1)` (all five verified by eye to invert cleanly — crisp, no halos),
resting `opacity: 0.85` → `1` on cell hover. Data is a `const clients[]` (name + `src` +
intrinsic `width`/`height` + `ink`) rendered via `next/image`.

**Layout** (`.client-strip` / `.client-cell` / `.client-logo` in the "Clients — colophon
strip" block of `globals.css`): a `<ul>` grid, mobile-first **stacked hairline list**
(1 column, `22px` cell padding, 1px black rules between cells) becoming **five equal cells
split by vertical 1px rules at ≥1024px** (`38px 24px` padding). The strip's own
`border-top` opens it; it runs flush to the section's bottom edge so the next section's
`border-t` closes it — rule-to-rule, like a printed colophon. Optical balance is tuned
**per logo** via the `ink` field (rendered height in px: Condé Nast 20 · NYT 22 ·
Champion 26 · Verizon 30 · Victoria's Secret 36 — the compact/two-line lockups need more
height than the wide mastheads to carry equal weight); `max-width: 100%` +
`object-fit: contain` guard narrow cells.

**Motion:** none — the strip renders **static** (scroll reveal removed at client direction
2026-07-09; the component is a server component again). The only interaction is the logo's
hover ink-deepening (`opacity .85 → 1`). No carousels, no marquee.

To swap logos: drop a white PNG in `public/clients/`, add a `{ name, src, width, height,
ink }` entry (read real pixel dims first, then tune `ink` by eye against its neighbours),
keeping the set at five-ish so the desktop cells stay generous.

## Video Portfolio ("Selected Work")

`components/sections/VideoPortfolio.tsx` (client component; `id="work"`, the nav Work
link's target — renamed from "Selected Reel" 2026-07-07). Tiles are referenced
left-to-right as **V1 … V10**; the section is driven by a `const CLIPS[]` array at the top
of the file.

**Featured cinema-poster cover (Study C, client-approved 2026-07-10).** The section opens
with **`FeaturedShowcase`** — `CLIPS[0]` (V1 WIRED) plays inline as a **full-frame,
cover-cropped, chromeless muted loop** (88vh, `.work-cover*` in globals.css: the 16:9
`background=1` embed is oversized + centered to cover the frame; `pointer-events: none`),
with a white credit over a soft bottom scrim — eyebrow "Selected Work", the title, and the
CSS-only services line. **Loops the film's FIRST 30 SECONDS** via the Vimeo Player API
(`loadVimeoApi()` injects `player.js` once; `SHOWCASE_LOOP_SECONDS = 30`; on `timeupdate ≥ 30`
it `setCurrentTime(0)`); if the API fails to load the embed still autoplays + loops the full
film (graceful degradation). V1's own grid tile is removed — the **grid renders `CLIPS.slice(1)`**
(V2…V10), so **V10 is a plain click-to-modal duplicate of the WIRED film** (added 2026-07-10)
that also squares the grid to 9 tiles / 3 rows.

**Grid:** responsive **3 / 2 / 1 columns** (desktop / tablet / mobile), **row-major
left-to-right** (deliberately NOT column-masonry, which would scramble the V# order),
`align-items: start`, ~30px gap, 40px side padding. Thumbnails render at their **natural
aspect ratio, never cropped** (`next/image` with each clip's intrinsic `width`/`height`).
External thumbnail domains need a `remotePatterns` entry in `next.config.js`
(`i.vimeocdn.com` is allowed); local `/public` paths need none.

**Tile structure:** each tile is `.video-frame` (thumbnail + hover overlay) followed by a
`.video-services` caption **below** the thumbnail. `.video-frame` has `overflow: hidden` so
the thumbnail's 1.03 hover scale is clipped to the frame and the dark hover tint never leaks
past the enlarged image edges.

**Services captions (`.video-services--vN`, 2026-07-10)** — the small italic grey line under
each thumbnail. **The copy is NOT in the markup**: it is emitted from CSS via
`.video-services--vN::after { content: '…' }` per slot, on an empty `aria-hidden` div locked
with `user-select: none` + `pointer-events: none`. So it **can't be selected, copied, found by
in-page search, or read off the DOM** (client requirement). Grid slot classes stay **v2…v9(+v10)**
matching `CLIPS.slice(1)`. On `/about` the Services tab copy uses the same brush-highlight
utility (below) via `renderWithHighlights`.

**Two clip types** (same tile look — thumbnail + hover overlay of category/title):
- **Video clip** — has `vimeoId`. Tile shows the circular play button (see below). Click opens `VideoModal`:
  a Vimeo autoplay embed sized to the clip's aspect ratio, closed via ✕ / backdrop / Esc
  (unmounts the iframe to stop playback), with focus management + scroll lock.
- **Gallery clip** — has `images[]` + `description`. Click opens `GalleryOverlay`: a full-screen
  editorial case-study — `images[0]` is a large **hero**, the **description** follows it, then the
  remaining images render as a small thumbnail grid. Subtle IntersectionObserver fade/slide-in per
  block; `prefers-reduced-motion` respected; ✕ / Esc close and restore focus. (The **"Gallery"
  badge was removed** 2026-07-10 — the tile is unmarked but still opens the overlay.)

`description` is `\n\n`-separated: first block = overlay heading, rest = body paragraphs.
A clip with neither `vimeoId` nor `images` renders an inert "Reel coming soon" placeholder.

**Squarish/vertical clips (ratio < 1.6, e.g. V3, V9 1:1)** break the uniform 16:9 rule:
auto-detected in the tile (`isVerticalish`), they render `video-poster--natural` at full
natural height; for a square *video* clip the same `width`/`height` also drive `VideoModal`'s
`--clip-aspect` (square thumb → square modal frame).

**Play button** (`.video-play-icon` in `globals.css`) — a modern circular affordance replacing
the old bare CSS triangle. A **54px hairline ring** (`1px solid rgba(255,255,255,0.85)`, the
site's hairline language translated to white for photographic imagery) with a **frosted
translucent fill** (`background: rgba(0,0,0,0.2)` + `backdrop-filter: blur(1.5px)`) so the
thumbnail shows through, plus a soft `box-shadow` for lift over busy stills. The triangle is a
small `::before` pseudo-element (`13×16px`, nudged `margin-left: 3px` for optical centering),
so the component markup stays a single decorative `<span aria-hidden>` with `pointer-events:
none`. On `.video-item:hover`/`:focus-visible` the ring **fills to near-white and the triangle
flips to black** with a subtle `scale(1.08)`; `prefers-reduced-motion` neutralises the scale
and transitions.

**Current lineup (2026-07-10):** V1 WIRED (featured cover) · V2 WIRED — WILL FERRELL ·
V3 BON APPÉTIT · V4 BRIDES — BALLOON · V5 ANIME NOBU (gallery) · V6 BRIDES — WEDDING ·
V7 GLAMOUR — BLAKE LIVELY · V8 JAPAN AIRPORT · V9 BOMB TAKOYAKI (1:1, Social Media) ·
V10 WIRED MAGAZINE (plain duplicate of V1).

**Adding a clip:** source assets live in `Assets/Thumbnail/` (may be `.jpeg` or `.png`); copy
tile thumbnails to `public/thumbnails/vN-*` and gallery images to `public/nobu/` (or similar).
**Downscale to ≤1600px wide first** (`sips --resampleWidth 1600`) — multi-MB originals choke
Next's dev image optimizer. Read real pixel dims with `sips -g pixelWidth -g pixelHeight`, fill
the slot in `CLIPS`, and add the caption in globals.css as `.video-services--vN::after`. Note
`tsconfig` has `noUnusedLocals` — remove dead constants or the build fails.

## Impact ("Results of Creative Consulting")

`components/sections/Impact.tsx` (client component — scroll-triggered reveal/count-up
animations, see below) replaced the old homepage `About` section on 2026-07-07. It sits
between Featured Work/Clients and BookingCalendar. **Originally three sub-blocks (Market
Research, Results, How We Deliver); Market Research and How We Deliver were removed 2026-07-07
— only the Results block remains:**

- **Results of Creative Consulting** — eyebrow + serif lede, 1/3-col stat callouts (`+142%`,
  `3.2×`, `58%`; each stat has a `border-t border-black` rule above it, surviving column
  reflow), then two SVG charts side by side on desktop: a line chart (`EngagementGrowthChart`,
  client-engagement index by quarter) and a grouped bar chart (`ChannelLiftChart`,
  before/after lift per channel, with a small color-swatch legend). An illustrative-placeholder
  disclaimer line closes the section.

(Removed with the deleted blocks: `MarketGrowthChart`, `DeliveryDonut` components; the
`marketStats`/`marketGrowth`/`deliveryStages`/`disciplines` data; and the `.impact-cell` /
`.impact-donut-arc` / `.impact-chart-area` CSS rules.)

Charts are hand-authored inline SVG (`viewBox`, `width:100%; height:auto`, no chart
library), monochrome with a single restrained gold (`#ccb718`) accent for the "growth"
marks and light grey (`#ccc`) for baseline/"before" marks, direct value labels instead of
legends (except the 2-series bar chart, which gets a minimal swatch legend), hairline
1px axes, sharp-cornered bars, and `role="img"` + `aria-label`/`<title>` for
accessibility. All figures live in `const` arrays at the top of the file and are
explicitly labeled as illustrative placeholders (a disclaimer line closes the section).

**Scroll animations.** A local `useInView` hook (mirroring `useRevealOnScroll` in
`VideoPortfolio.tsx`) drives everything: an IntersectionObserver (threshold ~0.2–0.4,
`rootMargin: '0px 0px -10% 0px'`) fires once per element and disconnects. Its tri-state
(`'idle' → 'hidden' → 'visible'`) is the key SSR-safety trick — the hidden/animating state
is only ever entered from a `useEffect` after mount, so server-rendered and no-JS output
sits in `'idle'`, which is styled identically to `'visible'` (nothing is ever permanently
invisible if JS fails or the observer never fires). `prefers-reduced-motion` skips straight
from `'idle'` to `'visible'` without ever passing through `'hidden'`. Each block/stat
grid/chart figure/matrix owns its own hook instance (own IntersectionObserver), so the
draws are genuinely scroll-position-linked rather than firing all together when the
section's top edge appears. KPI numbers count up via `requestAnimationFrame`
(ease-out-cubic, ~1.1s, staggered ~90ms/item) — the animating figure is `aria-hidden`, with
a static `sr-only` span carrying the exact authored string so screen readers always get the
final value regardless of timing. Line charts draw via `stroke-dasharray`/
`stroke-dashoffset` (path length measured client-side, ~1.2s ease-out), area/dots/value
labels fade in afterward; bar charts grow from the baseline via `scaleY` (`transform-box:
fill-box`), staggered per before/after pair, with the "+X%" lift label (styled in the gold
accent) fading in last. Chart-internal CSS is scoped `figure[data-animate=...] .impact-*`
(tag-qualified) specifically so an ancestor block's own `.impact-reveal[data-animate]`
never leaks into and prematurely fires a nested chart's animation. Animation-only CSS
classes (`.impact-reveal`, `.impact-stat`, `.impact-chart-line/-dot/-label`, `.impact-bar`,
`.impact-lift-label`) live in the "Impact: scroll-triggered reveals" block of `globals.css`,
with a defensive `@media (prefers-reduced-motion: reduce)` block alongside the existing
`.gallery-reveal` one.

## About page (`/about`)

`src/app/about/page.tsx` — a standalone editorial landing page (server component,
`metadata` export), same chrome pattern as the booking page: `Navigation` → `<main>` →
`Footer`. Reached from the nav's **About** link (the homepage no longer links to it inline
— see Impact above). Sections (all `.container-x`, `.eyebrow` labels, hairline
`border-t border-black` dividers except the top-of-page lede):

1. **Lede** — eyebrow + large serif statement + supporting paragraph (no top border, sits under nav like Hero).
2. **Who We Are** — reuses the homepage About section's two paragraphs verbatim.
3. **Our Approach** — philosophy lede + supporting paragraph.
4. **How We Work** — four numbered rows (01 Cultural Fluency · 02 Editorial Craft · 03 Considered Pace · 04 Long-Term Partnership) reusing the `.service-item` numbered-row pattern (principles, deliberately distinct from the homepage Services offerings).
5. **Closing CTA** — heading + "Start a Project →" link to `/booking` (Hero-CTA style).

All copy except the reused "Who We Are" block is **editorial placeholder** in the same
register as the rest of the site (no invented client names, staff, addresses, or stats) —
replace with real content.

**Our Services (`components/sections/Services.tsx`, rendered on /about).** Folio tab-plates
(`.svct-*`, reading `folioData`) now sit in a **two-column grid** (`lg:grid-cols-[minmax(0,1fr)_300px]`):
tabs + description panel on the left, a **Selected Clients** sidebar on the right (eyebrow +
serif list of the ten client names), set off by a vertical hairline (`lg:border-l`); stacks
below the panel under 1024px. Panel copy runs through `renderWithHighlights` for the
brush-highlighted phrases. Journey-timeline dot captions and the two brush-highlighted lines
were updated 2026-07-10.

## Booking — "The Concierge"

`components/BookingCalendar.tsx` (client component; filename kept). **Client-approved
Study 2 "The Concierge", shipped 2026-07-09**, replacing the month-grid calendar +
time-slot chips (that UI and its CSS — `.calendar-*`, `.time-slot*`, `.slots-grid`,
`.booking-form`, `.form-group*`, `.booking-summary`, `.booking-submit` — were removed).
Booking is now typography: three editorial stanzas of large serif text
(`clamp(22px, 3vw, 32px)`, line-height 1.9, 30ch measure) whose controls are **native
selects/inputs styled as underline blanks** — 1px black bottom border, no box, custom
double-triangle select arrow, italic muted `#b5b0a8` placeholders (unfilled selects mimic
this via a `data-empty` attribute), and a **gold `#b3a013` 2px underline on focus** (the
section's one accent). The three **`select.blank` controls (service / date / time) render at
`font-size: 0.62em`** (2026-07-10) — smaller than the surrounding prose so the picked value
reads like fine print filled into a printed form blank; the name/email inputs keep the full
sentence size. Styles live in the "Booking — The Concierge" block of `globals.css`.

1. "I'd like a [service ▾] session on [date ▾] at [time ▾]." — services are the four folio
   names (Creative Strategy / AI Enablement / Production / Market Expansion, slugs matching
   the API enum); times are **hourly slots shown in the visitor's own local timezone**
   (see "Timezone-aware session windows" below — the old 12 fixed UTC slots are gone).
2. "My name is [___] and you can reach me at [___]." — text + `type=email` inputs.
3. (muted `.sentence--soft`, smaller) "The project, idea, or challenge I'd like to talk
   about: [___]" — an optional textarea that **grows with its content**
   (`field-sizing: content` + an input-event fallback); maps to the API's `message` field.

Stanzas 1–2 live on **step 1 (details)**; stanza 3 (the optional note) lives on **step 2
(message)** — see "Two-step flow" below. Step 1 ends with the underlined uppercase CTA
**"Send the request →"** and the footnote "Weekdays only · times shown in your timezone
(`[detected IANA tz]`) · we hold sessions from our Tokyo studio." — the detected IANA zone
is shown so the visitor trusts the conversion (all "UTC" copy was removed 2026-07-10). POST
failures render a small muted-ink italic line in the concierge voice (`.concierge-error`) —
no alarm boxes.

### Two-step flow (2026-07-10)

The Concierge is now **two leaves**, driven by a `step: 'details' | 'message'` state on one
`<form>` (branched in `handleSubmit`, so the Enter key does the right thing in either leaf):

- **Step 1 (details)** — stanzas 1–2 (service · date · time; name · email), the CTA
  **"Send the request →"**, and the footnote. The CTA **no longer posts**: it validates the
  required fields and turns to step 2. Required to advance: **service · name · valid email**.
  On a miss it shows the concierge line *"That still needs a service, your name, and an email
  we can reply to."* and does **not** advance. (Client wording keeps the button labelled
  "Send the request →" even though it now advances rather than sends — so completing a booking
  is two clicks, page-1 → page-2 → Submit. Offer to rename step 1's button to "Continue →" if
  the client prefers.) The `required`/native-validation attributes were removed from all step-1
  controls so the concierge error is the single voice.
- **Step 2 (message)** — stanza 3 only (the optional `.sentence--soft` textarea, prompt and
  placeholder verbatim), a quiet **"← back"** link (`.concierge-back`) that returns to step 1
  **with every field preserved** (no form reset), and the real **`Submit`** button
  (`.concierge-cta`, becomes "Sending…") that performs the POST. On POST error the visitor
  stays on step 2 with their note intact.
- **Date + time are optional, with an explicit N/A choice** (2026-07-10). They're **not** in
  the step-1 gate. Each `<select>` reads: the "date"/"time" placeholder option (selectable —
  `disabled` removed), then a dedicated **`<option value="N/A">N/A</option>`**, then the real
  options. So a visitor can either leave it on the placeholder or actively pick **N/A**; both
  paths mean "no preference." On submit, both collapse to the honest string **"N/A"** —
  `const date = form.date && form.date !== 'N/A' ? form.date : 'N/A'` (same for `time`) — so the
  API's non-empty-string zod contract still holds and the success card + `lib/email.ts` render
  "N/A" naturally (email.ts passes `date`/`time` through as-is; **API schema unchanged**).
  Picking N/A also shows literally in the stanza ("…session on N/A at N/A") in normal ink. The
  timezone-aware time options, comfortable-hours filter, and weekday / 3-business-day date logic
  are **all unchanged**.
- **Transition** — a soft **page-turn** fade-and-rise (`@keyframes cgStepIn`, 0.5s ease,
  `opacity 0→1` + `translateY(12px→0)`), applied via `.cg-step--anim` only on an actual step
  change (an `animateSteps` flag stays false on first mount, where the scroll reveal owns
  arrival). No persistent hidden state, so SSR/no-JS is never invisible; `prefers-reduced-motion`
  sets `animation: none` (instant swap, `.cg-step` opacity 1 — verified). Focus moves into the
  step-2 textarea when the message leaf appears; the section's once-only scroll reveal still
  applies to step 1 on arrival.

### Timezone-aware session windows (2026-07-10)

Availability is authored in **JST (Asia/Tokyo)** and differs by the visitor's region; the
visitor sees **whole-hour** slots converted to their **own auto-detected timezone**
(`Intl.DateTimeFormat().resolvedOptions().timeZone`). Pure functions in
`BookingCalendar.tsx`: `regionWindow(tz)` → `{startHourJST, endHourJST, region}`,
`detectTimeZone()` (SSR-safe), `buildTimeOptions(ymd, tz)`.

| Region | Match | JST window | Hourly slots (half-open) |
|--------|-------|-----------|--------------------------|
| US Pacific (`pst`) | `Set{America/Los_Angeles, America/Vancouver, America/Tijuana}` | 08:00–10:00 | 08:00, 09:00 (2) |
| Rest of N. America (`eastern`) | else `tz.startsWith('America/')` (incl. New York & Edmonton) | 20:00–23:00 | 20:00, 21:00, 22:00 (3) |
| APAC (`apac`) | else `/^(Asia\|Australia\|Pacific)\//` | 10:00–17:00 | 10:00 … 16:00 (7) |
| **Everyone else — default** | else (Europe / unknown) | **10:00–17:00 (APAC/Tokyo)** | 10:00 … 16:00 (7) |

**Comfortable-hours guard (2026-07-10):** slots whose start hour falls outside
**07:00–21:00 in the visitor's own timezone** are dropped (`COMFORT_MIN_HOUR` /
`COMFORT_MAX_HOUR` + `hourInTz()`). The three defined windows already sit inside the band
(Eastern 7–9 AM, Pacific 4–5 PM, Tokyo 10 AM–4 PM) so they're untouched; it exists mainly so
the default Tokyo window doesn't offer a European visitor pre-dawn times — London now shows
only 7 & 8 AM instead of 2–8 AM (verified live). Fallback: if the band would leave ZERO
slots (a few far-offset zones, e.g. Atlantic/Cape_Verde), the full window is kept so booking
is always possible.

**FLAGS (client decisions):** (a) Europe & all other/unknown zones **default to the
APAC/Tokyo window** (client-confirmed 2026-07-10), softened by the comfortable-hours guard
above. (b) Windows are **half-open `[start, end)`** — the closing hour is NOT bookable
("from 08:00 to 10:00" → 08:00, 09:00); one-line change if the client wants the endpoint
included. (c) The **date dropdown value is the JST calendar date**, so far-west (Pacific)
visitors correctly see a **previous-local-day** time.

**Conversion (DST-correct):** each JST hour `h` on the selected JST date `{y,m0,d}` →
`new Date(Date.UTC(y, m0, d, h - 9))` (JST = UTC+9; negative hours roll to the prior UTC
day), then formatted in the visitor's zone and in Tokyo. Slots are **rebuilt whenever the
selected date or detected tz changes** (`useMemo` on `[form.date, tz, …]`); before a date is
picked they compute against the first available date. Changing the date clears any stale
time pick. **Zone abbreviation:** current CLDR renders Asia/Tokyo's short name as "GMT+9" in
English, so the Tokyo companion is **branded "JST" directly** (`abbrev()` special-cases it);
every other zone uses Intl's honest short name — EDT/PDT for the Americas, "GMT+n" elsewhere.

**Date-shift is surfaced, never hidden:** when the local day differs from the JST date (the
Pacific 08–10 JST window lands the *previous* afternoon), both the option **label** and its
stored **value** carry the local day, e.g. `Tue Jul 14, 4:00 PM PDT`. The submitted/stored
`time` string is rich and unambiguous, capturing local + JST: `"7:00 AM EDT (10:00 PM JST)"`
or, when shifted, `"Tue Jul 14, 4:00 PM PDT (8:00 AM JST)"` (the JST companion is dropped for
Tokyo visitors, where it would just repeat the local label). The `<option value>` **is** that
string; the API contract is unchanged (`time` is a free-form string). `lib/email.ts` renders
it as-is (its own "(UTC)" suffix was removed 2026-07-10).

**Date rules (kept from the calendar):** 2-business-day lead time (`minimumDate()`,
unchanged logic), **Sundays closed**, horizon **45 days (~6.5 weeks)**. Options are grouped
in `<optgroup>` by month name; option **labels** read "Mon, Jul 13" while option **values**
carry the long format the calendar always submitted (`"Monday, July 13, 2026"`), so the
API payload format is unchanged.

**API contract:** `POST /api/bookings` with `{ name, email, service, date, time, message? }`.
Zod validates; `service` is an enum of the four folio slugs (`creative-strategy` /
`ai-enablement` / `production` / `market-expansion` — **updated 2026-07-09** from the old
video-production/localization/creative-diagnosis slugs, with the label map in
`lib/email.ts` updated to match). Bookings persist to SQLite via Prisma; Resend emails
send when `RESEND_API_KEY` is configured, otherwise sending is skipped and the booking
still succeeds. Success state keeps the `.booking-info` confirmed-details card (the
booking section's one surviving rounded element) — concierge-voice copy over the same
dl of Service/Date/Time plus the emailed-confirmation line and a "Request another
session →" underline CTA.

**Motion:** the house once-only fade-up reveal — the same tri-state `useInView` as
`Impact.tsx` (SSR/no-JS renders visible; hidden state applied only post-mount;
`prefers-reduced-motion` skips to final state). The eyebrow, each stanza, and the
CTA block fade up 14px over 0.6s with a **120ms stagger** (`.cg-reveal` +
`--stagger` inline, gated by `.concierge[data-animate]`). The section has **no
`border-t`** (removed at client direction) — the whitespace and the staggered
arrival carry the Impact → Booking handoff.

## Conventions

- Section components are presentational; data lives in a `const` array at the top of each file.
- Reuse the global CSS classes above instead of re-deriving styles inline.
- Keep the serif/light/sharp-border look; do not reintroduce the old dark gold theme.
- Use the booking flow as the canonical interaction pattern for lead capture:
  complete the concierge stanzas across the two-step flow (step 1 requires service · name ·
  email; date · time · message are all optional) and show the confirmed-details success state
  after submission.
- Placeholder content to replace with real assets: portfolio items,
  contact info (`info@beedstu.com`, `+81 (0) 123 456 7890`). (Client logos are now real.)

## Removed in this migration

- `components/BookingForm.tsx` and `components/sections/CallToAction.tsx` (superseded).
- Old dark theme + Roboto/Abel fonts in `globals.css`.
- The stale duplicate copy of the app that used to live under `Web/` (deleted 2026-06-22).
- `components/sections/About.tsx`, the homepage's old About section (deleted 2026-07-07,
  replaced by `Impact.tsx`; the standalone `/about` page has its own inline content and
  never imported this component, so it is unaffected).
