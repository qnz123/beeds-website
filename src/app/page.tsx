import Navigation from '@/components/Navigation'
import Hero from '@/components/sections/Hero'
import Portfolio from '@/components/sections/Portfolio'
import Clients from '@/components/sections/Clients'
import VideoPortfolio from '@/components/sections/VideoPortfolio'
import Impact from '@/components/sections/Impact'
import BookingCalendar from '@/components/BookingCalendar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <VideoPortfolio />
        <Portfolio />
        <Clients />
        <Impact />
        <BookingCalendar />
      </main>
      <Footer />
    </>
  )
}
