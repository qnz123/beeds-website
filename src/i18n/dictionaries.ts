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
}

const dictionaries: Record<Locale, Dict> = { en, ja }

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries.en
}
