// /llms.txt: a short plain-text summary of the site for AI assistants and their crawlers.
export const dynamic = 'force-static'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://beedstu.com'

const body = `# BEEDS

> BEEDS is an innovation-first media studio working across Tokyo and the U.S. since 2012. Human strategists paired with AI: creative strategy, AI enablement, video production, and market expansion. Site available in English and Japanese.

## Pages (English)
- [Home](${siteUrl}/): selected work, services, clients
- [About](${siteUrl}/about/): the studio and its services
- [Explore](${siteUrl}/explore/): website design studies
- [Book a session](${siteUrl}/booking/): schedule a creative session
- [Privacy policy](${siteUrl}/privacy/)

## ページ (日本語)
- [ホーム](${siteUrl}/ja/)
- [私たちについて](${siteUrl}/ja/about/)
- [エクスプローラー](${siteUrl}/ja/explore/)
- [セッションを予約](${siteUrl}/ja/booking/)
- [プライバシーポリシー](${siteUrl}/ja/privacy/)

## Contact
- Email: booking@beedstu.com
- Phone: +81-70-8474-3860
- Address: 1-3-1 Kita-Aoyama, Minato-ku, Tokyo 107-0061, Japan
- Hours: Monday to Friday, 10:00 to 17:00
`

export function GET() {
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
