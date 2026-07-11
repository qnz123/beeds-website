import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import BookingCalendar from '@/components/BookingCalendar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Book A Session - BEEDS',
  description: 'Schedule a creative session with the BEEDS team.',
}

export default function BookingPage() {
  return (
    <>
      <Navigation />
      <main>
        <BookingCalendar />
      </main>
      <Footer />
    </>
  )
}
