'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
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

  return (
    <>
      <MetaPixel />
      {primaryId && <GoogleTag primaryId={primaryId} gaId={gaId} adsId={adsId} />}
    </>
  )
}

// Meta (Facebook/Instagram) Pixel, for ad measurement and retargeting (2026-10-23). Renders nothing
// unless NEXT_PUBLIC_META_PIXEL_ID is set. The base code counts the first page; client-side page
// changes are counted by the pathname effect below, since the App Router never reloads the page.
// What it sends, and to whom, is disclosed on /privacy/ (Japan's external-transmission rule).
function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const pathname = usePathname()
  const first = useRef(true)
  useEffect(() => {
    if (!pixelId) return
    if (first.current) { first.current = false; return }
    window.fbq?.('track', 'PageView')
  }, [pathname, pixelId])
  if (!pixelId) return null
  return (
    <Script id="meta-pixel" strategy="lazyOnload">
      {`
        !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
        n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
        document,'script','https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `}
    </Script>
  )
}

function GoogleTag({ primaryId, gaId, adsId }: { primaryId: string; gaId?: string; adsId?: string }) {
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
