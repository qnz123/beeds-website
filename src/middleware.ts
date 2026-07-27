import { NextRequest, NextResponse } from 'next/server'

// Locale detection at the English root only. A Japanese-preferring browser is
// redirected to /ja; a manual toggle choice (NEXT_LOCALE cookie, set by the nav
// switcher) always wins so detection never overrides the visitor. The redirect
// is 307 (temporary) so search engines don't treat / as permanently moved —
// Googlebot sends en/no Accept-Language and stays on the English root.

const SUPPORTED = ['en', 'ja'] as const

function resolveLocale(req: NextRequest): string {
  // 1) Manual choice wins.
  const cookie = req.cookies.get('NEXT_LOCALE')?.value
  if (cookie && (SUPPORTED as readonly string[]).includes(cookie)) return cookie
  // 2) Otherwise the browser's top-preferred language.
  const header = req.headers.get('accept-language') ?? ''
  const first = header.split(',')[0]?.trim().toLowerCase() ?? ''
  return first.startsWith('ja') ? 'ja' : 'en'
}

export function middleware(req: NextRequest) {
  if (resolveLocale(req) === 'ja') {
    const url = req.nextUrl.clone()
    url.pathname = '/ja'
    return NextResponse.redirect(url, 307)
  }
  return NextResponse.next()
}

// Only decide at the English homepage root. Other paths are unaffected.
export const config = {
  matcher: ['/'],
}
