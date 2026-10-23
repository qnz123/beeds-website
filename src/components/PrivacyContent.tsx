import Link from 'next/link'
import type { Locale } from '@/i18n/config'

// The privacy policy (2026-10-23), in the Terms page's editorial layout: an eyebrow label and serif
// paragraphs per section, separated by spacing. It covers what the booking and speed-check forms
// collect, and Japan's external-transmission rule (電気通信事業法 外部送信規律): what the ad and
// analytics tags send, to whom, and why. Those tags only load when their IDs are set (Analytics.tsx).

type Section = { heading: string; body: (string | { label: string; href: string })[][] }

const EN: { eyebrow: string; title: string; effective: string; lede: string; sections: Section[]; contact: string } = {
  eyebrow: 'Privacy Policy',
  title: 'What we collect, why, and who else sees it.',
  effective: 'Effective Date: October 23, 2026',
  lede: 'BEEDS (1-3-1 Kita-Aoyama, Minato-ku, Tokyo, Japan) runs this website. This policy explains how we handle information about you, in line with Japan’s Act on the Protection of Personal Information.',
  sections: [
    {
      heading: 'What We Collect',
      body: [
        ['When you book a consultation: your name, email address, the service you are interested in, your message, and the date and time you choose.'],
        ['When you use the site speed check: the address you test and, if you give it, your email address.'],
        ['When you browse: the pages you visit, the page you came from, your browser and device, and cookie identifiers set by the tools listed under External Transmission.'],
      ],
    },
    {
      heading: 'Why We Use It',
      body: [
        ['To reply to you, arrange and confirm consultations, and send the design work you ask for.'],
        ['To understand how the site is used and improve it.'],
        ['To measure our advertising and to show our ads to people who have visited this site.'],
      ],
    },
    {
      heading: 'Who Handles It',
      body: [
        ['We do not sell your information. Service providers handle it on our behalf: Vercel (website hosting), Resend (sending booking emails), and Cloudflare (email routing). Some of them store data outside Japan, including in the United States.'],
      ],
    },
    {
      heading: 'External Transmission',
      body: [
        ['When enabled, this site loads tags that send information from your browser directly to these companies:'],
        ['Google LLC (Google Analytics, Google Ads): page addresses, referrer, browser and device information, cookie identifiers, and actions such as a booking request. Purpose: site analytics and ad measurement.'],
        ['Meta Platforms, Inc. (Meta Pixel): page addresses, browser and device information, cookie identifiers, and actions such as a booking request. Purpose: ad measurement and showing our ads on Facebook and Instagram to people who visited this site.'],
        ['You can limit this at any time: ', { label: 'Google ad settings', href: 'https://adssettings.google.com/' }, ', ', { label: 'Google Analytics opt-out', href: 'https://tools.google.com/dlpage/gaoptout' }, ', ', { label: 'Meta ad preferences', href: 'https://www.facebook.com/adpreferences/' }, ', or by blocking cookies in your browser.'],
      ],
    },
    {
      heading: 'Keeping and Correcting It',
      body: [
        ['We keep booking details for as long as we need them to work with you, and then delete them. You can ask us to show, correct, or delete the information we hold about you, or to stop using it, by writing to info@beedstu.com.'],
      ],
    },
    {
      heading: 'Updates',
      body: [['We may update this policy. The date at the top shows the latest version.']],
    },
  ],
  contact: 'Questions about this policy: info@beedstu.com',
}

