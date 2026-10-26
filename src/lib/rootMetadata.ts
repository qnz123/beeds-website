import type { Metadata, Viewport } from 'next'

// Falls back to the production domain if NEXT_PUBLIC_SITE_URL isn't set in
// the deploy environment; update the env var (or this default) if the
// production domain ever changes.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beedstu.com'

export const siteTitle = 'BEEDS — Creative Strategy, AI Enablement & Production'
const description =
  'Innovation-first media studio pairing human strategists with AI to keep every brand on point — creative strategy, video production, and platforms across Tokyo and the U.S.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteTitle,
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
    title: siteTitle,
    description,
    images: ['/og/beeds-og-sticker.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

