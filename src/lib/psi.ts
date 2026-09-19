import { z } from 'zod'

// PageSpeed Insights plumbing for The Speed Reading (/speed-reading).
// Owns: URL validation, the PSI call + response slimming, and the soft
// per-instance rate-limit / result caches. Both /api/speed-check routes
// import from here (per Jane's spec, 2026-08-12) so neither re-implements
// the shapes.

// ---------- shapes ----------

export type SpeedMetric = { value: number; displayValue: string }

export type SpeedCheckResult = {
  ok: true
  requestedUrl: string
  finalUrl: string
  strategy: 'mobile'
  score: number // 0–100
  metrics: {
    lcp: SpeedMetric // seconds
    cls: SpeedMetric // unitless
    tbt: SpeedMetric // ms
  }
  screenshot: string | null // data: URI from PSI's final-screenshot audit
  fieldData: {
    lcp?: { category: string; percentile: number }
    cls?: { category: string; percentile: number }
  } | null
  fetchedAt: string
}

export type SpeedCheckErrorCode =
  | 'invalid_url'
  | 'rate_limited'
  | 'psi_quota'
  | 'psi_unreachable_site'
  | 'psi_error'
  | 'timeout'
  | 'config_error'

export type SpeedCheckError = {
  ok: false
  code: SpeedCheckErrorCode
  message: string
}

export const ERROR_MESSAGES: Record<SpeedCheckErrorCode, string> = {
  invalid_url:
    "That doesn't look like a valid website address. Check it and try again.",
  rate_limited:
    "You've just run a reading — give it a minute before trying another.",
  psi_quota:
    "We're getting a lot of traffic right now. Try again in a few minutes.",
  psi_unreachable_site:
    "We couldn't load that site — check the URL is public and reachable, then try again.",
  psi_error: 'The speed check service hit a snag. Please try again shortly.',
  timeout:
    'That site is taking unusually long to test. Try again — some sites need a second attempt.',
  config_error: 'Speed readings are temporarily unavailable. Please check back soon.',
}

export function speedError(code: SpeedCheckErrorCode): SpeedCheckError {
  return { ok: false, code, message: ERROR_MESSAGES[code] }
}

// ---------- validation ----------

