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
    location: 'Tokyo, Japan',
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
    location: '東京, 日本',
  },
  work: { heading: '制作実績' },
  clients: { heading: '主なクライアント' },
  booking: {
    heading: 'セッションのご予約',
    // 「[service]のセッションを[date] [time]に希望します。」
    s1pre: '',
    s1afterService: 'のセッションを',
    s1betweenDateTime: ' ',
    s1afterTime: 'に希望します。',
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
    phMessage: '任意 — 一言でも大丈夫です',
    ctaSend: 'リクエストを送る →',
    ctaBack: '← 戻る',
    ctaSubmit: '送信する',
    ctaSending: '送信中…',
    ctaAnother: '別のセッションを予約する →',
    errorFields: 'サービス、お名前、ご連絡用のメールアドレスをご入力ください。',
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
}

const dictionaries: Record<Locale, Dict> = { en, ja }

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries.en
}
