import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import StudyShowcase from '@/components/sections/StudyShowcase'
import TrendNote from '@/components/sections/TrendNote'
import { getDictionary } from '@/i18n/dictionaries'

const title = 'Explore — Design Trends & Studies | BEEDS'
const description =
  'Where BEEDS tracks what moves people online — scroll-driven storytelling, kinetic type, editorial minimalism, and immersive 3D — with live interactive studies you can scroll through.'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/explore/',
    languages: {
      en: '/explore/',
      ja: '/ja/explore/',
      'x-default': '/explore/',
    },
  },
  openGraph: {
    title,
    description,
    url: '/explore/',
    siteName: 'BEEDS',
    images: [
      {
        url: '/og/beeds-og-hero.png',
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
    title,
    description,
    images: ['/og/beeds-og-hero.png'],
  },
}

export default function ExplorePage() {
  const t = getDictionary('en').explore
  return (
    <>
      <Navigation switchHref="/ja/explore/" />
      <main>
        {/* Lede */}
        <section className="pt-24 pb-16 px-10">
          <div className="container-x">
            <h1 className="text-[23px] leading-[1.35] md:text-5xl md:leading-[1.2] max-w-[900px]">
              {t.heroLines.map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>
          </div>
        </section>

        {/* Interactive studies */}
        <StudyShowcase />

        {/* Design Trends / Journal */}
        <section className="py-14 px-10 bg-white">
          <div className="container-x">
            {/* Point-of-view notice (light editorial, scroll-revealed) */}
            <TrendNote />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
