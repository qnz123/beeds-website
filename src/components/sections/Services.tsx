'use client'

// About page: the Selected Clients list. The "Our Services" tabs and their
// descriptions that sat beside it were removed on 2026-10-05 (the services are
// on the homepage now); the left column is held empty for what replaces them.

import type { Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/dictionaries'

// Named in the section's right column — editorial sidebar next to the tabs.
const selectedClients = [
  'Condé Nast',
  'Champion Sports',
  'Jellybean',
  'Nestlé',
  'Pee Wee Harris Comics',
  'Shangri-La Hotels and Resorts',
  'Verizon',
  'Victoria Secret',
  'Waste Management',
  'Wise',
]

export default function Services({ lang = 'en' as Locale }: { lang?: Locale }) {
  const t = getDictionary(lang).svc

  return (
    <section id="services" className="bg-white py-20 px-10">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-x-16 gap-y-14">
          {/* The service tabs and their descriptions were removed (his ask,
              2026-10-05); the services now live on the homepage. This column
              is kept empty for what replaces them. */}
          <div aria-hidden="true" />

          {/* Selected Clients — editorial sidebar in the right column,
              set off by a vertical hairline on desktop. */}
          <aside className="lg:border-l lg:border-black lg:pl-12">
            <h3 className="eyebrow mb-6">{t.clients}</h3>
            <ul className="text-sm leading-[2.2]">
              {selectedClients.map((client) => (
                <li key={client}>{client}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
