const path = require('path');
const { i18nConfig, defaultLocale, defaultHtmlLang } = require('./config/i18n'); // Import konfigurasi i18n Anda

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

  // === Tambahan Konfigurasi untuk i18n dan Trailing Slash ===

  // 1. Konfigurasi i18n Next.js
  // Penting: Daftar 'locales' di sini harus sesuai dengan htmlLangCode yang valid dari i18nConfig Anda.
  // defaultLocale harus salah satu dari 'locales' yang terdaftar di sini.
  // Meskipun Anda memiliki middleware kustom, Next.js tetap perlu tahu tentang lokal Anda.
  i18n: {
    // Kumpulkan semua htmlLangCode unik dari i18nConfig Anda
    locales: [...new Set(i18nConfig.map(config => config.htmlLangCode))],
    defaultLocale: defaultHtmlLang, // Gunakan defaultHtmlLang dari i18n.js Anda
    // localeDetection: false, // Disarankan false jika Anda menggunakan middleware kustom untuk deteksi bahasa
  },

  // 2. Kontrol Trailing Slash
  // Ini sangat penting untuk mencegah redirect 308 yang tidak diinginkan jika server Anda memiliki preferensi.
  // Pilih salah satu:
  // a) true: Next.js akan selalu menambahkan trailing slash (misal: /en/about/)
  //    Jika Anda memilih ini, pastikan URL di hreflang Anda juga selalu diakhiri dengan slash.
  trailingSlash: true,

  // b) false: Next.js akan selalu menghapus trailing slash (misal: /en/about)
  //    Jika Anda memilih ini, pastikan URL di hreflang Anda juga tidak diakhiri dengan slash.
  // trailingSlash: false,

  // 3. Optional: Redirects
  // Jika Anda memiliki redirect yang ingin Anda kelola di Next.js, Anda bisa menentukannya di sini.
  // Pastikan tidak ada yang bertentangan dengan struktur hreflang Anda.
  async redirects() {
    return [
      // Contoh:
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true, // true untuk 308/301, false untuk 307/302
      // },
    ];
  },
};

module.exports = nextConfig;