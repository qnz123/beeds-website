// Selected Clients — "the colophon strip" (redesigned 2026-07-08; scroll
// reveal removed at client direction 2026-07-09 — the strip renders static).
//
// The pre-coloured white logo PNGs are rendered as black ink via
// `filter: invert(1)` (verified: every mark inverts cleanly) and set in a
// full-bleed hairline-divided index strip — five cells on desktop, a stacked
// hairline list below 1024px. Styles live in the "Clients — colophon strip"
// block of globals.css.

import Image from 'next/image'

// `width`/`height` are the PNGs' intrinsic pixel dims; `ink` is the rendered
// logo height in px, tuned per mark for optical balance (the two-line
// Victoria's Secret lockup and the compact Verizon wordmark need more height
// than the wide single-line mastheads to carry equal weight).
const clients = [
  { name: 'Condé Nast', src: '/clients/conde-nast.png', width: 300, height: 45, ink: 20 },
  { name: 'The New York Times', src: '/clients/nytimes.png', width: 300, height: 44, ink: 22 },
  { name: 'Champion', src: '/clients/champion.png', width: 300, height: 55, ink: 26 },
  { name: 'Verizon', src: '/clients/verizon.png', width: 300, height: 95, ink: 30 },
  { name: "Victoria's Secret", src: '/clients/victorias-secret.png', width: 300, height: 89, ink: 36 },
]

export default function Clients() {
  // Hidden on mobile (client direction); shown from the md breakpoint up.
  return (
    <section className="bg-[#f5f5f5] hidden md:block">
      <h2 className="eyebrow px-10 pt-12 pb-8">Selected Clients</h2>
      <ul className="client-strip">
        {clients.map((client) => (
          <li key={client.name} className="client-cell">
            <Image
              src={client.src}
              alt={client.name}
              width={client.width}
              height={client.height}
              className="client-logo"
              style={{ height: client.ink }}
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
