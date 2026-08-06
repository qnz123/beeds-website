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

// A design-trend entry: our human read on a movement — title + point of view.
type TrendEntry = {
  trend: string
  take: string
}

const TRENDS: TrendEntry[] = [
  {
    trend: 'Scroll as narrative',
    take: 'The scrollbar has become the storyline. The best product pages no longer stack sections — they choreograph a reveal, letting a single object turn, open, and explain itself as you move. Pacing is the new layout.',
  },
  {
    trend: 'Type with a pulse',
    take: 'Brutalist, kinetic typography is back with intent — oversized, confident, and in motion. Words slam, snap, and marquee across the frame, carrying the brand’s attitude before a single product shot loads. The typeface is the campaign.',
  },
  {
    trend: 'The quiet product',
    take: 'At the other pole, restraint sells. Ingredient-led, lowercase, pastel calm — space and softness signal quality and let the product breathe. Minimalism here is not empty; it is edited.',
  },
  {
    trend: 'One bold dimension',
    take: 'Real-time 3D has left the tech demo and entered flagship retail — a single hero object you can turn, configure, and inhabit in the browser. Used with restraint, one dimensional moment does what a hundred photos can’t.',
  },
]

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
            <p className="mt-8 text-sm md:text-base leading-[1.7] text-[#666] max-w-[640px]">
              A running notebook of the trends shaping digital brands, paired with
              live studies you can scroll through. Part journal, part playground.
            </p>
          </div>
        </section>

        {/* Interactive studies */}
        <StudyShowcase />

        {/* Design Trends / Journal */}
        <section className="py-14 px-10 border-t border-black bg-white">
          <div className="container-x">
            <h2 className="eyebrow mb-8">Design Trends — Journal</h2>

            {/* Point-of-view notice (light editorial, scroll-revealed) */}
            <TrendNote />

            <div className="border-t border-black">
              {TRENDS.map((entry) => (
                <article
                  key={entry.trend}
                  className="py-8 border-b border-black"
                >
                  <div className="max-w-[760px]">
                    <h3 className="text-2xl md:text-3xl leading-[1.2] mb-3">
                      {entry.trend}
                    </h3>
                    <p className="text-sm leading-[1.7] text-[#666]">
                      {entry.take}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
