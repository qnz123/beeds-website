import Navigation from '@/components/Navigation'
import Hero from '@/components/sections/Hero'
import Portfolio from '@/components/sections/Portfolio'
import Clients from '@/components/sections/Clients'
import VideoPortfolio from '@/components/sections/VideoPortfolio'
import Impact from '@/components/sections/Impact'
import BookingCalendar from '@/components/BookingCalendar'
import Footer from '@/components/Footer'
import type { Locale } from '@/i18n/config'

// Shared homepage, rendered by both the English root (`/`) and Japanese (`/ja`)
// routes. Phase 1: nav, hero, and footer are localized; the remaining sections
// (VideoPortfolio, Portfolio, Clients, Impact, BookingCalendar) still render
// English and will be localized in later phases.
export default function HomeContent({ lang = 'en' as Locale }: { lang?: Locale }) {
  const switchHref = lang === 'ja' ? '/' : '/ja'

  return (
    <>
      <Navigation lang={lang} switchHref={switchHref} />
      <main>
        <Hero lang={lang} />
        <VideoPortfolio />
        <Portfolio />
        <Clients />
        <Impact />
        <BookingCalendar />
      </main>
      <Footer lang={lang} />
    </>
  )
}
