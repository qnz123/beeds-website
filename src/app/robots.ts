import type { MetadataRoute } from 'next'

// Required for `output: 'export'` — without it, reading process.env below
// makes Next.js treat this route as dynamic, which static export can't emit.
export const dynamic = 'force-static'

// Mirrors the fallback in layout.tsx: falls back to the production domain if
// NEXT_PUBLIC_SITE_URL isn't set in the deploy environment.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beedstu.com'

// Static export (see next.config.js `output: 'export'`) pre-renders this to
// a plain robots.txt at build time — no server required.
//
// /terms is not disallowed here on purpose: robots.txt is public, so a
// Disallow rule would broadcast the URL more loudly than just leaving it out
// of the sitemap. It stays crawlable-but-unlinked, matching client direction.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
