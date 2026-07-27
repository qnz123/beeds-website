import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Services from '@/components/sections/Services'
import Footer from '@/components/Footer'

// Japanese /about page. Mirrors the English page's wireframe (lede → "Our
// Journey" section with milestone timeline, pull quote, and 2-column beat grids
// → Services) with client-supplied Japanese copy. Section eyebrows stay English
// by design. The native reviewer edits this file for about-page copy.
const title = 'About — BEEDS'
const description =
  'ブランドは、語るものではない。感じられるものだ。ニューヨークと東京を拠点に、戦略・制作・AI活用でブランドを支援するメディアスタジオ、BEEDS。'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/ja/about',
    languages: { en: '/about', ja: '/ja/about', 'x-default': '/about' },
  },
  openGraph: { title, description, url: '/ja/about', locale: 'ja_JP', type: 'website' },
}

export default function AboutPageJa() {
  return (
    <>
      <Navigation lang="ja" switchHref="/about" />
      <main>
        {/* Lede */}
        <section className="pt-24 pb-20 px-10">
          <div className="container-x">
            <h2 className="eyebrow mb-8">About BEEDS</h2>
            <h1 className="text-[26px] leading-[1.45] md:text-5xl md:leading-[1.3] max-w-[900px]">
              ブランドは、語るものではない。
              <br />
              感じられるものだ。
            </h1>
            <p className="mt-8 text-base leading-[1.9] max-w-[720px] text-[#333]">
              私たちは、ブランドが市場を越え、人の心へ自然に届く体験をデザインします。良いストーリーが、静かに広がり、やがて大きな共感を生むように。
            </p>
          </div>
        </section>

        {/* Journey / History */}
        <section className="bg-white py-14 px-10">
          <div className="container-x">
            <h2 className="eyebrow mb-8">Our Journey — Since 2012</h2>

            {/* Dot-to-dot milestone timeline */}
            <div className="pb-6 mb-6 border-b border-black">
              <div className="journey-timeline">
                <div className="journey-node">
                  <span className="journey-dot" />
                  <span className="journey-node-caption">
                    2012年 — デザイン・印刷・プレゼンテーション
                  </span>
                </div>
                <div className="journey-node">
                  <span className="journey-dot" />
                  <span className="journey-node-caption">印刷デザインから映像制作へ</span>
                </div>
                <div className="journey-node">
                  <span className="journey-dot" />
                  <span className="journey-node-caption">
                    デジタルプラットフォーム構築（Web・アプリ）
                  </span>
                </div>
                <div className="journey-node">
                  <span className="journey-dot" />
                  <span className="journey-node-caption">
                    AIコンサルティング・人による品質ガバナンス
                  </span>
                </div>
              </div>
            </div>

            {/* Pull quote */}
            <div className="py-6 mb-6 border-b border-black text-center">
              <p className="text-2xl md:text-3xl leading-[1.4] max-w-[720px] mx-auto mb-5">
                &ldquo;If you have the ability to destroy, you have the ability to create&rdquo;
              </p>
              <p className="text-sm leading-[1.9] text-[#666] max-w-[600px] mx-auto">
                壊すことができるなら、創り直すこともできる。変化は終わりではありません。次の可能性の始まりです。
              </p>
            </div>

            {/* Beats: Production / Backbone */}
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-6 pb-6 mb-6 border-b border-black">
              <div>
                <h3 className="eyebrow text-[#666] mb-2">Production</h3>
                <p className="text-sm leading-[1.7] text-[#666]">
                  美しいだけでは、人は動きません。私たちがつくるのは、
                  <span className="brush-highlight">ブランドが選ばれる理由</span>
                  です。戦略を起点に、コンセプトを磨き、映像、デザイン、デジタル体験へと展開する。制作は、アイデアを形にする工程ではなく、ブランドの価値を実装するプロセスだと考えています。
                </p>
              </div>
              <div>
                <h3 className="eyebrow text-[#666] mb-2">Backbone — Since 2012</h3>
                <p className="text-sm leading-[1.7] text-[#666]">
                  2012年。タイポグラフィ、エディトリアルデザイン、プレゼンテーション。すべては、「伝える」ことから始まりました。サンフランシスコとニューヨークで培ったコミュニケーションデザインが、BEEDSの原点です。
                </p>
              </div>
            </div>

            {/* Beats: 2013 — Transform / New York · Tokyo */}
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-6 pb-6 mb-6 border-b border-black">
              <div>
                <h3 className="eyebrow text-[#666] mb-2">2013 — Transform</h3>
                <p className="text-sm leading-[1.7] text-[#666]">
                  2013年。私たちは、印刷からデジタルへ、映像へ、そして体験へと表現の領域を広げました。Web、アプリケーション、映像、AR。メディアは変わっても、本質は変わりません。伝わること。心を動かすこと。
                </p>
              </div>
              <div>
                <h3 className="eyebrow text-[#666] mb-2">New York · Tokyo</h3>
                <p className="text-sm leading-[1.7] text-[#666]">
                  異なる文化は、新しい視点を生みます。BEEDSはニューヨークと東京を拠点に、多様な市場とカルチャーを横断しながらブランドを支援しています。APAC、北米、中東。市場が変われば、伝わり方も変わる。だから私たちは、ローカルの文脈を理解し、
                  <span className="brush-highlight">世界で機能するクリエイティブ</span>
                  を設計します。
                </p>
              </div>
            </div>

            {/* Beat: AI × Human */}
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-6">
              <div>
                <h3 className="eyebrow text-[#666] mb-2">AI × Human</h3>
                <p className="text-sm leading-[1.7] text-[#666]">
                  AIは、可能性を広げます。人は、意味を与えます。BEEDSは、AIによる分析と、人の創造性・文化理解・ブランドガバナンスを融合し、スピードと品質を両立します。効率化のためだけではなく、本質的な価値を生み出すために。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services */}
        <Services lang="ja" />
      </main>
      <Footer lang="ja" />
    </>
  )
}
