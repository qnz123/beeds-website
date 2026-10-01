import type { Metadata, Viewport } from 'next'
import Watermark from '@/components/sections/Watermark'
import { introReloadScript } from '@/lib/introReload'

// Laid out under the whole screen (viewport-fit=cover), so on an iPhone the ground reaches the very
// bottom edge, under the home indicator, rather than stopping above it: Instagram's in-app browser
// showed its own white there (his report, 2026-10-01). The foot keeps the buttons clear of the
// indicator with env(safe-area-inset-bottom) (.wm-bottom in globals.css). This page only: the
// site's other pages keep the plain viewport from the root layout.
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' }

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
  return (
    <>
      {/* a refresh from the room goes back to it (lib/introReload.ts) */}
      <script dangerouslySetInnerHTML={{ __html: introReloadScript }} />
      <Watermark lang="ja" />
    </>
  )
}
