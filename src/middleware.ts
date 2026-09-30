import { NextRequest, NextResponse } from 'next/server'

// Two decisions at the homepage roots, in this order:
//
// 1) Locale detection, at the English root only. A Japanese-preferring browser is redirected to
//    /ja; a manual toggle choice (NEXT_LOCALE cookie, set by the nav switcher) always wins so
//    detection never overrides the visitor. The redirect is 307 (temporary) so search engines don't
//    treat / as permanently moved — Googlebot sends en/no Accept-Language and stays on the English
//    root.
//
// 2) The underwater intro. A visitor entering the site at / or /ja/ is shown the underwater page
//    (/watermark/ or /ja/watermark/) at that same address, so the address bar keeps saying
//    beedstu.com. Its ENTER THE ROOM button loads the address again, and this time it is the
//    homepage. "Entering" means a page load that doesn't come from the site itself, once a browser
//    session (a session cookie, set with the intro itself, so it can't loop). Clicks within the
//    site, prefetches, search engines, link-preview bots and speed tests always get the homepage,
//    so it keeps its content for everyone who indexes or measures it.

const SUPPORTED = ['en', 'ja'] as const

const INTRO_SEEN = 'beeds_in'
const NOT_A_VISITOR = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|lighthouse|pagespeed|headless/i

function resolveLocale(req: NextRequest): string {
  // 1) Manual choice wins.
  const cookie = req.cookies.get('NEXT_LOCALE')?.value
  if (cookie && (SUPPORTED as readonly string[]).includes(cookie)) return cookie
  // 2) Otherwise the browser's top-preferred language.
  const header = req.headers.get('accept-language') ?? ''
  const first = header.split(',')[0]?.trim().toLowerCase() ?? ''
  return first.startsWith('ja') ? 'ja' : 'en'
}

function entersWithIntro(req: NextRequest): boolean {
  if (req.method !== 'GET' || req.cookies.has(INTRO_SEEN)) return false
  // a page load, not the router's data requests or prefetches
  const dest = req.headers.get('sec-fetch-dest')
  if (dest && dest !== 'document') return false
  if (req.headers.has('rsc') || req.headers.has('next-router-prefetch') || req.headers.get('purpose') === 'prefetch') return false
  if (!(req.headers.get('accept') ?? '').includes('text/html')) return false
  // coming from outside: not a link or a switch within the site
  const referer = req.headers.get('referer')
  if (referer) {
    try { if (new URL(referer).host === req.nextUrl.host) return false } catch {}
  }
  return !NOT_A_VISITOR.test(req.headers.get('user-agent') ?? '')
}

export function middleware(req: NextRequest) {
  const ja = req.nextUrl.pathname.replace(/\/$/, '') === '/ja'
  if (!ja && resolveLocale(req) === 'ja') {
    const url = req.nextUrl.clone()
    url.pathname = '/ja'
    return NextResponse.redirect(url, 307)
  }
  if (entersWithIntro(req)) {
    const url = req.nextUrl.clone()
    url.pathname = ja ? '/ja/watermark/' : '/watermark/'
    const res = NextResponse.rewrite(url)
    res.cookies.set(INTRO_SEEN, '1', { path: '/', sameSite: 'lax' })
    return res
  }
  return NextResponse.next()
}

// Only the two homepage roots. Other paths are unaffected.
export const config = {
  matcher: ['/', '/ja', '/ja/'],
}
