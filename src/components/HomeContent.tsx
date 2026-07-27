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
// routes. Localized so far: nav, hero, footer, VideoPortfolio + Clients headings.
// Still English (later phases): Portfolio folio copy, Impact, and the
// BookingCalendar concierge (which needs Japanese word-order restructuring).
export default function HomeContent({ lang = 'en' as Locale }: { lang?: Locale }) {
  const switchHref = lang === 'ja' ? '/' : '/ja'

  return (
    <>
      <Navigation lang={lang} switchHref={switchHref} />
      <main>
        <Hero lang={lang} />
        <VideoPortfolio lang={lang} />
        <Portfolio />
        <Clients lang={lang} />
        <Impact />
        <BookingCalendar />
      </main>
      <Footer lang={lang} />
    </>
  )
}
