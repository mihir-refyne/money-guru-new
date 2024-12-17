const nextTranslate = require("next-translate-plugin");

/** @type {import('next').NextConfig} */
const nextConfig = nextTranslate({
  basePath: process.env.BASE_PATH,
  reactStrictMode: false,
  images: {
    domains: [
      "dqkwfm5lwlsho.cloudfront.net",
      "s3.ap-south-1.amazonaws.com",
      "assets.refyne.co.in",
      // INFO: This is for Shopify-hosted domain image
      "cdn.shopify.com",
    ],
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