const JA: typeof EN = {
  eyebrow: 'プライバシーポリシー',
  title: 'お預かりする情報と、その使い方について。',
  effective: '制定日：2026年10月23日',
  lede: '本ウェブサイトは、BEEDS（東京都港区北青山1-3-1）が運営しています。本ポリシーでは、個人情報の保護に関する法律に基づき、お客様の情報の取り扱いについてご説明します。',
  sections: [
    {
      heading: '取得する情報',
      body: [
        ['ご相談のご予約時：お名前、メールアドレス、ご関心のあるサービス、メッセージ、ご希望の日時。'],
        ['サイト速度チェックのご利用時：チェックするサイトのアドレス、およびご入力いただいた場合はメールアドレス。'],
        ['閲覧時：閲覧したページ、参照元のページ、ブラウザや端末の情報、および「外部送信について」に記載のツールが設定するCookie等の識別子。'],
      ],
    },
    {
      heading: '利用目的',
      body: [
        ['お問い合わせへのご返信、ご相談の日程調整とご確認、ご依頼いただいたデザインのお届けのため。'],
        ['本サイトの利用状況を把握し、改善するため。'],
        ['広告の効果を測定し、本サイトを訪れた方に当社の広告を表示するため。'],
      ],
    },
    {
      heading: '取り扱いの委託',
      body: [
        ['お客様の情報を販売することはありません。以下の事業者に取り扱いを委託しています：Vercel（ウェブサイトのホスティング）、Resend（予約メールの送信）、Cloudflare（メールの転送）。一部の事業者は、米国を含む日本国外でデータを保管しています。'],
      ],
    },
    {
      heading: '外部送信について',
      body: [
        ['本サイトでは、設定している場合、以下の事業者へお客様のブラウザから直接情報を送信するタグを使用しています。'],
        ['Google LLC（Google アナリティクス、Google 広告）：閲覧ページのアドレス、参照元、ブラウザ・端末の情報、Cookie等の識別子、ご予約などの操作。目的：サイトの利用分析、広告効果の測定。'],
        ['Meta Platforms, Inc.（Meta ピクセル）：閲覧ページのアドレス、ブラウザ・端末の情報、Cookie等の識別子、ご予約などの操作。目的：広告効果の測定、および本サイトを訪れた方への Facebook・Instagram での広告表示。'],
        ['これらはいつでも制限できます：', { label: 'Google 広告の設定', href: 'https://adssettings.google.com/' }, '、', { label: 'Google アナリティクス オプトアウト', href: 'https://tools.google.com/dlpage/gaoptout' }, '、', { label: 'Meta 広告の設定', href: 'https://www.facebook.com/adpreferences/' }, '、またはブラウザでCookieを無効にすることで停止できます。'],
      ],
    },
    {
      heading: '保管と開示・訂正',
      body: [
        ['ご予約の情報は、お取引に必要な期間保管し、その後削除します。当社が保有するお客様の情報の開示、訂正、削除、利用停止をご希望の場合は、info@beedstu.com までご連絡ください。'],
      ],
    },
    {
      heading: '改定',
      body: [['本ポリシーは改定することがあります。最新の内容は、冒頭の日付でご確認いただけます。']],
    },
  ],
  contact: '本ポリシーに関するお問い合わせ：info@beedstu.com',
}

export default function PrivacyContent({ lang = 'en' }: { lang?: Locale }) {
  const t = lang === 'ja' ? JA : EN
  return (
    <main>
      <section className="pt-24 pb-16 px-10">
        <div className="container-x">
          <h2 className="eyebrow mb-8">{t.eyebrow}</h2>
          <h1 className="text-3xl md:text-5xl leading-[1.25] max-w-[820px]">{t.title}</h1>
          <p className="text-xs text-[#666] mt-8">{t.effective}</p>
          <p className="text-lg leading-[1.7] max-w-[720px] mt-8">{t.lede}</p>
        </div>
      </section>
      {t.sections.map((section) => (
        <section key={section.heading} className="bg-white py-12 px-10">
          <div className="container-x grid grid-cols-1 md:grid-cols-[220px_1fr] gap-x-10 gap-y-6">
            <h2 className="eyebrow md:pt-1">{section.heading}</h2>
            <div className="max-w-[680px] space-y-5">
              {section.body.map((para, i) => (
                <p key={i} className="text-base leading-[1.8]">
                  {para.map((part, j) =>
                    typeof part === 'string' ? (
                      <span key={j}>{part}</span>
                    ) : (
                      <a key={j} href={part.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                        {part.label}
                      </a>
                    ),
                  )}
                </p>
              ))}
            </div>
          </div>
        </section>
      ))}
      <section className="bg-white py-12 px-10">
        <div className="container-x">
          <p className="text-base leading-[1.8]">
            <Link href="mailto:info@beedstu.com" className="underline underline-offset-4">{t.contact}</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
