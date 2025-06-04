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
      { protocol: 'https', hostname: 'hoteloza.com', pathname: '/_next/image/**' }, // Tambahkan untuk gambar yang dioptimalkan Next.js
    ],
    formats: ['image/webp', 'image/avif'], // Tambahkan AVIF untuk kompresi lebih baik
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    loader: 'default', // Gunakan loader default Next.js untuk optimasi
    dangerouslyAllowSVG: false, // Pastikan keamanan
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@components'] = path.join(__dirname, 'components');
    return config;
  },
  // Tambahkan optimasi untuk output statis jika memungkinkan
  output: 'standalone', // Untuk deployment yang lebih efisien
};

module.exports = nextConfig;