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
// Every page and its Japanese twin carry the same hreflang alternates (en, ja, x-default = the English URL),
// matching each page's own <head>.
//
// lastModified is the real last-edit date of the page (its route file plus the components that make its
// content), not the build time, so it only moves when the page does. A static map rather than git at build
// time: Vercel's clone is shallow, so git dates there would be wrong. Bump a page's date here when you
// change it (find it with: git log -1 --format=%cs -- <route file> <its content components>).
const pages = [
  { en: '/', ja: '/ja/', lastModified: '2026-10-06', changeFrequency: 'weekly', priority: 1 },
  { en: '/about/', ja: '/ja/about/', lastModified: '2026-10-05', changeFrequency: 'monthly', priority: 0.8 },
  { en: '/booking/', ja: '/ja/booking/', lastModified: '2026-10-23', changeFrequency: 'monthly', priority: 0.8 },
  { en: '/explore/', ja: '/ja/explore/', lastModified: '2026-10-22', changeFrequency: 'weekly', priority: 0.7 },
  { en: '/web-design/', ja: '/ja/web-design/', lastModified: '2026-10-26', changeFrequency: 'monthly', priority: 0.9 },
  { en: '/privacy/', ja: '/ja/privacy/', lastModified: '2026-10-23', changeFrequency: 'yearly', priority: 0.3 },
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap(({ en, ja, lastModified, changeFrequency, priority }) => {
    const languages = { en: `${siteUrl}${en}`, ja: `${siteUrl}${ja}`, 'x-default': `${siteUrl}${en}` }
    return [en, ja].map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages },
    }))
  })
}
