import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Services from '@/components/sections/Services'
import Footer from '@/components/Footer'
import SmoothHashScroll from '@/components/SmoothHashScroll'

export const metadata: Metadata = {
  title: 'About - BEEDS',
  description:
    'The BEEDS journey — built since 2012, from typography and print in San Francisco and New York to a diverse creative team across New York and Tokyo.',
}

export default function AboutPage() {
  return (
    <>
      <SmoothHashScroll targetId="services" />
      <Navigation />
      <main>
        {/* Lede */}
        <section className="pt-24 pb-20 px-10">
          <div className="container-x">
            <h2 className="eyebrow mb-8">About BEEDS</h2>
            <h1 className="text-[23px] leading-[1.35] md:text-5xl md:leading-[1.2] max-w-[900px]">
              We help brands move through markets the way good stories move through a room —
              quietly, then all at once.
            </h1>
          </div>
        </section>

        {/* Journey / History */}
        <section className="bg-white py-14 px-10 border-t border-black">
          <div className="container-x">
            <h2 className="eyebrow mb-8">Our Journey — Since 2012</h2>

            {/* Dot-to-dot milestone timeline */}
            <div className="pb-6 mb-6 border-b border-black">
              <div className="journey-timeline">
                <div className="journey-node">
                  <span className="journey-dot" />
                  <span className="journey-node-caption">
                    Consumer driven Design, Print, Presentation, 2012
                  </span>
                </div>
                <div className="journey-node">
                  <span className="journey-dot" />
                  <span className="journey-node-caption">
                    Print Design to Video Production
                  </span>
                </div>
                <div className="journey-node">
                  <span className="journey-dot" />
                  <span className="journey-node-caption">
                    Build Digital Platform Web, App
                  </span>
                </div>
                <div className="journey-node">
                  <span className="journey-dot" />
                  <span className="journey-node-caption">
                    AI consulting, human quality governance
                  </span>
                </div>
              </div>
            </div>

            {/* Pull quote */}
            <div className="py-6 mb-6 border-b border-black text-center">
              <p className="text-2xl md:text-3xl leading-[1.4] max-w-[720px] mx-auto">
                &ldquo;If you have the ability to destroy, you have the ability to
                create&rdquo;
              </p>
            </div>

            {/* Beats: The Production / Backbone */}
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-6 pb-6 mb-6 border-b border-black">
              <div>
                <h3 className="eyebrow text-[#666] mb-2">The Production</h3>
                <p className="text-sm leading-[1.7] text-[#666]">
                  Our Production focuses on Modern Creative Planning and Production Service
                  giving the direct input to your brand not just a &ldquo;city pretty&rdquo;. We
                  create Desire. Creating a trend is not a real deal breaker – that mostly plenty
                  people can do. Our strength comes to share a diverse analysis on able to
                  forecast and predict &ldquo;When the trend ends&rdquo; with our Design
                  Thinking from product and audience research.{' '}
                  <span className="brush-highlight">Think backwards</span> to provide
                  sustainability and knowing when to fall and recreate.
                </p>
              </div>
              <div>
                <h3 className="eyebrow text-[#666] mb-2">Backbone</h3>
                <p className="text-sm leading-[1.7] text-[#666]">
                  The journey started as typography communication through magazine and slide
                  presentation in San Francisco and New York. A noble status going though
                  communication design from &ldquo;Text&rdquo; first.
                </p>
              </div>
            </div>

            {/* Beats: 2013 — Transform / New York · Tokyo */}
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-6">
              <div>
                <h3 className="eyebrow text-[#666] mb-2">2013 — Transform</h3>
                <p className="text-sm leading-[1.7] text-[#666]">
                  In 2013, we established multiple designs and video forming a method to
                  &ldquo;Transform.&rdquo; Leading digital transformation from print to digital,
                  Television to web advertising, and outreach to Augmented Reality development.
                </p>
              </div>
              <div>
                <h3 className="eyebrow text-[#666] mb-2">New York · Tokyo</h3>
                <p className="text-sm leading-[1.7] text-[#666]">
                  <span className="brush-highlight">We help business who ask for change</span>.
                  We support business who are afraid to change. Our dedication drives to be in the same shoes with our clients,
                  enduring scarcity and excitement to make a difference. Our diverse cultural
                  team located in New York and Tokyo, a service provider has been working for
                  various people culture background from Middle East, APAC, and United States.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services */}
        <Services />
      </main>
      <Footer />
    </>
  )
}
