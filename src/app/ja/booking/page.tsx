import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import BookingCalendar from '@/components/BookingCalendar'
import Footer from '@/components/Footer'

const title = 'セッションのご予約 — BEEDS'
const description = 'BEEDSのクリエイティブセッションをご予約ください。'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/ja/booking/',
    languages: { en: '/booking/', ja: '/ja/booking/', 'x-default': '/booking/' },
  },
  openGraph: {
    title,
    description,
    url: '/ja/booking/',
    siteName: 'BEEDS',
    type: 'website',
    locale: 'ja_JP',
    images: [{ url: '/og/beeds-og-sticker.png', width: 1200, height: 630, alt: 'BEEDS' }],
  },
}

export default function BookingPageJa() {
  return (
    <>
      <Navigation lang="ja" switchHref="/booking/" />
      <main>
        <BookingCalendar lang="ja" />
      </main>
      <Footer lang="ja" />
    </>
  )
}
