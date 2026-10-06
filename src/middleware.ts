import { NextRequest, NextResponse } from 'next/server'

// Two decisions at the homepage roots, in this order:
//
// 1) Language, from the visitor's own device and browser setting (Accept-Language), never their
//    location (his ask, 2026-10-06: "my Mac and browser are in English"). A Japanese-preferring
//    browser at / goes to /ja, and a browser preferring anything else that opens /ja from outside
//    goes to /. The nav's 日本語 / English toggle wins, but only for that visit: it sets a SESSION
//    cookie (beeds_lang), so the next visit follows the device again. (The old NEXT_LOCALE cookie
//    lasted a year and kept a visitor in the language they once clicked, whatever their device
//    said; it is ignored and cleared.) Redirects are 307 (temporary), and only real visitors are
//    moved: search engines and link previews send no or a fixed Accept-Language, and must still
//    reach and index both /ja and /.
//
// 2) The underwater intro. A visitor entering the site at / or /ja/ is shown the underwater page
//    (/watermark/ or /ja/watermark/) at that same address, so the address bar keeps saying
//    beedstu.com. Its ENTER THE ROOM button loads the address again, and this time it is the
//    homepage. "Entering" means a page load that doesn't come from the site itself: opening the
//    address, a bookmark, a link from elsewhere, or a reload. The cookie below is only a brief
//    guard against looping, not a once-a-visit rule — he asked (2026-10-01) that coming from the
//    browser always start here. Clicks within the site, prefetches, search engines, link-preview
//    bots and speed tests always get the homepage, so it keeps its content for everyone who
//    indexes or measures it.

const SUPPORTED = ['en', 'ja'] as const

// A new name (2026-10-01): the first version of this cookie had no expiry, and because the intro is
// skipped whenever the cookie is there, that one was never replaced — it sat in the browser blocking
// the water until the visitor quit the browser altogether. Reading a new name ignores those, and
// this one is always written with an expiry, so it can never get stuck the same way.
const INTRO_SEEN = 'beeds_intro'
const INTRO_SEEN_LEGACY = 'beeds_in'
// Only a few seconds, and never renewed: long enough to carry ENTER THE ROOM through to the
// homepage in a browser that sends no referer, short enough that any later arrival from outside —
// a link from a post, the address typed again — is the water (his ask, 2026-10-01: links always
// land on the intro). A refresh, which Safari can't be told apart from an arrival here, is taken
// back to the page the tab was on by the intro page itself (lib/introReload.ts).
const INTRO_GUARD_S = 10
const NOT_A_VISITOR = /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|whatsapp|telegram|discord|lighthouse|pagespeed|headless/i

const LANG_CHOICE = 'beeds_lang'
const LANG_CHOICE_LEGACY = 'NEXT_LOCALE'

/** The toggle's choice for this visit, if the visitor made one. */
function chosenLocale(req: NextRequest): string | null {
  const v = req.cookies.get(LANG_CHOICE)?.value
  return v && (SUPPORTED as readonly string[]).includes(v) ? v : null
}

/** The device's language: the browser's top preference, or null if it sent none (most bots). */
function deviceLocale(req: NextRequest): string | null {
  const header = req.headers.get('accept-language')
  if (!header) return null
  const first = header.split(',')[0]?.trim().toLowerCase() ?? ''
  if (!first || first === '*') return null
  return first.startsWith('ja') ? 'ja' : 'en'
}

/** A visitor's own page load, not a bot, a preview, a prefetch or the router's data request. */
function isVisitorPageLoad(req: NextRequest): boolean {
  if (req.method !== 'GET') return false
  const dest = req.headers.get('sec-fetch-dest')
  if (dest && dest !== 'document') return false
  if (req.headers.has('rsc') || req.headers.has('next-router-prefetch') || req.headers.get('purpose') === 'prefetch') return false
  return !NOT_A_VISITOR.test(req.headers.get('user-agent') ?? '')
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
  const want = chosenLocale(req) ?? (isVisitorPageLoad(req) ? deviceLocale(req) : null)
  if (want && (want === 'ja') !== ja) {
    const url = req.nextUrl.clone()
    url.pathname = want === 'ja' ? '/ja' : '/'
    const res = NextResponse.redirect(url, 307)
    if (req.cookies.has(LANG_CHOICE_LEGACY)) res.cookies.delete(LANG_CHOICE_LEGACY)
    return res
  }
  if (entersWithIntro(req)) {
    const url = req.nextUrl.clone()
    url.pathname = ja ? '/ja/watermark/' : '/watermark/'
    const res = NextResponse.rewrite(url)
    res.cookies.set(INTRO_SEEN, '1', { path: '/', sameSite: 'lax', maxAge: INTRO_GUARD_S })
    if (req.cookies.has(INTRO_SEEN_LEGACY)) res.cookies.delete(INTRO_SEEN_LEGACY)
    if (req.cookies.has(LANG_CHOICE_LEGACY)) res.cookies.delete(LANG_CHOICE_LEGACY)
    return res
  }
  if (req.cookies.has(LANG_CHOICE_LEGACY)) {
    const res = NextResponse.next()
    res.cookies.delete(LANG_CHOICE_LEGACY)
    return res
  }
  return NextResponse.next()
}

// Only the two homepage roots. Other paths are unaffected.
export const config = {
  matcher: ['/', '/ja', '/ja/'],
}
