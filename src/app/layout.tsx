import type { Metadata, Viewport } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics'
import StructuredData from '@/components/StructuredData'

// Falls back to the production domain if NEXT_PUBLIC_SITE_URL isn't set in
// the deploy environment; update the env var (or this default) if the
// production domain ever changes.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beedstu.com'

const title = 'BEEDS — Creative Strategy, AI Enablement & Production'
const description =
  'Innovation-first media studio pairing human strategists with AI to keep every brand on point — creative strategy, video production, and platforms across Tokyo and the U.S.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'BEEDS',
    // TODO: swap in a dedicated 1200x630 social share image once designed —
    // the butterfly mark is the only sensible existing asset (square, so
    // some crawlers will letterbox it) and stands in until then.
    images: [
      {
        url: '/og/beeds-og-sticker.png',
        width: 1200,
        height: 630,
        alt: 'BEEDS',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og/beeds-og-sticker.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning: the head script below may add `arrive` to this element's class before
    // React hydrates it. It covers this element's own attributes only, nothing inside it.
    // The ground colour inline, not only in the stylesheet: a browser that paints a page before its
    // stylesheets arrive (Firefox, between pages) then paints the ground, never white.
    <html lang="en" suppressHydrationWarning style={{ backgroundColor: '#f5f5f5' }}>
      <head>
        {/* Refreshing the homepage starts at the top. The hero plays its
            entrance on every fresh load, and the browser would otherwise put
            the visitor back in the middle of the page with the animation
            already over. Asking for manual restoration is not enough on its
            own — Chrome still restores on a reload — so the top is held
            briefly and given up the moment the visitor scrolls themselves.
            Only reloads of the two home routes, and never when the URL
            carries a #work or #contact target. Not on phones: there a
            refresh keeps the visitor on the section they were reading
            (his ask, 2026-10-01), as every other page already does. Inline and in the head so it
            runs before the browser has a chance to restore. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var p=location.pathname;if((p==='/'||p==='/ja'||p==='/ja/')&&!location.hash&&!matchMedia('(max-width: 767px)').matches){var n=performance.getEntriesByType('navigation')[0];if(n&&n.type==='reload'){if('scrollRestoration' in history){history.scrollRestoration='manual'}var go=true,t0=Date.now(),off=function(){go=false};addEventListener('wheel',off,{passive:true,once:true});addEventListener('touchstart',off,{passive:true,once:true});addEventListener('keydown',off,{once:true});(function tick(){if(!go||Date.now()-t0>1500)return;if(window.scrollY){window.scrollTo({top:0,left:0,behavior:'instant'})}requestAnimationFrame(tick)})()}}}catch(e){}",
          }}
        />
        {/* Refreshing a page opened at a #section (Services, from the menu):
            Safari forgets both the restored position and the #target and starts
            at the top, so the section the visitor was reading disappears (his
            report, 2026-10-01). Only when the browser has restored nothing —
            Chrome keeps the position itself, and this must not pull a visitor
            who refreshed further down the page back up to the target. It is
            held for a moment, as the homepage's top is above, because Safari
            puts the page back at the top again after load, and given up the
            moment the visitor scrolls themselves. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var h=location.hash;var n=performance.getEntriesByType('navigation')[0];if(h&&h.length>1&&n&&n.type==='reload'){var id=decodeURIComponent(h.slice(1)),t0=Date.now(),go=true,off=function(){go=false};addEventListener('wheel',off,{passive:true,once:true});addEventListener('touchstart',off,{passive:true,once:true});addEventListener('keydown',off,{once:true});(function tick(){if(!go||Date.now()-t0>1200)return;requestAnimationFrame(tick);if(window.scrollY>20)return;var el=document.getElementById(id);if(!el)return;var y=el.getBoundingClientRect().top+window.scrollY-70;if(y>20){window.scrollTo({top:y,left:0,behavior:'instant'})}})()}}catch(e){}",
          }}
        />
        {/* Arriving from /watermark/: that page leaves a note in this tab's
            session storage just before it navigates, and the page it opens
            fades up from the ground (html.arrive in globals.css). Read and
            cleared here, before the first paint, so the veil is there from the
            very first frame and a later reload does not replay it. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('beeds:arrive')){sessionStorage.removeItem('beeds:arrive');document.documentElement.classList.add('arrive')}}catch(e){}",
          }}
        />
        {/* Warm up the Vimeo connections so the featured film starts sooner. */}
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://i.vimeocdn.com" />
        <link rel="preconnect" href="https://f.vimeocdn.com" />
        <link rel="dns-prefetch" href="https://player.vimeo.com" />
      </head>
      <body className="antialiased">
        <Analytics />
        <StructuredData />
        {children}
      </body>
    </html>
  )
}
