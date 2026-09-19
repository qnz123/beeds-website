import { NextRequest, NextResponse } from 'next/server'
import {
  SpeedCheckSchema,
  runPagespeed,
  isRateLimited,
  cacheGet,
  cacheSet,
  speedError,
  normalizeUrl,
  type SpeedCheckError,
  type SpeedCheckResult,
} from '@/lib/psi'

// The Speed Reading engine: POST { url } → runs Google PageSpeed Insights
// (mobile) server-side and returns the slimmed SpeedCheckResult. PSI runs
// take 20–60s, so this route MUST declare maxDuration — Vercel's default
// (10–15s) would kill the function mid-run and the client would see a bare
// platform 504 with no JSON to parse. The fetch itself aborts at 55s so we
// always answer with clean JSON before the platform ceiling.

export const runtime = 'nodejs'
export const maxDuration = 60

const statusFor: Record<SpeedCheckError['code'], number> = {
  invalid_url: 400,
  rate_limited: 429,
  psi_quota: 429,
  psi_unreachable_site: 422,
  psi_error: 502,
  timeout: 504,
  config_error: 503,
}

function errorResponse(err: SpeedCheckError) {
  return NextResponse.json(err, { status: statusFor[err.code] })
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return errorResponse(speedError('invalid_url'))
  }

  const parsed = SpeedCheckSchema.safeParse(body)
  if (!parsed.success) return errorResponse(speedError('invalid_url'))

  // Honeypot: accept silently — a plausible success shape costs no PSI quota
  // and gives a scraper nothing to distinguish from a real check (an error
  // response would just invite a retry). Same accepted-silently pattern as
  // /api/speed-check/email.
  if (parsed.data.company.trim()) {
    const honeypotResult: SpeedCheckResult = {
      ok: true,
      requestedUrl: parsed.data.url,
      finalUrl: parsed.data.url,
      strategy: 'mobile',
      score: 0,
      metrics: {
        lcp: { value: 0, displayValue: '—' },
        cls: { value: 0, displayValue: '—' },
        tbt: { value: 0, displayValue: '—' },
      },
      screenshot: null,
      fieldData: null,
      fetchedAt: new Date().toISOString(),
    }
    return NextResponse.json(honeypotResult)
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const url = normalizeUrl(parsed.data.url)

  const cached = cacheGet(url)
  if (cached) return NextResponse.json(cached)

  if (isRateLimited(ip)) return errorResponse(speedError('rate_limited'))

  try {
    const result = await runPagespeed(url)
    cacheSet(url, result)
    console.log(`[speed-check] ${url} → ${result.score} (${result.metrics.lcp.displayValue})`)
    return NextResponse.json(result)
  } catch (e) {
    const err =
      e && typeof e === 'object' && 'ok' in e && (e as SpeedCheckError).ok === false
        ? (e as SpeedCheckError)
        : speedError('psi_error')
    console.warn(`[speed-check] ${url} failed: ${err.code}`)
    return errorResponse(err)
  }
}
