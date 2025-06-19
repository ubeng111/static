const path = require('path');
// Tidak perlu lagi mengimpor i18nConfig, defaultLocale, defaultHtmlLang di sini
// karena konfigurasi i18n di next.config.js tidak didukung lagi untuk App Router.
// const { i18nConfig, defaultLocale, defaultHtmlLang } = require('./config/i18n');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'pix1.agoda.net' },
      { protocol: 'https', hostname: 'pix1.agoda.net' },
      { protocol: 'http', hostname: 'q-xx.bstatic.com' },
      { protocol: 'https', hostname: 'q-xx.bstatic.com' },
      { protocol: 'http', hostname: 'pix2.agoda.net' },
      { protocol: 'https', hostname: 'pix2.agoda.net' },
      { protocol: 'http', hostname: 'pix3.agoda.net' },
      { protocol: 'https', hostname: 'pix3.agoda.net' },
      { protocol: 'http', hostname: 'pix4.agoda.net' },
      { protocol: 'https', hostname: 'pix4.agoda.net' },
      { protocol: 'http', hostname: 'pix5.agoda.net' },
      { protocol: 'https', hostname: 'pix5.agoda.net' },
      { protocol: 'http', hostname: 'pix8.agoda.net' },
      { protocol: 'https', hostname: 'flagcdn.com' },
      { protocol: 'https', hostname: 'pix8.agoda.net' },
    ],
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@components'] = path.join(__dirname, 'components');
    return config;
  },

  // === HAPUS BLOK I18N INI ===
  // i18n: {
  //   locales: [...new Set(i18nConfig.map(config => config.htmlLangCode))],
  //   defaultLocale: defaultHtmlLang,
  //   // localeDetection: false,
  // },

  // Pertahankan ini karena ini tetap relevan untuk App Router
  trailingSlash: false, // Atau true, sesuai pilihan Anda
};

module.exports = nextConfig;