// Lightweight, SSR-safe analytics helpers.
//
// Everything here no-ops unless the corresponding env vars are set, so the
// site behaves identically in dev / preview (no IDs) and only reports in
// production. IDs are injected by `components/Analytics.tsx`.
//
//   NEXT_PUBLIC_GA_ID                 — GA4 Measurement ID   e.g. G-XXXXXXXXXX
//   NEXT_PUBLIC_GADS_ID               — Google Ads tag ID    e.g. AW-1234567890
//   NEXT_PUBLIC_GADS_CONVERSION_LABEL — Ads conversion label e.g. AbC-D_efG

type GtagParams = Record<string, unknown>

declare global {
  interface Window {
    // gtag is added by the script tags in components/Analytics.tsx
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

const hasGtag = () => typeof window !== 'undefined' && typeof window.gtag === 'function'

/** Fire a GA4 event. Safe to call anywhere; no-ops if gtag isn't loaded. */
export function trackEvent(name: string, params: GtagParams = {}) {
  if (!hasGtag()) return
  window.gtag!('event', name, params)
}

/**
 * Report a Google Ads conversion. No-ops unless both the Ads tag ID and the
 * conversion label are configured. `params` can carry value/currency, etc.
 */
export function trackConversion(params: GtagParams = {}) {
  if (!hasGtag()) return
  const adsId = process.env.NEXT_PUBLIC_GADS_ID
  const label = process.env.NEXT_PUBLIC_GADS_CONVERSION_LABEL
  if (!adsId || !label) return
  window.gtag!('event', 'conversion', { send_to: `${adsId}/${label}`, ...params })
}
