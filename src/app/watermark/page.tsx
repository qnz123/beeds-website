import type { Viewport } from 'next'
import Watermark from '@/components/sections/Watermark'

// Laid out under the whole screen (viewport-fit=cover), so on an iPhone the ground reaches the very
// bottom edge, under the home indicator, rather than stopping above it: Instagram's in-app browser
// showed its own white there (his report, 2026-10-01). The foot keeps the buttons clear of the
// indicator with env(safe-area-inset-bottom) (.wm-bottom in globals.css). This page only: the
// site's other pages keep the plain viewport from the root layout.
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' }

// The landing page for links from social posts. It keeps the site's metadata, canonical included:
// it is a doorway to the homepage, not a page of its own to rank, and it stays out of the sitemap.
export default function WatermarkPage() {
  return <Watermark />
}
