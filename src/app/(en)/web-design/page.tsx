import type { Metadata } from 'next'
import WebDesignPage from '@/components/WebDesignPage'

const title = 'Website Design Studio, Tokyo and New York | BEEDS'
const description =
  'Fast, beautiful websites with motion and 3D, plus the video to fill them, for brands in the U.S. and Japan. From $7,500. See your new homepage free first.'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/web-design/',
    languages: { en: '/web-design/', ja: '/ja/web-design/', 'x-default': '/web-design/' },
  },
  openGraph: {
    title,
    description,
    url: '/web-design/',
    siteName: 'BEEDS',
    images: [{ url: '/og/beeds-og-sticker.png', width: 1200, height: 630, alt: 'BEEDS' }],
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

export default function Page() {
  return <WebDesignPage lang="en" />
}
