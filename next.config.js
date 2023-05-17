/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASE_PATH,
  reactStrictMode: false,
  i18n: {
    locales: ['en', 'hi'],
    defaultLocale: 'hi',
  }
}

module.exports = nextConfig
