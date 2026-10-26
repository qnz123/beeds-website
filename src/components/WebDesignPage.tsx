import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import type { Locale } from '@/i18n/config'

// The web design service page (2026-10-26): the one page written for what people type into Google
// ("website design Tokyo", "東京 ホームページ制作"). Same editorial wireframe as /about: a lede, then
// hairline-ruled sections, then the Free Look call to action. The pitch is fast, carefully made
// design with an experience element and nothing wasted; extra languages are an add-on, never the
// lead. The two pages are written for two markets, not translated: the U.S. page opens on the
// fast-or-beautiful trade-off and prices in USD; the Japanese page opens on the website as the
// company's front door (第一印象, 信頼) and prices in yen. Japanese section headings are Japanese on
// purpose (unlike /ja/about), because they carry the search words. Video sits on this page as "the
// same team shoots what fills the site", so one studio sells both.

type Card = { title: string; body: string }
type Plan = { name: string; price: string; body: string; includes: string[] }

type Copy = {
  h1: string
  lede: string
  buildHeading: string
  build: Card[]
  videoHeading: string
  videoLede: string
  video: Card[]
  plansHeading: string
  plans: Plan[]
  addOnsHeading: string
  addOns: { name: string; price: string }[]
  careHeading: string
  careLede: string
  care: Plan[]
  plansNote: string
  stepsHeading: string
  steps: Card[]
  whyHeading: string
  why: Card[]
  faqHeading: string
  faq: { q: string; a: string }[]
  ctaHeading: string
  ctaBody: string
  cta: string
}

// Starting prices, excluding tax: yen on the Japanese page, dollars on the U.S. page. Shared by the
// page and the structured data.
const PLAN_PRICES: Record<Locale, { currency: string; amounts: readonly number[] }> = {
  en: { currency: 'USD', amounts: [7500, 25000, 45000] },
  ja: { currency: 'JPY', amounts: [900000, 3000000, 5000000] },
}

