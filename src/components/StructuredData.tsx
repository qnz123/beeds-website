// Organization / LocalBusiness JSON-LD (schema.org). Tells Google that BEEDS is
// a real business entity — name, logo, address, hours, contacts — which helps
// with two things visible in search: (1) the "Did you mean: beads" autocorrect
// (entity recognition), and (2) the Knowledge Panel content. Rendered as a
// static <script> so it ships fine under next.config.js output:'export'.
//
// NAP (name/address/phone) is sourced from the Google Business Profile and
// should stay identical to it — mismatched NAP hurts local SEO. Update here and
// in the profile together if anything changes.

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beedstu.com'

const data = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'ProfessionalService'],
  name: 'BEEDS',
  alternateName: 'BEEDS Creative Studio',
  url: siteUrl,
  logo: `${siteUrl}/logo/beeds-butterfly-black.png`,
  image: `${siteUrl}/logo/beeds-butterfly-black.png`,
  description:
    'Innovation-first media studio working across Tokyo and the U.S. since 2012 — creative strategy, AI enablement, video production, and market expansion.',
  foundingDate: '2012',
  email: 'booking@beedstu.com',
  telephone: '+81-70-4349-5384',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '6 Chome-23-4 Jingumae',
    addressLocality: 'Shibuya',
    addressRegion: 'Tokyo',
    postalCode: '150-0001',
    addressCountry: 'JP',
  },
  areaServed: ['JP', 'US'],
  knowsLanguage: ['en', 'ja'],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '10:00',
      closes: '17:00',
    },
  ],
  // Add verified profile URLs here (Instagram, LinkedIn, etc.) to strengthen the
  // entity graph — omitted until confirmed rather than guessed.
  // sameAs: ['https://www.instagram.com/...'],
}

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here — no user input, all static literals.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
