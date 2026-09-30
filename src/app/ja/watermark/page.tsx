import type { Metadata } from 'next'
import Watermark from '@/components/sections/Watermark'

// The Japanese underwater landing page, shown first to visitors entering at /ja/ (middleware.ts).
// A doorway to the Japanese homepage, so it takes that page's canonical, and it stays out of the
// sitemap.
export const metadata: Metadata = {
  title: 'BEEDS — クリエイティブ戦略・AI活用・映像制作',
  description:
    '人のストラテジストとAIを融合し、すべてのブランドアセットを的確に。東京とアメリカで、クリエイティブ戦略・映像制作・プラットフォームを提供するイノベーション主導のメディアスタジオ。',
  alternates: { canonical: '/ja/' },
}

export default function WatermarkJaPage() {
  return <Watermark lang="ja" />
}
