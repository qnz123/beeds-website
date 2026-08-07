import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import StudyShowcase from '@/components/sections/StudyShowcase'
import TrendNote from '@/components/sections/TrendNote'

const title = 'Explore — Design Trends & Studies | BEEDS'
const description =
  'Where BEEDS tracks what moves people online — scroll-driven storytelling, kinetic type, editorial minimalism, and immersive 3D — with live interactive studies you can scroll through.'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/explore/',
    languages: { en: '/explore/', 'x-default': '/explore/' },
  },
  openGraph: {
    title,
    description,
    url: '/explore/',
    siteName: 'BEEDS',
    images: [
      {
        url: '/logo/beeds-butterfly-black.png',
        width: 1024,
        height: 1024,
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
    images: ['/logo/beeds-butterfly-black.png'],
  },
}

export default function ExplorePage() {
  return (
    <>
      <Navigation switchHref="/ja/" />
      <main>
        {/* Lede */}
        <section className="pt-24 pb-16 px-10">
          <div className="container-x">
            <h2 className="eyebrow mb-8">Explore</h2>
            <h1 className="text-[23px] leading-[1.35] md:text-5xl md:leading-[1.2] max-w-[900px]">
              What’s moving people online — and the work that proves it.
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
