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
// routes. Localized: nav, hero, footer, VideoPortfolio + Clients headings, the
// Portfolio folio, and the BookingCalendar concierge. Still English: the Impact
// section (later phase).
export default function HomeContent({ lang = 'en' as Locale }: { lang?: Locale }) {
  const switchHref = lang === 'ja' ? '/' : '/ja'

  return (
    <>
      <Navigation lang={lang} switchHref={switchHref} />
      <main>
        <Hero lang={lang} />
        <VideoPortfolio lang={lang} />
        <Portfolio lang={lang} />
        <Clients lang={lang} />
        <Impact lang={lang} />
        <BookingCalendar lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  )
}
