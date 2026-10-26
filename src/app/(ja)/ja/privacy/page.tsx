import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PrivacyContent from '@/components/PrivacyContent'

const title = 'プライバシーポリシー - BEEDS'
const description = 'BEEDSによる本ウェブサイトの情報の取り扱い、および使用している解析・広告タグについて。'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/ja/privacy/', languages: { en: '/privacy/', ja: '/ja/privacy/', 'x-default': '/privacy/' } },
  openGraph: { title, description, url: '/ja/privacy/', siteName: 'BEEDS', locale: 'ja_JP', type: 'website' },
}

export default function PrivacyPageJa() {
  return (
    <>
      <Navigation lang="ja" switchHref="/privacy/" />
      <PrivacyContent lang="ja" />
      <Footer lang="ja" />
    </>
  )
}
