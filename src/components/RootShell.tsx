import '@/app/globals.css'
import Analytics from '@/components/Analytics'
import StructuredData from '@/components/StructuredData'
import type { Locale } from '@/i18n/config'

// Shared <html> shell for both root layouts: app/(en)/layout.tsx serves English with lang="en", app/(ja)/layout.tsx
// serves /ja/* with lang="ja". Two root layouts (route groups) are what let the server-rendered <html lang> follow the
// locale without making every page dynamic. URLs are unchanged; the language toggle is a plain <a>, a full load anyway.
export default function RootShell({
  lang,
  children,
}: {
  lang: Locale
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning: the head script below may add `arrive` to this element's class before
    // React hydrates it. It covers this element's own attributes only, nothing inside it.
    // The ground colour inline, not only in the stylesheet: a browser that paints a page before its
    // stylesheets arrive (Firefox, between pages) then paints the ground, never white.
    <html lang={lang} suppressHydrationWarning style={{ backgroundColor: '#f5f5f5' }}>
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
        {/* A refresh of the homepage on a phone comes back by way of the
            intro (lib/introReload.ts), as a fresh load, so the browser has no
            place to restore: put the visitor back where the page last was,
            held briefly as the other scripts here do and given up the moment
            they scroll themselves. On a desktop a refresh starts at the top,
            as above. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('beeds:restore')){sessionStorage.removeItem('beeds:restore');var s=JSON.parse(sessionStorage.getItem('beeds:place')||'null'),p=location.pathname.replace(/\\/$/,'')||'/';if(s&&s.p===p&&s.y>0&&matchMedia('(max-width: 767px)').matches){if('scrollRestoration' in history){history.scrollRestoration='manual'}var go=true,t0=Date.now(),off=function(){go=false};addEventListener('wheel',off,{passive:true,once:true});addEventListener('touchstart',off,{passive:true,once:true});addEventListener('keydown',off,{once:true});(function tick(){if(!go||Date.now()-t0>1500)return;requestAnimationFrame(tick);if(Math.abs(window.scrollY-s.y)>2){window.scrollTo({top:s.y,left:0,behavior:'instant'})}})()}}}catch(e){}",
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
            fades its content up from the ground (html.arrive in globals.css).
            Read and cleared here, before the first paint, so the content is
            down from the very first frame and a later reload does not replay
            it. */}
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
        <StructuredData lang={lang} />
        {children}
      </body>
    </html>
  )
}
