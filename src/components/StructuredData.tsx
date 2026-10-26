// Organization / LocalBusiness JSON-LD (schema.org). Tells Google that BEEDS is
// a real business entity — name, logo, address, hours, contacts — which helps
// with two things visible in search: (1) the "Did you mean: beads" autocorrect
// (entity recognition), and (2) the Knowledge Panel content. Rendered as a
// static <script> so it ships fine under next.config.js output:'export'.
//
// NAP (name/address/phone) is sourced from the Google Business Profile and
// should stay identical to it — mismatched NAP hurts local SEO. Update here and
// in the profile together if anything changes.

import type { Locale } from '@/i18n/config'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beedstu.com'

const orgId = `${siteUrl}/#organization`

// The Japanese description reuses the /ja homepage's own meta description (app/(ja)/ja/page.tsx).
const descriptions = {
  en: 'Innovation-first media studio working across Tokyo and the U.S. since 2012 — creative strategy, AI enablement, video production, and market expansion.',
  ja: '人のストラテジストとAIを融合し、すべてのブランドアセットを的確に。東京とアメリカで、クリエイティブ戦略・映像制作・プラットフォームを提供するイノベーション主導のメディアスタジオ。',
} as const

function buildData(lang: Locale) {
  const ja = lang === 'ja'
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'ProfessionalService'],
        '@id': orgId,
        name: 'BEEDS',
        alternateName: 'BEEDS Creative Studio',
        url: siteUrl,
        logo: `${siteUrl}/logo/beeds-butterfly-black.png`,
        image: `${siteUrl}/logo/beeds-butterfly-black.png`,
        description: descriptions[lang],
        foundingDate: '2012',
        email: 'booking@beedstu.com',
        telephone: '+81-70-8474-3860',
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: '+81-70-8474-3860',
          email: 'booking@beedstu.com',
          availableLanguage: ['English', 'Japanese'],
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1-3-1 Kita-Aoyama',
          addressLocality: 'Minato-ku',
          addressRegion: 'Tokyo',
          postalCode: '107-0061',
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
        // sameAs: no social profile URLs exist anywhere in the site yet; add confirmed ones here
        // (Instagram, LinkedIn, the Google Business Profile) rather than guessing.
      },
      {
        '@type': 'WebSite',
        '@id': ja ? `${siteUrl}/ja/#website` : `${siteUrl}/#website`,
        url: ja ? `${siteUrl}/ja/` : `${siteUrl}/`,
        name: 'BEEDS',
        alternateName: 'BEEDS Creative Studio',
        description: descriptions[lang],
        inLanguage: lang,
        publisher: { '@id': orgId },
      },
    ],
  }
}

export default function StructuredData({ lang = 'en' }: { lang?: Locale }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here — no user input, all static literals.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(buildData(lang)) }}
    />
  )
}
