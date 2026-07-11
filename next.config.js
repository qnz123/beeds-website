/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
      },
    ],
  },
  // Prisma 7 TypeScript-native client — let Node.js resolve it rather than webpack.
  serverExternalPackages: ['@prisma/client'],
}

module.exports = nextConfig
