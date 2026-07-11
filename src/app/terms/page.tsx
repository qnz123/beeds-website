import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms of Use - BEEDS',
  description:
    'The terms governing use of the BEEDS website, its content, and the creative work featured on it.',
}

// Each section is an eyebrow label + one or more serif paragraphs, divided by
// hairlines — the editorial system used across the site (see Beeds.md).
const sections: { heading: string; body: string[] }[] = [
  {
    heading: 'Website Content',
    body: [
      'The information on this website is provided for general informational purposes only. While we strive to keep all content accurate and up to date, we make no guarantees regarding its completeness, accuracy, or availability.',
      'Service descriptions, capabilities, and project information are subject to change without notice and do not constitute a binding offer or agreement.',
    ],
  },
  {
    heading: 'Creative Assets',
    body: [
      'Creative assets, project examples, visuals, films, campaigns, concepts, and other featured work are presented solely to demonstrate our experience and creative capabilities.',
      'These materials are displayed for informational and showcase purposes only and are not intended to advertise, promote, or sell the products, services, or brands featured within them.',
      'All trademarks, logos, brand names, and other intellectual property remain the property of their respective owners. Nothing on this website grants permission to reproduce, distribute, modify, or commercially use any featured work without prior authorization from the respective rights holder.',
    ],
  },
  {
    heading: 'Intellectual Property',
    body: [
      'Unless otherwise stated, all original content on this website—including text, graphics, branding, layouts, photography, videos, and other creative materials—is owned by or licensed to us and is protected by applicable intellectual property laws.',
      'No content may be copied, reproduced, republished, or distributed without prior written permission.',
    ],
  },
  {
    heading: 'Third-Party Links',
    body: [
      'This website may include links to third-party websites for your convenience. We are not responsible for the content, availability, or privacy practices of those websites.',
    ],
  },
  {
    heading: 'Disclaimer',
    body: [
      'This website and its contents are provided “as is” without warranties of any kind, whether express or implied. We are not liable for any loss or damages arising from the use of, or reliance on, this website or its content.',
    ],
  },
  {
    heading: 'Updates',
    body: [
      'We may update these Terms of Use at any time. Continued use of this website constitutes acceptance of any revised Terms.',
    ],
  },
]

export default function TermsPage() {
  return (
    <>
      <Navigation />
      <main>
        {/* Lede */}
        <section className="pt-24 pb-16 px-10">
          <div className="container-x">
            <h2 className="eyebrow mb-8">Terms of Use</h2>
            <h1 className="text-5xl leading-[1.2] max-w-[820px]">
              The terms that govern your use of this website and the work shown on it.
            </h1>
            <p className="text-xs text-[#666] mt-8">Effective Date: July 10, 2026</p>
            <p className="text-lg leading-[1.7] max-w-[720px] mt-8">
              By accessing or using this website, you agree to these Terms of Use. If you do not
              agree, please discontinue use of the website.
            </p>
          </div>
        </section>

        {/* Sections */}
        {sections.map((section) => (
          <section key={section.heading} className="bg-white py-12 px-10 border-t border-black">
            <div className="container-x grid grid-cols-1 md:grid-cols-[220px_1fr] gap-x-10 gap-y-6">
              <h2 className="eyebrow md:pt-1">{section.heading}</h2>
              <div className="max-w-[680px] space-y-5">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-base leading-[1.8]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Contact */}
        <section className="bg-white py-12 px-10 border-t border-black">
          <div className="container-x grid grid-cols-1 md:grid-cols-[220px_1fr] gap-x-10 gap-y-6">
            <h2 className="eyebrow md:pt-1">Contact</h2>
            <div className="max-w-[680px] space-y-5">
              <p className="text-base leading-[1.8]">
                If you have questions regarding these Terms of Use, please contact us through our{' '}
                <Link href="/#contact" className="underline underline-offset-4">
                  Contact page
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
