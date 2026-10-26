import type { Metadata } from 'next'
import WebDesignPage from '@/components/WebDesignPage'

const title = '東京のホームページ制作・体験型Webデザイン | BEEDS'
const description =
  'ホームページは会社の玄関。第一印象で信頼される、速く美しいホームページ制作と映像制作。90万円〜（税別）。ご契約前に新しいトップページのデザインを無料でご覧いただけます。'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/ja/web-design/',
    languages: { en: '/web-design/', ja: '/ja/web-design/', 'x-default': '/web-design/' },
  },
  openGraph: {
    title,
    description,
    url: '/ja/web-design/',
    siteName: 'BEEDS',
    images: [{ url: '/og/beeds-og-sticker.png', width: 1200, height: 630, alt: 'BEEDS' }],
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og/beeds-og-sticker.png'],
  },
}

export default function Page() {
  return <WebDesignPage lang="ja" />
}
