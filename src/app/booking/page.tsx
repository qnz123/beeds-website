import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import BookingCalendar from '@/components/BookingCalendar'
import Footer from '@/components/Footer'

const bookingTitle = 'Book A Session - BEEDS'
const bookingDescription = 'Schedule a creative session with the BEEDS team.'

export const metadata: Metadata = {
  title: bookingTitle,
  description: bookingDescription,
  alternates: {
    canonical: '/booking/',
    languages: { en: '/booking/', ja: '/ja/booking/', 'x-default': '/booking/' },
  },
  openGraph: {
    title: bookingTitle,
    description: bookingDescription,
    url: '/booking/',
    siteName: 'BEEDS',
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
    title: bookingTitle,
    description: bookingDescription,
    images: ['/og/beeds-og-sticker.png'],
  },
}

export default function BookingPage() {
  return (
    <>
      <Navigation switchHref="/ja/booking/" />
      <main>
        <BookingCalendar />
      </main>
      <Footer />
    </>
  )
}
