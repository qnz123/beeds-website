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
    canonical: '/ja/booking',
    languages: { en: '/booking', ja: '/ja/booking', 'x-default': '/booking' },
  },
  openGraph: { title, description, url: '/ja/booking', locale: 'ja_JP', type: 'website' },
}

export default function BookingPageJa() {
  return (
    <>
      <Navigation lang="ja" switchHref="/booking" />
      <main>
        <BookingCalendar lang="ja" />
      </main>
      <Footer lang="ja" />
    </>
  )
}