export const webDesignCopy: Record<Locale, Copy> = {
  en: {
    h1: 'Fast or beautiful? Our website design gives you both.',
    lede:
      'Most studios make you choose: a quick site that looks like a template, or a stunning one that takes half a year. BEEDS, a design studio in Tokyo and New York, designs with motion, interaction and 3D, and builds fast with nothing wasted, on desktop and mobile. You see your new homepage for free before you pay.',
    buildHeading: 'What we build',
    build: [
      {
        title: 'Brand and company websites',
        body: 'A proper home for your business: clear pages, editorial design and a voice that sounds like you.',
      },
      {
        title: 'Experience design',
        body: 'Motion, interaction and 3D where they earn their place, so your site feels like your brand and not like a template.',
      },
      {
        title: 'Launch and campaign sites',
        body: 'One to five pages built around a single moment: an opening, a new product, a season.',
      },
      {
        title: 'Redesigns',
        body: 'Your current site, rebuilt to load fast, rank for what your customers search and turn visits into enquiries.',
      },
    ],
    videoHeading: 'Video, by the same team',
    videoLede:
      'A website is only as good as what fills it. We started in print and moved into video before we built sites, so the people who design your pages can also shoot the film and photos that go on them, and it all looks like it came from one place.',
    video: [
      { title: 'Brand films', body: 'A short film for your homepage that shows what you do in under a minute.' },
      { title: 'Testimonial videos', body: 'Your customers, on camera, saying why they chose you. The strongest proof a site can carry.' },
      { title: 'Product and social video', body: 'Cut-downs for launches, ads and social, shot in the same session.' },
    ],
    plansHeading: 'Plans',
    plans: [
      {
        name: 'Standard',
        price: 'from $7,500',
        body: 'A focused site for a launch, a campaign or a new business.',
        includes: ['1 to 5 pages', 'Editorial design with one signature motion moment', 'One design, adapted to fit desktop and mobile', 'Search basics set up'],
      },
      {
        name: 'Plus',
        price: 'from $25,000',
        body: 'A full brand or company website.',
        includes: ['Everything in Standard', 'Content management', 'Positioning, messaging and copy polish', 'Motion and interaction across the site', 'Analytics, and one month of care included'],
      },
      {
        name: 'Custom',
        price: 'from $45,000',
        body: 'A site planned around your strategy.',
        includes: ['Everything in Plus', 'Strategy planning workshop', 'Audience and market research', 'Delivery plan: channels, launch and how the site reaches people', 'E-commerce and integrations', 'Three months of care included'],
      },
    ],
    addOnsHeading: 'Popular add-ons',
    addOns: [
      { name: 'More languages: English, Japanese, Korean, Mandarin', price: 'from $2,500 each' },
      { name: 'Testimonial video, 30 to 60 seconds', price: 'from $3,500' },
      { name: 'Brand photo shoot, half day', price: 'from $2,500' },
      { name: 'Extra pages', price: 'from $600 a page' },
    ],
    careHeading: 'Care plans',
    careLede: 'A monthly subscription that keeps your site fast, current and growing after launch. Cancel any time.',
    care: [
      {
        name: 'Care',
        price: '$500 a month',
        body: 'For sites that need to stay healthy.',
        includes: ['Hosting and uptime monitoring', 'Security and software updates', 'Small edits each month', 'Speed checks on desktop and mobile'],
      },
      {
        name: 'Growth',
        price: '$2,000 a month',
        body: 'For sites that need to bring in more.',
        includes: ['Everything in Care', 'Search improvements every month', 'New pages and content', 'Monthly report on visits and enquiries'],
      },
    ],
    plansNote: 'Starting prices, excluding tax. Every project gets its own quote, and it comes with your Free Look.',
    stepsHeading: 'How it works',
    steps: [
      { title: 'The Free Look', body: 'Tell us about your business. We design your new homepage and show it to you, free.' },
      { title: 'Plan and quote', body: 'If you like where it is going, we agree the pages and content, and send a quote.' },
      { title: 'Design and build', body: 'We design every page and polish the copy. Desktop and mobile share the same design taste, with the layout adapted to fit each screen.' },
      { title: 'Launch and look after', body: 'We launch with search basics in place and can stay on for updates, new content and search work.' },
    ],
    whyHeading: 'Why BEEDS',
    why: [
      {
        title: 'Fast, with nothing wasted',
        body: 'You see your design before you commit, so no weeks lost to meetings. The finished site carries no wasted weight, so it loads quickly on desktop and mobile.',
      },
      {
        title: 'Made with care since 2012',
        body: 'Typography and print first, then video, then digital platforms. Every page gets the attention of a printed one.',
      },
      {
        title: 'Tokyo and the U.S.',
        body: 'A studio in Tokyo and New York, working with clients in both markets.',
      },
    ],
    faqHeading: 'Questions',
    faq: [
      {
        q: 'How much does a website cost?',
        a: 'Standard sites start from $7,500, Plus from $25,000 and Custom from $45,000, excluding tax. Every project gets its own quote, which comes with your Free Look.',
      },
      { q: 'What is the Free Look?', a: 'A free design of your new homepage, made for your business, before you commit to anything.' },
      {
        q: 'What do you mean by experience design?',
        a: 'The motion, interaction and 3D that make a site feel alive: things that move as you scroll, respond to your cursor or tell a story as you go. We use them where they help, never where they slow the site down.',
      },
      {
        q: 'Can you make the video and photos for my site too?',
        a: 'Yes. Brand films, testimonial videos and photo shoots are made by the same team that designs your site, and any of them can be added to your plan.',
      },
      { q: 'Can you redesign the site I already have?', a: 'Yes. We keep what works, carry your content across and rebuild the rest.' },
      {
        q: 'Which languages can my site be in?',
        a: 'Your site comes in one language, and you can add English, Japanese, Korean or Mandarin, each written by a native speaker.',
      },
      {
        q: 'Will people be able to find my site on Google?',
        a: 'Every site launches with the search basics set up: page titles and descriptions, a sitemap, structured data and Google Search Console.',
      },
    ],
    ctaHeading: 'See your new site first.',
    ctaBody: 'Tell us about your business and we will design your homepage for free.',
    cta: 'Start with a free Look',
  },
  ja: {
    h1: 'ホームページは、会社の玄関。第一印象で選ばれるホームページ制作。',
    lede:
      'お客様も取引先も、会う前にまずホームページを見ています。名刺やお店の構えにはこだわっていても、ホームページは何年も前のまま、ということはありませんか。東京とニューヨークを拠点とするデザインスタジオBEEDSは、ひと目で信頼される美しさと、モーションや3Dによる記憶に残る体験を、無駄なく、速くお届けします。ご契約の前に、新しいトップページを無料でご覧いただけます。',
    buildHeading: '制作するWebサイト',
    build: [
      {
        title: 'コーポレートサイト・ブランドサイト',
        body: '会社やブランドの「顔」となるサイト。わかりやすい構成と、紙媒体のように丁寧なデザインでお作りします。',
      },
      {
        title: '体験型Webデザイン',
        body: 'モーション、インタラクション、3D演出を必要な場所に。テンプレートでは生まれない、ブランドらしい体験をつくります。',
      },
      {
        title: 'キャンペーン・ローンチサイト',
        body: '開業、新商品、季節の企画など、ひとつの目的に絞った1〜5ページのサイトです。',
      },
      {
        title: 'ホームページリニューアル',
        body: '速く表示され、検索で見つかり、お問い合わせにつながるサイトへ作り直します。',
      },
    ],
    videoHeading: '映像制作も、同じチームで',
    videoLede:
      'サイトの印象は、そこに載る写真と映像で決まります。BEEDSは印刷から映像へ、そしてWebへと歩んできたスタジオです。サイトをデザインするメンバーが撮影まで担当するので、すべてがひとつのブランドとして揃います。',
    video: [
      { title: 'ブランドムービー', body: 'トップページに置く、1分以内で事業の魅力が伝わる短編映像。' },
      { title: 'お客様の声（インタビュー動画）', body: '実際のお客様が、選んだ理由を語る映像。サイトに載せられる、最も強い信頼の証です。' },
      { title: '商品・SNS向け動画', body: 'ローンチや広告、SNS用の短尺動画を、同じ撮影でまとめて制作します。' },
    ],
    plansHeading: '料金プラン',
    plans: [
      {
        name: 'スタンダード',
        price: '90万円〜（税別）',
        body: '開業、キャンペーン、新規事業のための、目的を絞ったサイト。',
        includes: ['1〜5ページ', 'エディトリアルデザイン（印象的なモーション演出1か所）', 'パソコンとスマートフォンで同じデザイン、画面に合わせて最適化', '検索対策の基本設定'],
      },
      {
        name: 'プラス',
        price: '300万円〜（税別）',
        body: '本格的なコーポレートサイト・ブランドサイト。',
        includes: ['スタンダードの全内容', 'CMS（更新機能）', 'ポジショニング・メッセージ設計、文章の推敲', 'サイト全体のモーション・インタラクション', 'アクセス解析、公開後1か月の保守付き'],
      },
      {
        name: 'カスタム',
        price: '500万円〜（税別）',
        body: '戦略から設計する、オーダーメイドのサイト。',
        includes: ['プラスの全内容', '戦略立案ワークショップ', 'ターゲット・市場調査', '届け方の設計（チャネル・ローンチ・集客導線）', 'EC・外部サービス連携', '公開後3か月の保守付き'],
      },
    ],
    addOnsHeading: '主なオプション',
    addOns: [
      { name: '多言語対応（英語・日本語・韓国語・中国語）', price: '1言語 30万円〜' },
      { name: 'お客様の声動画（30〜60秒）', price: '35万円〜' },
      { name: 'ブランド写真撮影（半日）', price: '25万円〜' },
      { name: 'ページ追加', price: '1ページ 6万円〜' },
    ],
    careHeading: '月額保守・運用プラン',
    careLede: '公開後も、速く、新しく、成果の出るサイトであり続けるための月額サブスクリプションです。いつでも解約できます。',
    care: [
      {
        name: 'ケア',
        price: '月5万円（税別）',
        body: 'サイトを健全に保つための基本プラン。',
        includes: ['サーバー・稼働状況の監視', 'セキュリティ・ソフトウェア更新', '毎月の軽微な修正', 'パソコン・スマートフォンの表示速度チェック'],
      },
      {
        name: 'グロース',
        price: '月20万円（税別）',
        body: '集客とお問い合わせを伸ばすためのプラン。',
        includes: ['ケアの全内容', '毎月のSEO改善', 'ページ・コンテンツの追加', 'アクセスとお問い合わせの月次レポート'],
      },
    ],
    plansNote: '表示価格はすべて税別・最低価格です。案件ごとにお見積りし、完成イメージと併せてお出しします。',
    stepsHeading: '制作の流れ',
    steps: [
      { title: '完成イメージ（無料）', body: '事業についてお聞かせください。新しいトップページをデザインし、無料でご覧いただきます。' },
      { title: 'ご提案・お見積り', body: '方向性にご納得いただけたら、ページ構成と掲載内容を決め、お見積りをお出しします。' },
      { title: 'デザイン・制作', body: '全ページをデザインし、文章を整えます。パソコンとスマートフォンで同じデザインの世界観を保ちながら、それぞれの画面に合わせて最適化します。' },
      { title: '公開・運用サポート', body: '検索対策の基本を整えて公開します。公開後の更新やコンテンツ追加、SEOもお任せいただけます。' },
    ],
    whyHeading: 'BEEDSが選ばれる理由',
    why: [
      {
        title: '速く、無駄なく',
        body: 'ご契約前にデザインをご確認いただけるので、無駄な打ち合わせを重ねる必要はありません。完成したサイトも無駄のない設計で、パソコンでもスマートフォンでも軽快に動きます。',
      },
      {
        title: '2012年から続く、丁寧なものづくり',
        body: 'タイポグラフィと印刷から始まり、映像、そしてデジタルへ。Webサイトにも、紙の一枚と同じ手間をかけます。',
      },
      {
        title: '東京とアメリカ',
        body: '東京とニューヨークを拠点に、日米のお客様とお仕事をしています。',
      },
    ],
    faqHeading: 'よくあるご質問',
    faq: [
      {
        q: 'ホームページ制作の費用はどのくらいですか？',
        a: 'スタンダードは90万円〜、プラスは300万円〜、カスタムは500万円〜（いずれも税別）です。案件ごとにお見積りし、無料の完成イメージと併せてお出しします。',
      },
      { q: '「完成イメージ」とは何ですか？', a: 'ご契約の前に、御社のために新しいトップページを無料でデザインするサービスです。' },
      {
        q: '体験型Webデザインとは何ですか？',
        a: 'スクロールに合わせて動く、カーソルに反応する、ストーリーを語るように展開するなど、サイトに命を吹き込むモーション・インタラクション・3D演出のことです。表示速度を損なわない範囲で、効果的な場所にだけ使います。',
      },
      {
        q: 'サイトに載せる写真や動画も作ってもらえますか？',
        a: 'はい。ブランドムービー、お客様の声動画、写真撮影まで、サイトをデザインする同じチームが担当します。どのプランにもオプションで追加できます。',
      },
      { q: '今あるホームページのリニューアルもできますか？', a: 'はい。活かせる部分は残し、既存のコンテンツを移行したうえで作り直します。' },
      {
        q: '日本語以外の言語にも対応できますか？',
        a: 'はい。英語・韓国語・中国語をオプションで追加でき、それぞれネイティブが文章を作成します。',
      },
      {
        q: 'Googleで見つけてもらえるようになりますか？',
        a: 'ページタイトルと説明文、サイトマップ、構造化データ、Google Search Consoleの設定など、検索対策の基本を整えて公開します。',
      },
    ],
    ctaHeading: 'まずは、完成イメージを。',
    ctaBody: '事業についてお聞かせください。新しいトップページを無料でデザインします。',
    cta: '無料で完成イメージを見る',
  },
}

