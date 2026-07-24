import type { MetadataRoute } from 'next'

// Required for `output: 'export'` — without it, reading process.env below
// makes Next.js treat this route as dynamic, which static export can't emit.
export const dynamic = 'force-static'

// Mirrors the fallback in layout.tsx: falls back to the production domain if
// NEXT_PUBLIC_SITE_URL isn't set in the deploy environment.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beedstu.com'

// Static export (see next.config.js `output: 'export'`) pre-renders this to
// a plain sitemap.xml at build time — no server required.
//
// /terms is intentionally omitted: per client direction it's unlinked from
// the footer, and listing it here would actively promote its discovery.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: `${siteUrl}/`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${siteUrl}/about/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/booking/`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
