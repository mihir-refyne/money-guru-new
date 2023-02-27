/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASE_PATH,
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'hi'],
    defaultLocale: 'en',
  }
}

module.exports = nextConfig
