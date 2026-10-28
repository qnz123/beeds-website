/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Runs natively on Vercel (no static export) so /api routes work — the booking
  // form posts to /api/bookings (Resend email), not the old HostGator PHP mailer.
  images: {
    // Still unoptimized for now: enabling Next's optimizer requires remotePatterns
    // for i.vimeocdn.com (Vimeo thumbnails). Easy follow-up once the move settles.
    unoptimized: true,
  },
  // Directory-style URLs (/about/), preserved from the previous host so existing
  // links and search-indexed URLs don't 301-churn after the migration.
  trailingSlash: true,
  // Old WordPress pages Google still crawls (Search Console, 2026-10-28): send any remaining links to
  // the pages that replaced them instead of a 404.
  async redirects() {
    return [
      { source: '/contact-2/', destination: '/booking/', permanent: true },
      { source: '/partner/', destination: '/web-design/', permanent: true },
    ]
  },
}

module.exports = nextConfig
