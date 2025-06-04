// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'pix1.agoda.net', pathname: '/hotelimages/**' },
      { protocol: 'https', hostname: 'pix1.agoda.net', pathname: '/hotelimages/**' },
      { protocol: 'http', hostname: 'q-xx.bstatic.com', pathname: '/**' },
      { protocol: 'https', hostname: 'q-xx.bstatic.com', pathname: '/**' },
      { protocol: 'http', hostname: 'pix2.agoda.net', pathname: '/hotelimages/**' },
      { protocol: 'https', hostname: 'pix2.agoda.net', pathname: '/hotelimages/**' },
      { protocol: 'http', hostname: 'pix3.agoda.net', pathname: '/hotelimages/**' },
      { protocol: 'https', hostname: 'pix3.agoda.net', pathname: '/hotelimages/**' },
      { protocol: 'http', hostname: 'pix4.agoda.net', pathname: '/hotelimages/**' },
      { protocol: 'https', hostname: 'pix4.agoda.net', pathname: '/hotelimages/**' },
      { protocol: 'http', hostname: 'pix5.agoda.net', pathname: '/hotelimages/**' },
      { protocol: 'https', hostname: 'pix5.agoda.net', pathname: '/hotelimages/**' },
      { protocol: 'http', hostname: 'pix8.agoda.net', pathname: '/hotelimages/**' },
      { protocol: 'https', hostname: 'pix8.agoda.net', pathname: '/hotelimages/**' },
      { protocol: 'https', hostname: 'flagcdn.com', pathname: '/**' },
    ],
    formats: ['image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@components'] = path.join(__dirname, 'components');
    return config;
  },
};

module.exports = nextConfig;