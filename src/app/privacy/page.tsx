import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import PrivacyContent from '@/components/PrivacyContent'

const title = 'Privacy Policy - BEEDS'
const description = 'How BEEDS handles information from this website, including the analytics and ad tags it uses.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/privacy/', languages: { en: '/privacy/', ja: '/ja/privacy/' } },
  openGraph: { title, description, url: '/privacy/', siteName: 'BEEDS', locale: 'en_US', type: 'website' },
}

export default function PrivacyPage() {
  return (
    <>
      <Navigation switchHref="/ja/privacy/" />
      <PrivacyContent />
      <Footer />
    </>
  )
}
