import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SpeedReading from '@/components/sections/SpeedReading'

// The Speed Reading — free URL speed test, editorial verdict, lead engine.
// Named and spec'd by Zack, architecture by Jane (2026-08-12). English-only
// for now; /ja mirror is a deliberate later step (all UI strings incl. error
// messages would need transcreation).

const title = 'The Speed Reading — free website speed test | BEEDS'
const description =
  'How fast is your website? Google knows. Most owners don’t. Paste your URL — sixty seconds, no signup. Measured by PageSpeed Insights, interpreted by BEEDS.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/speed-reading/' },
  openGraph: {
    title,
    description,
    url: '/speed-reading/',
    siteName: 'BEEDS',
    images: [
      { url: '/og/beeds-og-sticker.png', width: 1200, height: 630, alt: 'BEEDS' },
    ],
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

export default function SpeedReadingPage() {
  return (
    <>
      <Navigation switchHref="/ja/" />
      <main>
        <section className="px-10 pt-24 pb-12">
          <div className="container-x">
            <h2 className="eyebrow mb-8">The Speed Reading</h2>
            <h1 className="max-w-[820px] text-[23px] leading-[1.35] md:text-5xl md:leading-[1.2]">
              How fast is your website? Google knows. Most owners don&rsquo;t.
            </h1>
            <p className="mt-6 max-w-[560px] text-base leading-[1.7] text-[#666]">
              Paste your URL. Sixty seconds. No signup.
            </p>
          </div>
        </section>
        <SpeedReading />
      </main>
      <Footer />
    </>
  )
}
