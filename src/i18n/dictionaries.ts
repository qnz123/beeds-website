import type { Locale } from './config'

// Central copy dictionary. English is source; Japanese is a DRAFT transcreation
// (polite です/ます register) — flagged for native review before it's considered
// final. Brand taglines are intentionally kept in English on both locales.
//
// Phase 1 covers the site chrome (nav, footer) and the hero. Other homepage
// sections (folio, impact, booking concierge) are added in later phases.

type Dict = {
  nav: {
    work: string
    about: string
    services: string
    contact: string
  }
  hero: {
    line1: string
    line2: string
    body: string
    cta: string
  }
  footer: {
    contact: string
    businessEmail: string
    information: string
    rights: string
    location: string
  }
  work: { heading: string }
  clients: { heading: string }
  booking: {
    heading: string
    // Sentence fragments woven around the form controls. Control order
    // (service → date → time, name → email) is identical in EN and JA, so only
    // the connecting text differs — one JSX layout serves both locales.
    s1pre: string
    s1afterService: string
    s1betweenDateTime: string
    s1afterTime: string
    s2pre: string
    s2mid: string
    s2end: string
    s3pre: string
    services: string[] // labels in SERVICES order (values/slugs stay fixed)
    phService: string
    phDate: string
    phTime: string
    na: string
    phName: string
    phEmail: string
    phMessage: string
    ctaSend: string
    ctaBack: string
    ctaSubmit: string
    ctaSending: string
    ctaAnother: string
    errorFields: string
    errorMailto: string // uses {email} placeholder
    noteBefore: string
    noteAfter: string
    successHeading: string
    successThanks: string
    successMid: string
    successEnd: string
    lblService: string
    lblDate: string
    lblTime: string
  }
  impact: {
    lede: string // '\n' marks intentional line breaks
    disclaimer: string
    stats: string[] // the three stat-callout labels, in order
    channels: string[] // bar-chart channel names, in order
    before: string
    after: string
  }
  svc: { heading: string; clients: string }
  explore: {
    heroLines: string[] // h1 lines — JA breaks across two lines
    // Intro sentence around the studies grid: [highlight][rest][link][after]
    introHighlight: string
    introRest: string
    introLinkText: string
    introAfterLink: string
    // Trend note: lede + the two underlined phrases + body paragraphs
    trendLede: string
    trendStay: string
    trendBreak: string
    trendBody: string[]
    // Study card copy, keyed by slug. `descriptor` is an array of lines —
    // EN runs as one sentence, JA breaks into two.
    studies: Record<
      'meridian' | 'aura' | 'volt',
      { descriptor: string[]; tag: string }
    >
  }
}

