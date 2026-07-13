/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static HTML export — emits an `out/` folder of plain .html + assets that the
  // GitHub Action uploads to HostGator. There is no server, so the booking form
  // submits via a mailto: link (see BookingCalendar.tsx), not an API route.
  output: 'export',
  images: {
    // The default Next image optimizer needs a server; static export serves originals.
    unoptimized: true,
  },
  // Directory-style URLs so every route is a real index.html: /about/ -> about/index.html.
  trailingSlash: true,
}

module.exports = nextConfig
