import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

export default function Footer({ lang = 'en' }: { lang?: Locale }) {
  const currentYear = new Date().getFullYear()
  const t = getDictionary(lang).footer

  return (
    <footer className="bg-light py-16 px-10 text-xs">
      <div className="container-x">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pb-0">
          <div>
            <h4 className="eyebrow mb-5" style={{ letterSpacing: '1px' }}>
              {t.contact}
            </h4>
            <p className="leading-[1.8] text-black">
              {t.businessEmail}{' '}
              <a href="mailto:booking@beedstu.com" className="text-black no-underline">
                booking@beedstu.com
              </a>
            </p>
          </div>
          <div>
            <h4 className="eyebrow mb-5" style={{ letterSpacing: '1px' }}>
              {t.information}
            </h4>
            <p className="leading-[1.8] text-[#666]">
              BEEDS © {currentYear}
              <br />
              {t.rights}
              <br />
              {t.location}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