export const UrlSchema = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .transform((s) => (/^https?:\/\//i.test(s) ? s : `https://${s}`))
  .pipe(
    z
      .string()
      .url()
      .superRefine((s, ctx) => {
        let u: URL
        try {
          u = new URL(s)
        } catch {
          ctx.addIssue({ code: 'custom', message: 'Not a valid URL' })
          return
        }
        if (!['http:', 'https:'].includes(u.protocol)) {
          ctx.addIssue({ code: 'custom', message: 'Only http/https URLs are supported' })
        }
        if (!u.hostname.includes('.') || u.hostname === 'localhost') {
          ctx.addIssue({ code: 'custom', message: 'Enter a public website URL' })
        }
        if (u.username || u.password) {
          ctx.addIssue({ code: 'custom', message: 'URL must not contain credentials' })
        }
      }),
  )

export const SpeedCheckSchema = z.object({
  url: UrlSchema,
  company: z.string().max(200).optional().default(''), // honeypot
})

// ---------- soft rate limit + cache ----------
// Module-scope Maps: per-serverless-instance only — they reset on cold start
// and aren't shared across concurrent instances. This is polite throttling
// against a looping tab, not a hard cap; the PSI API key's own daily quota is
// the real backstop.

const lastRequestByIp = new Map<string, number>()
const RATE_WINDOW_MS = 30_000

export function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const last = lastRequestByIp.get(ip)
  if (last && now - last < RATE_WINDOW_MS) return true
  lastRequestByIp.set(ip, now)
  // keep the map from growing unbounded on a long-lived instance
  if (lastRequestByIp.size > 5000) lastRequestByIp.clear()
  return false
}

const resultCache = new Map<string, { result: SpeedCheckResult; expiresAt: number }>()
const CACHE_TTL_MS = 10 * 60_000

export function cacheGet(url: string): SpeedCheckResult | null {
  const hit = resultCache.get(url)
  if (hit && hit.expiresAt > Date.now()) return hit.result
  if (hit) resultCache.delete(url)
  return null
}

export function cacheSet(url: string, result: SpeedCheckResult) {
  resultCache.set(url, { result, expiresAt: Date.now() + CACHE_TTL_MS })
  if (resultCache.size > 500) resultCache.clear()
}

// ---------- url normalization ----------
// Strips the parts that don't change what PSI actually tests (hash,
// embedded credentials) so cacheGet/cacheSet and runPagespeed agree on one
// key — otherwise "example.com" and "example.com/#pricing" burn separate
// PSI quota for what is effectively the same test.

export function normalizeUrl(url: string): string {
  const u = new URL(url)
  u.hash = ''
  u.username = ''
  u.password = ''
  return u.toString()
}

// ---------- the PSI call ----------

let warnedNoKey = false

/**
 * Runs PSI (mobile) against a validated URL and slims the multi-MB response
 * to SpeedCheckResult. Throws SpeedCheckError-shaped objects on failure.
 * timeoutMs should sit a few seconds under the route's maxDuration so we
 * return clean JSON instead of Vercel hard-killing the function.
 */
export async function runPagespeed(
  url: string,
  timeoutMs = 55_000,
): Promise<SpeedCheckResult> {
  const key = process.env.PAGESPEED_API_KEY
  if (!key && !warnedNoKey) {
    console.warn('PAGESPEED_API_KEY not set — using unauthenticated PSI quota')
    warnedNoKey = true
  }

  const clean = new URL(normalizeUrl(url))

  const psi = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
  psi.searchParams.set('url', clean.toString())
  psi.searchParams.set('strategy', 'mobile')
  psi.searchParams.set('category', 'performance')
  if (key) psi.searchParams.set('key', key)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  let res: Response
  try {
    res = await fetch(psi.toString(), { signal: controller.signal })
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw speedError('timeout')
    throw speedError('psi_error')
  } finally {
    clearTimeout(timer)
  }

  type PsiErrorBody = {
    error?: { code?: number; message?: string; errors?: { reason?: string }[] }
  }

  if (!res.ok) {
    let body: PsiErrorBody = {}
    try {
      body = (await res.json()) as PsiErrorBody
    } catch {
      /* non-JSON error body */
    }
    const reasons = (body.error?.errors ?? []).map((e) => e.reason ?? '')
    if (res.status === 429) throw speedError(key ? 'psi_quota' : 'config_error')
    if (
      reasons.some((r) =>
        ['FAILED_DOCUMENT_REQUEST', 'INSPECT_HTML_ERROR', 'DNS_FAILURE'].includes(r),
      ) ||
      /unable to.*load|net::|FAILED_DOCUMENT/i.test(body.error?.message ?? '')
    ) {
      throw speedError('psi_unreachable_site')
    }
    if (res.status === 400) throw speedError('psi_unreachable_site')
    throw speedError('psi_error')
  }

  // `any` here is deliberate: PSI's response is an untyped multi-MB JSON blob
  // and we only pick out the handful of fields we slim into SpeedCheckResult.
  // (No disable comment needed — this project's eslint config, next/core-web-vitals,
  // doesn't register @typescript-eslint/no-explicit-any; a disable directive for
  // it errors as "rule not found" instead of doing anything.)
  let data: any
  try {
    data = await res.json()
  } catch {
    throw speedError('psi_error')
  }

  const lh = data.lighthouseResult
  const perf = lh?.categories?.performance?.score
  if (!lh || typeof perf !== 'number') throw speedError('psi_unreachable_site')

  const audit = (id: string): SpeedMetric => ({
    value: Number(lh.audits?.[id]?.numericValue ?? 0),
    displayValue: String(lh.audits?.[id]?.displayValue ?? '—'),
  })

  const fieldMetrics = data.loadingExperience?.metrics
  const field = fieldMetrics
    ? {
        lcp: fieldMetrics.LARGEST_CONTENTFUL_PAINT_MS
          ? {
              category: String(fieldMetrics.LARGEST_CONTENTFUL_PAINT_MS.category),
              percentile: Number(fieldMetrics.LARGEST_CONTENTFUL_PAINT_MS.percentile),
            }
          : undefined,
        cls: fieldMetrics.CUMULATIVE_LAYOUT_SHIFT_SCORE
          ? {
              category: String(fieldMetrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.category),
              percentile: Number(fieldMetrics.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile),
            }
          : undefined,
      }
    : null

  return {
    ok: true,
    requestedUrl: clean.toString(),
    finalUrl: String(lh.finalDisplayedUrl ?? lh.finalUrl ?? clean.toString()),
    strategy: 'mobile',
    score: Math.round(perf * 100),
    metrics: {
      lcp: audit('largest-contentful-paint'),
      cls: audit('cumulative-layout-shift'),
      tbt: audit('total-blocking-time'),
    },
    screenshot: lh.audits?.['final-screenshot']?.details?.data ?? null,
    fieldData: field && (field.lcp || field.cls) ? field : null,
    fetchedAt: new Date().toISOString(),
  }
}
