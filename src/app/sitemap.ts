import type { MetadataRoute } from 'next'

// Required for `output: 'export'` — without it, reading process.env below
// makes Next.js treat this route as dynamic, which static export can't emit.
export const dynamic = 'force-static'

// Mirrors the fallback in layout.tsx: falls back to the production domain if
// NEXT_PUBLIC_SITE_URL isn't set in the deploy environment.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beedstu.com'

// Pre-renders to a plain sitemap.xml at build time.
//
// /terms is intentionally omitted: per client direction it's unlinked from
// the footer, and listing it here would actively promote its discovery.
//
// The homepage carries hreflang alternates for its English (/) and Japanese
// (/ja) versions so search engines serve the right language.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const homeLanguages = { en: `${siteUrl}/`, ja: `${siteUrl}/ja/` }

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: homeLanguages },
    },
    {
      url: `${siteUrl}/ja/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
      alternates: { languages: homeLanguages },
    },
    {
      url: `${siteUrl}/about/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: { en: `${siteUrl}/about/`, ja: `${siteUrl}/ja/about/` } },
    },
    {
      url: `${siteUrl}/ja/about/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates: { languages: { en: `${siteUrl}/about/`, ja: `${siteUrl}/ja/about/` } },
    },
    {
      url: `${siteUrl}/booking/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