export default function WebDesignPage({ lang }: { lang: Locale }) {
  const t = webDesignCopy[lang]
  const ja = lang === 'ja'
  const base = 'https://beedstu.com'
  const url = ja ? `${base}/ja/web-design/` : `${base}/web-design/`
  const prices = PLAN_PRICES[lang]

  // Service (with the three starting prices) + FAQPage, tied to the site-wide Organization by @id.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: ja ? 'ホームページ制作' : 'Website design',
        serviceType: ja ? 'ホームページ制作' : 'Website design',
        description: t.lede,
        provider: { '@id': `${base}/#organization` },
        areaServed: [
          { '@type': 'Country', name: 'Japan' },
          { '@type': 'Country', name: 'United States' },
        ],
        url,
        inLanguage: lang,
        offers: t.plans.map((plan, i) => ({
          '@type': 'Offer',
          name: plan.name,
          description: plan.body,
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: prices.amounts[i],
            priceCurrency: prices.currency,
            valueAddedTaxIncluded: false,
          },
        })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        inLanguage: lang,
        mainEntity: t.faq.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
    ],
  }

  return (
    <>
      <Navigation lang={lang} switchHref={ja ? '/web-design/' : '/ja/web-design/'} />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Lede */}
        <section className="pt-24 pb-20 px-10">
          <div className="container-x">
            <h1 className="text-[23px] leading-[1.35] md:text-5xl md:leading-[1.2] max-w-[900px]">{t.h1}</h1>
            <p className="mt-8 max-w-[680px] text-[17px] leading-[1.7]">{t.lede}</p>
          </div>
        </section>

        {/* What we build */}
        <section className="bg-white py-14 px-10">
          <div className="container-x">
            <h2 className="eyebrow mb-8">{t.buildHeading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              {t.build.map((item) => (
                <div key={item.title} className="border-t border-black pt-5">
                  <h3 className="text-xl mb-2">{item.title}</h3>
                  <p className="leading-[1.7] text-[#444]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video, by the same team */}
        <section className="py-14 px-10">
          <div className="container-x">
            <h2 className="eyebrow mb-6">{t.videoHeading}</h2>
            <p className="max-w-[680px] text-[17px] leading-[1.7] mb-10">{t.videoLede}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-10">
              {t.video.map((item) => (
                <div key={item.title} className="border-t border-black pt-5">
                  <h3 className="text-xl mb-2">{item.title}</h3>
                  <p className="leading-[1.7] text-[#444]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="bg-white py-14 px-10">
          <div className="container-x">
            <h2 className="eyebrow mb-8">{t.plansHeading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10">
              {t.plans.map((plan) => (
                <div key={plan.name} className="border-t border-black pt-5">
                  <h3 className="eyebrow text-[#666] mb-3">{plan.name}</h3>
                  <p className="text-3xl mb-3">{plan.price}</p>
                  <p className="leading-[1.7] mb-4">{plan.body}</p>
                  <ul className="leading-[1.9] text-[#444]">
                    {plan.includes.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <h3 className="eyebrow text-[#666] mt-14 mb-4">{t.addOnsHeading}</h3>
            <ul className="max-w-[680px]">
              {t.addOns.map((addOn) => (
                <li key={addOn.name} className="flex justify-between gap-6 border-t border-black py-3">
                  <span>{addOn.name}</span>
                  <span className="whitespace-nowrap text-[#444]">{addOn.price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-[#666]">{t.plansNote}</p>
          </div>
        </section>

        {/* Care plans: the monthly subscription after launch */}
        <section className="py-14 px-10">
          <div className="container-x">
            <h2 className="eyebrow mb-6">{t.careHeading}</h2>
            <p className="max-w-[680px] text-[17px] leading-[1.7] mb-10">{t.careLede}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 max-w-[900px]">
              {t.care.map((plan) => (
                <div key={plan.name} className="border-t border-black pt-5">
                  <h3 className="eyebrow text-[#666] mb-3">{plan.name}</h3>
                  <p className="text-3xl mb-3">{plan.price}</p>
                  <p className="leading-[1.7] mb-4">{plan.body}</p>
                  <ul className="leading-[1.9] text-[#444]">
                    {plan.includes.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white py-14 px-10">
          <div className="container-x">
            <h2 className="eyebrow mb-8">{t.stepsHeading}</h2>
            <ol className="grid grid-cols-1 md:grid-cols-4 gap-x-10 gap-y-10">
              {t.steps.map((step, i) => (
                <li key={step.title} className="border-t border-black pt-5">
                  <span className="eyebrow text-[#666]">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="text-xl mt-2 mb-2">{step.title}</h3>
                  <p className="leading-[1.7] text-[#444]">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Why BEEDS */}
        <section className="py-14 px-10">
          <div className="container-x">
            <h2 className="eyebrow mb-8">{t.whyHeading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-10">
              {t.why.map((item) => (
                <div key={item.title} className="border-t border-black pt-5">
                  <h3 className="text-xl mb-2">{item.title}</h3>
                  <p className="leading-[1.7] text-[#444]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Questions */}
        <section className="bg-white py-14 px-10">
          <div className="container-x max-w-[900px]">
            <h2 className="eyebrow mb-8">{t.faqHeading}</h2>
            <dl>
              {t.faq.map(({ q, a }) => (
                <div key={q} className="border-t border-black py-6">
                  <dt className="text-xl mb-2">{q}</dt>
                  <dd className="leading-[1.7] text-[#444]">{a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* The Free Look */}
        <section className="py-20 px-10">
          <div className="container-x">
            <h2 className="text-[23px] leading-[1.35] md:text-4xl md:leading-[1.2] mb-4">{t.ctaHeading}</h2>
            <p className="mb-8 leading-[1.7] text-[#444]">{t.ctaBody}</p>
            <a
              href={ja ? '/ja/booking/' : '/booking/'}
              className="inline-block border border-black px-6 py-3 no-underline text-black hover:bg-black hover:text-white transition-colors"
            >
              {t.cta}
            </a>
          </div>
        </section>
      </main>
      <Footer lang={lang} />
    </>
  )
}
