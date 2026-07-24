'use client'

import Script from 'next/script'

// Injects the Google tag (gtag.js) for GA4 and, if configured, Google Ads.
// Renders nothing unless NEXT_PUBLIC_GA_ID (or the Ads tag) is set, so dev and
// preview builds stay untracked. Uses `afterInteractive` so it never blocks the
// hero paint. IDs live in env vars — see src/lib/analytics.ts for the list.
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
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
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