const en: Dict = {
  nav: { work: 'Work', about: 'About', services: 'Services', contact: 'Contact' },
  hero: {
    line1: 'SMALL FRAMES',
    line2: 'BIG IMPACT',
    body: 'Your story is your brand. BEEDS keeps every creative asset on point — our AI engine audits tone and relevance while human strategists weave in local nuance, pattern, and governance.',
    cta: "Let's connect →",
  },
  footer: {
    contact: 'Contact',
    businessEmail: 'Business Email —',
    information: 'Information',
    rights: 'All Rights Reserved',
    location: 'Tokyo, Japan · New York, U.S',
  },
  work: { heading: 'Selected Work' },
  clients: { heading: 'Selected Clients' },
  booking: {
    heading: 'Book A Session',
    s1pre: 'I’d like a ',
    s1afterService: ' session on ',
    s1betweenDateTime: ' at ',
    s1afterTime: '.',
    s2pre: 'My name is ',
    s2mid: ' and you can reach me at ',
    s2end: '.',
    s3pre: 'The project, idea, or challenge I’d like to talk about: ',
    services: ['Creative Strategy', 'AI Enablement', 'Production', 'Market Expansion'],
    phService: 'service',
    phDate: 'date',
    phTime: 'time',
    na: 'N/A',
    phName: 'your name',
    phEmail: 'email address',
    phMessage: 'optional — a line or two is plenty',
    ctaSend: 'Send the request →',
    ctaBack: '← back',
    ctaSubmit: 'Submit',
    ctaSending: 'Sending…',
    ctaAnother: 'Request another session →',
    errorFields: 'That still needs a service, your name, and an email we can reply to.',
    errorMailto:
      'We couldn’t submit that automatically, so we’ve opened your email app — just press send. Or write to us at {email}.',
    noteBefore: 'Weekdays only · times shown in your timezone (',
    noteAfter: ') · we hold sessions from our Tokyo studio.',
    successHeading: 'Request received.',
    successThanks: 'Thank you, ',
    successMid: ' — your request is in, and a confirmation is on its way to ',
    successEnd: '. We’ll take it from there.',
    lblService: 'Service',
    lblDate: 'Date',
    lblTime: 'Time',
  },
  impact: {
    lede: 'Creative consulting doesn’t end with recommendations. It continues through production. This is what happens when strategy is transformed into stories, experiences, and results.',
    disclaimer: 'Figures are demonstration purposes.',
    stats: [
      'Average engagement lift across client channels',
      'Increase in monthly content output',
      'Faster time-to-launch on new campaigns',
    ],
    channels: ['Organic Search', 'Paid Social', 'Search Ads', 'Email'],
    before: 'Before',
    after: 'After',
  },
  svc: { heading: 'Our Services', clients: 'Selected Clients' },
  explore: {
    heroLines: ['What’s moving people online — and the work that proves it.'],
    introHighlight: 'Hover a frame',
    introRest:
      ' to watch it play top to bottom, then pick the direction that fits your product — or ',
    introLinkText: 'contact us for custom planning',
    introAfterLink: '.',
    trendLede: 'Trends are trends.',
    trendStay: 'Some stay.',
    trendBreak: 'Some break.',
    trendBody: [
      'The above is our own human read on what’s moving in design — not a rulebook or a “this is it.” Not every trend deserves a permanent place in a brand. Knowing which ones to build on, and which to let pass, is the work. That is exactly why we’re here.',
    ],
    studies: {
      meridian: {
        descriptor: ['For premium products that earn a slow, deliberate reveal.'],
        tag: 'Cinematic luxury',
      },
      aura: {
        descriptor: [
          'For gentle brands that sell calm — soft on the eye, kind to the skin.',
        ],
        tag: 'Liquid, organic',
      },
      volt: {
        descriptor: ['For loud products that would rather shout than blend in.'],
        tag: 'Brutalist kinetic',
      },
    },
  },
}

