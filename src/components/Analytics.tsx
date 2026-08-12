'use client'

import Script from 'next/script'

// Injects the Google tag (gtag.js) for GA4 and, if configured, Google Ads.
// Renders nothing unless NEXT_PUBLIC_GA_ID (or the Ads tag) is set, so dev and
// preview builds stay untracked. Uses `lazyOnload` (2026-08-12 speed pass) so
// the 185KB gtag bundle waits for the browser's idle time instead of competing
// with the hero during startup — pageview data is unaffected, it just reports
// a moment later. IDs live in env vars — see src/lib/analytics.ts for the list.
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const adsId = process.env.NEXT_PUBLIC_GADS_ID
  // The single gtag.js load can serve both properties; prefer GA4 as the src id.
  const primaryId = gaId ?? adsId
  if (!primaryId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="lazyOnload"
      />
      <Script id="gtag-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${gaId ? `gtag('config', '${gaId}');` : ''}
          ${adsId ? `gtag('config', '${adsId}');` : ''}
        `}
      </Script>
    </>
  )
}
