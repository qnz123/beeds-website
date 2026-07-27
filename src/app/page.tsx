import type { Metadata } from 'next'
import HomeContent from '@/components/HomeContent'

// English homepage (default locale, at the root). hreflang alternates tell
// Google about the Japanese counterpart at /ja.
export const metadata: Metadata = {
  alternates: {
    canonical: '/',
    languages: {
      en: '/',
      ja: '/ja',
      'x-default': '/',
    },
  },
}

export default function Home() {
  return <HomeContent lang="en" />
}
