/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { domains: ['cdn.shopify.com', 'via.placeholder.com'] },
  env: {
    APP_NAME: 'NexaShoppify',
    APP_VERSION: '1.0.0',
  },
}
module.exports = nextConfig
