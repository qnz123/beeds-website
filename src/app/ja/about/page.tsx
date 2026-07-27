import type { Metadata } from 'next'
import Navigation from '@/components/Navigation'
import Services from '@/components/sections/Services'
import Footer from '@/components/Footer'

// Japanese /about page. Content is a client-supplied narrative (a richer editorial
// arc than the English page), rendered inline here — the native reviewer edits
// this file for about-page copy. Section eyebrows stay in English by design.
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
            <h1 className="text-[26px] leading-[1.5] md:text-5xl md:leading-[1.35] max-w-[900px]">
              ブランドは、語るものではない。
              <br />
              感じられるものだ。
            </h1>
            <p className="mt-10 text-base leading-[1.95] max-w-[720px] text-[#333]">
              私たちは、ブランドが市場を越え、人の心へ自然に届く体験をデザインします。良いストーリーが、静かに広がり、やがて大きな共感を生むように。
            </p>
          </div>
        </section>

        {/* Since 2012 */}
        <section className="bg-white py-16 px-10 border-t border-black">
          <div className="container-x max-w-[820px]">
            <h2 className="eyebrow mb-6">Since 2012</h2>
            <h3 className="text-2xl md:text-3xl leading-[1.5] mb-6">はじまりは、言葉。</h3>
            <p className="text-base leading-[1.95] text-[#333]">
              2012年。タイポグラフィ、エディトリアルデザイン、プレゼンテーション。
              <br />
              すべては、「伝える」ことから始まりました。サンフランシスコとニューヨークで培ったコミュニケーションデザインが、BEEDSの原点です。
            </p>
          </div>
        </section>

        {/* Transform */}
        <section className="py-16 px-10 border-t border-black">
          <div className="container-x max-w-[820px]">
            <h2 className="eyebrow mb-6">Transform</h2>
            <p className="text-base leading-[1.95] text-[#333]">
              2013年。私たちは、印刷からデジタルへ、映像へ、そして体験へと表現の領域を広げました。
              <br />
              <br />
              Web。アプリケーション。映像。AR。
              <br />
              <br />
              メディアは変わっても、本質は変わりません。
              <br />
              伝わること。心を動かすこと。
            </p>
          </div>
        </section>

        {/* Production */}
        <section className="bg-white py-16 px-10 border-t border-black">
          <div className="container-x max-w-[820px]">
            <h2 className="eyebrow mb-6">Production</h2>
            <p className="text-base leading-[1.95] text-[#333]">
              美しいだけでは、人は動きません。
              <br />
              <br />
              私たちがつくるのは、ブランドが選ばれる理由です。
              <br />
              <br />
              戦略を起点に、コンセプトを磨き、映像、デザイン、デジタル体験へと展開する。制作は、アイデアを形にする工程ではなく、ブランドの価値を実装するプロセスだと考えています。
              <br />
              <br />
              トレンドを追いかけるのではなく、その先を見据える。市場、プロダクト、そして人を深く理解し、変化を予測する。持続するブランドは、その視点から生まれます。
            </p>
          </div>
        </section>

        {/* AI × Human */}
        <section className="py-16 px-10 border-t border-black">
          <div className="container-x max-w-[820px]">
            <h2 className="eyebrow mb-6">AI × Human</h2>
            <p className="text-base leading-[1.95] text-[#333]">
              AIは、可能性を広げます。
              <br />
              人は、意味を与えます。
              <br />
              <br />
              BEEDSは、AIによる分析と、人の創造性・文化理解・ブランドガバナンスを融合し、スピードと品質を両立します。
              <br />
              <br />
              効率化のためだけではなく、本質的な価値を生み出すために。
            </p>
          </div>
        </section>

        {/* New York × Tokyo */}
        <section className="bg-white py-16 px-10 border-t border-black">
          <div className="container-x max-w-[820px]">
            <h2 className="eyebrow mb-6">New York × Tokyo</h2>
            <p className="text-base leading-[1.95] text-[#333]">
              異なる文化は、新しい視点を生みます。
              <br />
              <br />
              BEEDSはニューヨークと東京を拠点に、多様な市場とカルチャーを横断しながらブランドを支援しています。
              <br />
              <br />
              APAC、北米、中東。市場が変われば、伝わり方も変わる。
              <br />
              <br />
              だから私たちは、ローカルの文脈を理解し、世界で機能するクリエイティブを設計します。
            </p>
          </div>
        </section>

        {/* Quote */}
        <section className="py-20 px-10 border-t border-black">
          <div className="container-x max-w-[760px] mx-auto text-center">
            <p className="text-2xl md:text-3xl leading-[1.4] mb-8">
              &ldquo;If you have the ability to destroy, you have the ability to create.&rdquo;
            </p>
            <p className="text-base leading-[1.95] text-[#333]">
              壊すことができるなら、創り直すこともできる。
              <br />
              <br />
              変化は終わりではありません。次の可能性の始まりです。
            </p>
          </div>
        </section>

        {/* Our Services */}
        <Services lang="ja" />
      </main>
      <Footer lang="ja" />
    </>
  )
}
