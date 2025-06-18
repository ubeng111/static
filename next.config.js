const path = require('path');

// Hapus atau komentari baris ini setelah analisis selesai
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'pix1.agoda.net' },
      { protocol: 'https', hostname: 'pix2.agoda.net' },
      { protocol: 'https', hostname: 'pix3.agoda.net' },
      { protocol: 'https', hostname: 'pix4.agoda.net' },
      { protocol: 'https', hostname: 'pix5.agoda.net' },
      { protocol: 'https', hostname: 'pix8.agoda.net' },
      { protocol: 'https', hostname: 'q-xx.bstatic.com' },
      { protocol: 'https', hostname: 'flagcdn.com' },
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@components'] = path.join(__dirname, 'components');
    return config;
  },
  output: 'standalone', // Tetap pertahankan ini
};

// Ubah kembali cara export
module.exports = nextConfig; // Kembali ke nextConfig secara langsung