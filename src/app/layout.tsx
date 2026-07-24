import type { Metadata, Viewport } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics'

// Falls back to the production domain if NEXT_PUBLIC_SITE_URL isn't set in
// the deploy environment; update the env var (or this default) if the
// production domain ever changes.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beedstu.com'

const title = 'BEEDS — Creative Strategy, AI Enablement & Production'
const description =
  "Tokyo/New York creative studio since 2012 — creative strategy, AI enablement, production, and APAC/U.S. market expansion for Condé Nast, Verizon, Nestlé, Victoria's Secret, and Shangri-La."

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
        url: '/logo/beeds-butterfly-black.png',
        width: 1024,
        height: 1024,
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
    images: ['/logo/beeds-butterfly-black.png'],
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
    <html lang="en">
      <head>
        {/* Warm up the Vimeo connections so the featured film starts sooner. */}
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://i.vimeocdn.com" />
        <link rel="preconnect" href="https://f.vimeocdn.com" />
        <link rel="dns-prefetch" href="https://player.vimeo.com" />
      </head>
      <body className="antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  )
}
