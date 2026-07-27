import type { Metadata } from 'next'
import HomeContent from '@/components/HomeContent'

// Japanese homepage (at /ja). Localized title/description + hreflang alternates
// pointing back to the English root, so Google serves the right language.
// JA copy is a DRAFT transcreation pending native review.
export const metadata: Metadata = {
  title: 'BEEDS — クリエイティブ戦略・AI活用・映像制作',
  description:
    '人のストラテジストとAIを融合し、すべてのブランドアセットを的確に。東京とアメリカで、クリエイティブ戦略・映像制作・プラットフォームを提供するイノベーション主導のメディアスタジオ。',
  alternates: {
    canonical: '/ja',
    languages: {
      en: '/',
      ja: '/ja',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'BEEDS — クリエイティブ戦略・AI活用・映像制作',
    description:
      '人のストラテジストとAIを融合し、すべてのブランドアセットを的確に。東京とアメリカのメディアスタジオ、BEEDS。',
    url: '/ja',
    locale: 'ja_JP',
  },
}

export default function HomeJa() {
  return <HomeContent lang="ja" />
}
