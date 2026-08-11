import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import StudyShowcase from '@/components/sections/StudyShowcase'
import TrendNote from '@/components/sections/TrendNote'
import { getDictionary } from '@/i18n/dictionaries'

// Japanese mirror of /explore — client-supplied transcreation (2026-08-11).
// The interactive studies themselves stay in English (fictional brands).

const title = 'Explore — デザイントレンド＆スタディ | BEEDS'
const description =
  'オンラインで、人の心を動かすもの。そして、それを証明するクリエイティブ。スクロールで体験できるインタラクティブなデザインスタディ。'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/ja/explore/',
    languages: {
      en: '/explore/',
      ja: '/ja/explore/',
      'x-default': '/explore/',
    },
  },
  openGraph: {
    title,
    description,
    url: '/ja/explore/',
    siteName: 'BEEDS',
    images: [
      {
        url: '/og/beeds-og-hero.png',
        width: 1200,
        height: 630,
        alt: 'BEEDS',
      },
    ],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og/beeds-og-hero.png'],
  },
}

export default function ExplorePageJa() {
  const t = getDictionary('ja').explore
  return (
    <>
      <Navigation lang="ja" switchHref="/explore/" />
      <main>
        {/* Lede */}
        <section className="pt-24 pb-16 px-10">
          <div className="container-x">
            <h1 className="text-[26px] leading-[1.45] md:text-5xl md:leading-[1.3] max-w-[900px]">
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
        <StudyShowcase lang="ja" />

        {/* Design Trends / Journal */}
        <section className="py-14 px-10 bg-white">
          <div className="container-x">
            <TrendNote lang="ja" />
          </div>
        </section>
      </main>
      <Footer lang="ja" />
    </>
  )
}
