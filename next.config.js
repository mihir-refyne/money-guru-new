const nextTranslate = require("next-translate-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = nextTranslate({
  basePath: process.env.BASE_PATH,
  reactStrictMode: false,
  images: {
    domains: ["dqkwfm5lwlsho.cloudfront.net", "assets.refyne.co.in"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
    });

    return config;
  },
});

module.exports = nextConfig;
