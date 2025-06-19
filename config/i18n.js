// config/i18n.js
// Pastikan 'htmlLangCode' adalah kode BCP 47 yang valid untuk atribut 'lang' HTML
// Mengikuti format: language-REGION (contoh: en-US, es-ES) atau hanya language (contoh: id, fr, de)
// Jika localeCode adalah 'xx-yy', htmlLangCode cenderung 'xx-YY'.
// Jika code adalah 'xx', htmlLangCode cenderung 'xx'.
export const i18nConfig = [
    { id: 1, currency: 'USD', language: 'en', localeCode: 'en-us', htmlLangCode: 'en-US', code: 'us', name: 'English (US)', flagLink: 'https://flagcdn.com/us.svg' }, // Menambahkan 'code' untuk konsistensi
    { id: 2, currency: 'EUR', language: 'de', localeCode: 'de-de', htmlLangCode: 'de-DE', code: 'de', name: 'Deutsch (DE)', flagLink: 'https://flagcdn.com/de.svg' },
    { id: 3, currency: 'GBP', language: 'en', localeCode: 'en-gb', htmlLangCode: 'en-GB', code: 'gb', name: 'Pound Sterling', flagLink: 'https://flagcdn.com/gb.svg' }, // Tambahkan ini jika Anda punya GB
    { id: 4, currency: 'PLN', language: 'pl', localeCode: 'pl-pl', htmlLangCode: 'pl-PL', code: 'pl', name: 'Polski', flagLink: 'https://flagcdn.com/pl.svg' },
    { id: 5, currency: 'BGN', language: 'bg', localeCode: 'bg-bg', htmlLangCode: 'bg-BG', code: 'bg', name: 'Български', flagLink: 'https://flagcdn.com/bg.svg' },
    { id: 6, currency: 'THB', language: 'th', localeCode: 'th-th', htmlLangCode: 'th-TH', code: 'th', name: 'ไทย', flagLink: 'https://flagcdn.com/th.svg' },
    { id: 7, currency: 'AUD', language: 'en', localeCode: 'en-au', htmlLangCode: 'en-AU', code: 'au', name: 'Australian Dollar', flagLink: 'https://flagcdn.com/au.svg' }, // Tambahkan ini jika Anda punya AU
    { id: 8, currency: 'HKD', language: 'zh', localeCode: 'zh-hk', htmlLangCode: 'zh-HK', code: 'hk', name: '中文 (HK)', flagLink: 'https://flagcdn.com/hk.svg' },
    { id: 9, currency: 'CAD', language: 'en', localeCode: 'en-ca', htmlLangCode: 'en-CA', code: 'ca', name: 'Canadian Dollar', flagLink: 'https://flagcdn.com/ca.svg' }, // Tambahkan ini jika Anda punya CA
    { id: 10, currency: 'NZD', language: 'en', localeCode: 'en-nz', htmlLangCode: 'en-NZ', code: 'nz', name: 'New Zealand Dollar', flagLink: 'https://flagcdn.com/nz.svg' }, // Tambahkan ini jika Anda punya NZ
    { id: 11, currency: 'SGD', language: 'en', localeCode: 'en-sg', htmlLangCode: 'en-SG', code: 'sg', name: 'Singapore Dollar', flagLink: 'https://flagcdn.com/sg.svg' }, // Tambahkan ini jika Anda punya SG
    { id: 13, currency: 'UAH', language: 'uk', localeCode: 'uk-ua', htmlLangCode: 'uk-UA', code: 'uk', name: 'Українська', flagLink: 'https://flagcdn.com/ua.svg' },
    { id: 14, currency: 'CZK', language: 'cs', localeCode: 'cs-cz', htmlLangCode: 'cs-CZ', code: 'cz', name: 'Čeština', flagLink: 'https://flagcdn.com/cz.svg' },
    { id: 15, currency: 'DKK', language: 'da', localeCode: 'da-dk', htmlLangCode: 'da-DK', code: 'da', name: 'Dansk', flagLink: 'https://flagcdn.com/dk.svg' },
    { id: 16, currency: 'NOK', language: 'no', localeCode: 'no-no', htmlLangCode: 'no-NO', code: 'no', name: 'Norsk', flagLink: 'https://flagcdn.com/no.svg' },
    { id: 17, currency: 'SEK', language: 'sv', localeCode: 'sv-se', htmlLangCode: 'sv-SE', code: 'sv', name: 'Svenska', flagLink: 'https://flagcdn.com/se.svg' },
    { id: 18, currency: 'RON', language: 'ro', localeCode: 'ro-ro', htmlLangCode: 'ro-RO', code: 'ro', name: 'Română', flagLink: 'https://flagcdn.com/ro.svg' },
    { id: 19, currency: 'TRY', language: 'tr', localeCode: 'tr-tr', htmlLangCode: 'tr-TR', code: 'tr', name: 'Türkçe', flagLink: 'https://flagcdn.com/tr.svg' },
    { id: 21, currency: 'BRL', language: 'pt', localeCode: 'pt-br', htmlLangCode: 'pt-BR', code: 'br', name: 'Português (BR)', flagLink: 'https://flagcdn.com/br.svg' },
    { id: 22, currency: 'MYR', language: 'ms', localeCode: 'ms-my', htmlLangCode: 'ms-MY', code: 'my', name: 'Bahasa Melayu', flagLink: 'https://flagcdn.com/my.svg' },
    { id: 24, currency: 'RUB', language: 'ru', localeCode: 'ru-ru', htmlLangCode: 'ru-RU', code: 'ru', name: 'Русский', flagLink: 'https://flagcdn.com/ru.svg' },
    { id: 25, currency: 'IDR', language: 'id', localeCode: 'id-id', htmlLangCode: 'id-ID', code: 'id', name: 'Bahasa Indonesia', flagLink: 'https://flagcdn.com/id.svg' },
    { id: 26, currency: 'ILS', language: 'he', localeCode: 'he-il', htmlLangCode: 'he-IL', code: 'il', name: 'עברית', flagLink: 'https://flagcdn.com/il.svg' },
    { id: 27, currency: 'KRW', language: 'ko', localeCode: 'ko-kr', htmlLangCode: 'ko-KR', code: 'kr', name: '한국어', flagLink: 'https://flagcdn.com/kr.svg' },
    { id: 28, currency: 'JPY', language: 'ja', localeCode: 'ja-jp', htmlLangCode: 'ja-JP', code: 'jp', name: 'Japanese Yen', flagLink: 'https://flagcdn.com/jp.svg' },
    { id: 29, currency: 'CNY', language: 'zh', localeCode: 'zh-cn', htmlLangCode: 'zh-CN', code: 'cn', name: 'Chinese Yuan', flagLink: 'https://flagcdn.com/cn.svg' },
    { id: 30, currency: 'EUR', language: 'es', localeCode: 'es-es', htmlLangCode: 'es-ES', code: 'es', name: 'Spanish Euro', flagLink: 'https://flagcdn.com/es.svg' },
    { id: 31, currency: 'EUR', language: 'fr', localeCode: 'fr-fr', htmlLangCode: 'fr-FR', code: 'fr', name: 'French Euro', flagLink: 'https://flagcdn.com/fr.svg' },
    { id: 32, currency: 'EUR', language: 'it', localeCode: 'it-it', htmlLangCode: 'it-IT', code: 'it', name: 'Italian Euro', flagLink: 'https://flagcdn.com/it.svg' },
    { id: 33, currency: 'EUR', language: 'nl', localeCode: 'nl-nl', htmlLangCode: 'nl-NL', code: 'nl', name: 'Dutch Euro', flagLink: 'https://flagcdn.com/nl.svg' },
    { id: 34, currency: 'INR', language: 'en', localeCode: 'en-in', htmlLangCode: 'en-IN', code: 'in', name: 'Indian Rupee', flagLink: 'https://flagcdn.com/in.svg' },
    { id: 35, currency: 'MXN', language: 'es', localeCode: 'es-mx', htmlLangCode: 'es-MX', code: 'mx', name: 'Mexican Peso', flagLink: 'https://flagcdn.com/mx.svg' },
    { id: 36, currency: 'SAR', language: 'ar', localeCode: 'ar-sa', htmlLangCode: 'ar-SA', code: 'sa', name: 'Saudi Riyal', flagLink: 'https://flagcdn.com/sa.svg' },
    { id: 37, currency: 'CHF', language: 'de', localeCode: 'de-ch', htmlLangCode: 'de-CH', code: 'ch', name: 'Swiss Franc', flagLink: 'https://flagcdn.com/ch.svg' },
    { id: 38, currency: 'ZAR', language: 'en', localeCode: 'en-za', htmlLangCode: 'en-ZA', code: 'za', name: 'South African Rand', flagLink: 'https://flagcdn.com/za.svg' },
    { id: 40, currency: 'EGP', language: 'ar', localeCode: 'ar-eg', htmlLangCode: 'ar-EG', code: 'eg', name: 'Egyptian Pound', flagLink: 'https://flagcdn.com/eg.svg' },

    // === TAMBAHAN UNTUK BAHASA GENERIK (REGION-INDEPENDENT) ===
    // Penting: code generik harus unik dan mewakili bahasa tanpa wilayah.
    // 'defaultRoute' menunjukkan ke mana slug generik ini harus mengarah jika ada pengalihan.
    // Jika tidak ada pengalihan yang diharapkan, set 'defaultRoute' sama dengan 'code'.
    // Ini adalah tempat kita menentukan target kanonis untuk hreflang generik.
    { code: 'en', name: 'English (Generic)', language: 'en', localeCode: 'en', htmlLangCode: 'en', defaultRoute: 'us' }, // 'en' generik akan diarahkan ke 'us'
    { code: 'es', name: 'Español (Generic)', language: 'es', localeCode: 'es', htmlLangCode: 'es', defaultRoute: 'es' }, // 'es' generik ke 'es' (Spanyol)
    { code: 'de', name: 'Deutsch (Generic)', language: 'de', localeCode: 'de', htmlLangCode: 'de', defaultRoute: 'de' }, // 'de' generik ke 'de' (Jerman)
    { code: 'pt', name: 'Português (Generic)', language: 'pt', localeCode: 'pt', htmlLangCode: 'pt', defaultRoute: 'br' }, // 'pt' generik ke 'br' (Brasil)
    { code: 'ar', name: 'العربية (Generic)', language: 'ar', localeCode: 'ar', htmlLangCode: 'ar', defaultRoute: 'sa' }, // 'ar' generik ke 'sa' (Arab Saudi)
    { code: 'zh', name: '中文 (Generic)', language: 'zh', localeCode: 'zh', htmlLangCode: 'zh', defaultRoute: 'cn' }, // 'zh' generik ke 'cn' (Tiongkok)
    // Untuk bahasa generik lainnya yang tidak memiliki defaultRoute spesifik,
    // kita bisa asumsikan defaultRoute adalah sama dengan 'code' mereka.
    // Atau tambahkan secara eksplisit: defaultRoute: 'bg'
    { code: 'bg', name: 'Български (Generic)', language: 'bg', localeCode: 'bg', htmlLangCode: 'bg', defaultRoute: 'bg' },
    { code: 'cs', name: 'Čeština (Generic)', language: 'cs', localeCode: 'cs', htmlLangCode: 'cs', defaultRoute: 'cz' },
    { code: 'da', name: 'Dansk (Generic)', language: 'da', localeCode: 'da', htmlLangCode: 'da', defaultRoute: 'da' },
    { code: 'fr', name: 'Français (Generic)', language: 'fr', localeCode: 'fr', htmlLangCode: 'fr', defaultRoute: 'fr' },
    { code: 'he', name: 'עברית (Generic)', language: 'he', localeCode: 'he', htmlLangCode: 'he', defaultRoute: 'il' },
    { code: 'id', name: 'Bahasa Indonesia (Generic)', language: 'id', localeCode: 'id', htmlLangCode: 'id', defaultRoute: 'id' },
    { code: 'it', name: 'Italiano (Generic)', language: 'it', localeCode: 'it', htmlLangCode: 'it', defaultRoute: 'it' },
    { code: 'ja', name: 'Japanese (Generic)', language: 'ja', localeCode: 'ja', htmlLangCode: 'ja', defaultRoute: 'jp' },
    { code: 'ko', name: '한국어 (Generic)', language: 'ko', localeCode: 'ko', htmlLangCode: 'ko', defaultRoute: 'kr' },
    { code: 'ms', name: 'Bahasa Melayu (Generic)', language: 'ms', localeCode: 'ms', htmlLangCode: 'ms', defaultRoute: 'my' },
    { code: 'nl', name: 'Nederlands (Generic)', language: 'nl', localeCode: 'nl', htmlLangCode: 'nl', defaultRoute: 'nl' },
    { code: 'no', name: 'Norsk (Generic)', language: 'no', localeCode: 'no', htmlLangCode: 'no', defaultRoute: 'no' },
    { code: 'pl', name: 'Polski (Generic)', language: 'pl', localeCode: 'pl', htmlLangCode: 'pl', defaultRoute: 'pl' },
    { code: 'ro', name: 'Română (Generic)', language: 'ro', localeCode: 'ro', htmlLangCode: 'ro', defaultRoute: 'ro' },
    { code: 'ru', name: 'Русский (Generic)', language: 'ru', localeCode: 'ru', htmlLangCode: 'ru', defaultRoute: 'ru' },
    { code: 'sv', name: 'Svenska (Generic)', language: 'sv', localeCode: 'sv', htmlLangCode: 'sv', defaultRoute: 'sv' },
    { code: 'th', name: 'ไทย (Generic)', language: 'th', localeCode: 'th', htmlLangCode: 'th', defaultRoute: 'th' },
    { code: 'tr', name: 'Türkçe (Generic)', language: 'tr', localeCode: 'tr', htmlLangCode: 'tr', defaultRoute: 'tr' },
    { code: 'uk', name: 'Українська (Generic)', language: 'uk', localeCode: 'uk', htmlLangCode: 'uk', defaultRoute: 'uk' },

];

export const locales = i18nConfig.map(config => config.code); // Tetap menggunakan 'code' untuk URL slug
export const defaultLocale = 'us'; // Pastikan ini adalah slug URL default yang diinginkan (misal: 'us' untuk en-US)
export const defaultHtmlLang = 'en-US'; // Default cadangan untuk atribut lang HTML jika tidak ada kecocokan