// --- 日本語（下書き：ネイティブ確認待ち / DRAFT — pending native review） ---
const ja: Dict = {
  nav: {
    // Client direction: keep the top nav tabs in English on the JA site too.
    work: 'Work',
    about: 'About',
    services: 'Services',
    contact: 'Contact',
  },
  hero: {
    // Brand tagline kept in English by design — decide if you want a JA version.
    line1: 'SMALL FRAMES',
    line2: 'BIG IMPACT',
    body: 'ストーリーを、ブランドへ。BEEDSは、あらゆるクリエイティブアセットを戦略的に磨き上げます。AIエンジンがブランドのトーンと関連性を分析し、人のストラテジストがその土地ならではの文化やニュアンス、行動パターン、ブランドガバナンスを織り込み、一貫性と成果につながるクリエイティブへと導きます。',
    cta: 'ご相談はこちら →',
  },
  footer: {
    contact: 'お問い合わせ',
    businessEmail: 'ビジネスメール —',
    information: '会社情報',
    rights: '無断転載を禁じます',
    location: '東京, 日本 · New York, U.S',
  },
  work: { heading: '制作実績' },
  clients: { heading: '主なクライアント' },
  booking: {
    heading: 'セッションのご予約',
    // 「[service]のセッションを[date] [time]にします。」
    s1pre: '',
    s1afterService: 'のセッションを',
    s1betweenDateTime: ' ',
    s1afterTime: 'にします。',
    // 「名前は[name]、ご連絡先は[email]です。」
    s2pre: '名前は',
    s2mid: '、ご連絡先は',
    s2end: 'です。',
    s3pre: 'ご相談したいプロジェクトやアイデア、課題があれば、こちらへ：',
    services: ['クリエイティブ戦略', 'AI導入支援', 'コンテンツ制作', '海外市場展開'],
    phService: 'サービス',
    phDate: '日付',
    phTime: '時間',
    na: '指定なし',
    phName: 'お名前',
    phEmail: 'メールアドレス',
    phMessage: '任意',
    ctaSend: 'リクエストを送る →',
    ctaBack: '← 戻る',
    ctaSubmit: '送信する',
    ctaSending: '送信中…',
    ctaAnother: '別のセッションを予約する →',
    errorFields: 'サービス、お名前、ご連絡用のメールアドレスをご入力ください。',
    errorMailto:
      '自動送信できませんでした。メールアプリを開きましたので、そのまま送信してください。または {email} までご連絡ください。',
    noteBefore: '平日のみ・時間はお使いのタイムゾーン（',
    noteAfter: '）で表示・セッションは東京スタジオより承ります。',
    successHeading: 'リクエストを受け付けました。',
    successThanks: '',
    successMid: ' 様、ありがとうございます。確認メールを ',
    successEnd: ' 宛にお送りします。追ってご連絡いたします。',
    lblService: 'サービス',
    lblDate: '日付',
    lblTime: '時間',
  },
  impact: {
    lede: 'クリエイティブコンサルティングは、提案で終わりません。\nその先の制作まで伴走します。\n戦略を、心を動かすストーリーや体験、そして成果へと形にしていく。',
    disclaimer: '数値はデモンストレーション用のサンプルです。',
    stats: [
      'クライアントチャネル全体での平均エンゲージメント向上',
      '月間コンテンツ制作量の増加',
      '新規キャンペーンの立ち上げ時間の短縮',
    ],
    channels: ['オーガニック検索', '有料ソーシャル', '検索広告', 'メール'],
    before: '導入前',
    after: '導入後',
  },
  svc: { heading: 'サービス', clients: '主なクライアント' },
  explore: {
    heroLines: [
      'オンラインで、人の心を動かすもの。',
      'そして、それを証明するクリエイティブ。',
    ],
    introHighlight: 'フレームにカーソルを合わせると',
    introRest:
      '、上から下へ再生されます。プロダクトに最適な方向性を見つけてください。より自由な発想でプランニングしたい方は、',
    introLinkText: 'カスタムプランニングについてお問い合わせください',
    introAfterLink: '。',
    trendLede: 'トレンドは、トレンド。',
    trendStay: '残るものもあれば、',
    trendBreak: '消えていくものもある。',
    trendBody: [
      'ここにあるのは、デザインの世界で今、何が動いているのか。それを私たちなりの目で読み解いたものです。',
      '正解を示すルールブックではありません。「これが正解」という答えでもありません。',
      'すべてのトレンドを、ブランドに取り入れる必要はない。何を育て、何を見送るのか。その見極めこそが、クリエイティブの仕事です。',
    ],
    studies: {
      meridian: {
        descriptor: [
          'じっくりと、意図的に魅力を見せていく。',
          '時間をかけた演出が似合う、プレミアムなプロダクトに。',
        ],
        tag: 'プレミアム × シネマティック',
      },
      aura: {
        descriptor: ['穏やかさを届けるブランドに。', '目にやさしく、肌にもやさしい。'],
        tag: 'リキッド × オーガニック',
      },
      volt: {
        descriptor: [
          '周囲に溶け込むより、声を上げたいプロダクトに。',
          '大胆に、存在感を放つために。',
        ],
        tag: 'ブルータリスト × キネティック',
      },
    },
  },
}

const dictionaries: Record<Locale, Dict> = { en, ja }

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries.en
}
