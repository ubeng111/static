// config/i18n.js
// Pastikan 'htmlLangCode' adalah kode BCP 47 yang valid untuk atribut 'lang' HTML
// Mengikuti format: language-REGION (contoh: en-US, es-ES) atau hanya language (contoh: id, fr, de)
// Jika localeCode adalah 'xx-yy', htmlLangCode cenderung 'xx-YY'.
// Jika code adalah 'xx', htmlLangCode cenderung 'xx'.
export const i18nConfig = [
    { id: 1, currency: 'USD', language: 'en', localeCode: 'en-us', htmlLangCode: 'en-US', name: 'English (US)', flagLink: 'https://flagcdn.com/us.svg' }, // Menambahkan ID dan properti lainnya
    { id: 2, currency: 'EUR', language: 'de', localeCode: 'de-de', htmlLangCode: 'de-DE', name: 'Deutsch (DE)', flagLink: 'https://flagcdn.com/de.svg' },
    { id: 3, currency: 'GBP', language: 'en', localeCode: 'en-gb', htmlLangCode: 'en-GB', name: 'Pound Sterling', flagLink: 'https://flagcdn.com/gb.svg' }, // Tambahkan ini jika Anda punya GB
    { id: 4, currency: 'PLN', language: 'pl', localeCode: 'pl-pl', htmlLangCode: 'pl-PL', name: 'Polski', flagLink: 'https://flagcdn.com/pl.svg' },
    { id: 5, currency: 'BGN', language: 'bg', localeCode: 'bg-bg', htmlLangCode: 'bg-BG', name: 'Български', flagLink: 'https://flagcdn.com/bg.svg' },
    { id: 6, currency: 'THB', language: 'th', localeCode: 'th-th', htmlLangCode: 'th-TH', name: 'ไทย', flagLink: 'https://flagcdn.com/th.svg' },
    { id: 7, currency: 'AUD', language: 'en', localeCode: 'en-au', htmlLangCode: 'en-AU', name: 'Australian Dollar', flagLink: 'https://flagcdn.com/au.svg' }, // Tambahkan ini jika Anda punya AU
    { id: 8, currency: 'HKD', language: 'zh', localeCode: 'zh-hk', htmlLangCode: 'zh-HK', name: '中文 (HK)', flagLink: 'https://flagcdn.com/hk.svg' },
    { id: 9, currency: 'CAD', language: 'en', localeCode: 'en-ca', htmlLangCode: 'en-CA', name: 'Canadian Dollar', flagLink: 'https://flagcdn.com/ca.svg' }, // Tambahkan ini jika Anda punya CA
    { id: 10, currency: 'NZD', language: 'en', localeCode: 'en-nz', htmlLangCode: 'en-NZ', name: 'New Zealand Dollar', flagLink: 'https://flagcdn.com/nz.svg' }, // Tambahkan ini jika Anda punya NZ
    { id: 11, currency: 'SGD', language: 'en', localeCode: 'en-sg', htmlLangCode: 'en-SG', name: 'Singapore Dollar', flagLink: 'https://flagcdn.com/sg.svg' }, // Tambahkan ini jika Anda punya SG
    { id: 13, currency: 'UAH', language: 'uk', localeCode: 'uk-ua', htmlLangCode: 'uk-UA', name: 'Українська', flagLink: 'https://flagcdn.com/ua.svg' },
    { id: 14, currency: 'CZK', language: 'cs', localeCode: 'cs-cz', htmlLangCode: 'cs-CZ', name: 'Čeština', flagLink: 'https://flagcdn.com/cz.svg' },
    { id: 15, currency: 'DKK', language: 'da', localeCode: 'da-dk', htmlLangCode: 'da-DK', name: 'Dansk', flagLink: 'https://flagcdn.com/dk.svg' },
    { id: 16, currency: 'NOK', language: 'no', localeCode: 'no-no', htmlLangCode: 'no-NO', name: 'Norsk', flagLink: 'https://flagcdn.com/no.svg' },
    { id: 17, currency: 'SEK', language: 'sv', localeCode: 'sv-se', htmlLangCode: 'sv-SE', name: 'Svenska', flagLink: 'https://flagcdn.com/se.svg' },
    { id: 18, currency: 'RON', language: 'ro', localeCode: 'ro-ro', htmlLangCode: 'ro-RO', name: 'Română', flagLink: 'https://flagcdn.com/ro.svg' },
    { id: 19, currency: 'TRY', language: 'tr', localeCode: 'tr-tr', htmlLangCode: 'tr-TR', name: 'Türkçe', flagLink: 'https://flagcdn.com/tr.svg' },
    { id: 21, currency: 'BRL', language: 'pt', localeCode: 'pt-br', htmlLangCode: 'pt-BR', name: 'Português (BR)', flagLink: 'https://flagcdn.com/br.svg' },
    { id: 22, currency: 'MYR', language: 'ms', localeCode: 'ms-my', htmlLangCode: 'ms-MY', name: 'Bahasa Melayu', flagLink: 'https://flagcdn.com/my.svg' },
    { id: 24, currency: 'RUB', language: 'ru', localeCode: 'ru-ru', htmlLangCode: 'ru-RU', name: 'Русский', flagLink: 'https://flagcdn.com/ru.svg' },
    { id: 25, currency: 'IDR', language: 'id', localeCode: 'id-id', htmlLangCode: 'id-ID', name: 'Bahasa Indonesia', flagLink: 'https://flagcdn.com/id.svg' },
    { id: 26, currency: 'ILS', language: 'he', localeCode: 'he-il', htmlLangCode: 'he-IL', name: 'עברית', flagLink: 'https://flagcdn.com/il.svg' },
    { id: 27, currency: 'KRW', language: 'ko', localeCode: 'ko-kr', htmlLangCode: 'ko-KR', name: '한국어', flagLink: 'https://flagcdn.com/kr.svg' },
    { id: 28, currency: 'JPY', language: 'ja', localeCode: 'ja-jp', htmlLangCode: 'ja-JP', name: 'Japanese Yen', flagLink: 'https://flagcdn.com/jp.svg' },
    { id: 29, currency: 'CNY', language: 'zh', localeCode: 'zh-cn', htmlLangCode: 'zh-CN', name: 'Chinese Yuan', flagLink: 'https://flagcdn.com/cn.svg' },
    { id: 30, currency: 'EUR', language: 'es', localeCode: 'es-es', htmlLangCode: 'es-ES', name: 'Spanish Euro', flagLink: 'https://flagcdn.com/es.svg' },
    { id: 31, currency: 'EUR', language: 'fr', localeCode: 'fr-fr', htmlLangCode: 'fr-FR', name: 'French Euro', flagLink: 'https://flagcdn.com/fr.svg' },
    { id: 32, currency: 'EUR', language: 'it', localeCode: 'it-it', htmlLangCode: 'it-IT', name: 'Italian Euro', flagLink: 'https://flagcdn.com/it.svg' },
    { id: 33, currency: 'EUR', language: 'nl', localeCode: 'nl-nl', htmlLangCode: 'nl-NL', name: 'Dutch Euro', flagLink: 'https://flagcdn.com/nl.svg' },
    { id: 34, currency: 'INR', language: 'en', localeCode: 'en-in', htmlLangCode: 'en-IN', name: 'Indian Rupee', flagLink: 'https://flagcdn.com/in.svg' },
    { id: 35, currency: 'MXN', language: 'es', localeCode: 'es-mx', htmlLangCode: 'es-MX', name: 'Mexican Peso', flagLink: 'https://flagcdn.com/mx.svg' },
    { id: 36, currency: 'SAR', language: 'ar', localeCode: 'ar-sa', htmlLangCode: 'ar-SA', name: 'Saudi Riyal', flagLink: 'https://flagcdn.com/sa.svg' },
    { id: 37, currency: 'CHF', language: 'de', localeCode: 'de-ch', htmlLangCode: 'de-CH', name: 'Swiss Franc', flagLink: 'https://flagcdn.com/ch.svg' },
    { id: 38, currency: 'ZAR', language: 'en', localeCode: 'en-za', htmlLangCode: 'en-ZA', name: 'South African Rand', flagLink: 'https://flagcdn.com/za.svg' },
    { id: 40, currency: 'EGP', language: 'ar', localeCode: 'ar-eg', htmlLangCode: 'ar-EG', name: 'Egyptian Pound', flagLink: 'https://flagcdn.com/eg.svg' },

    // === TAMBAHAN UNTUK BAHASA GENERIK (REGION-INDEPENDENT) ===
    // Penting: Code generik harus unik dan mewakili bahasa tanpa wilayah.
    // Pilih salah satu localeCode atau buat file kamus khusus untuk generik ini.
    { code: 'en', name: 'English (Generic)', language: 'en', localeCode: 'en', htmlLangCode: 'en' }, // Mengarah ke 'us' di dictionary
    { code: 'es', name: 'Español (Generic)', language: 'es', localeCode: 'es', htmlLangCode: 'es' }, // Mengarah ke 'es' di dictionary
    { code: 'de', name: 'Deutsch (Generic)', language: 'de', localeCode: 'de', htmlLangCode: 'de' }, // Mengarah ke 'de' di dictionary
    { code: 'pt', name: 'Português (Generic)', language: 'pt', localeCode: 'pt', htmlLangCode: 'pt' }, // Mengarah ke 'br' di dictionary
    { code: 'ar', name: 'العربية (Generic)', language: 'ar', localeCode: 'ar', htmlLangCode: 'ar' }, // Mengarah ke 'sa' di dictionary
    { code: 'zh', name: '中文 (Generic)', language: 'zh', localeCode: 'zh', htmlLangCode: 'zh' }, // Mengarah ke 'cn' di dictionary
    { code: 'bg', name: 'Български (Generic)', language: 'bg', localeCode: 'bg', htmlLangCode: 'bg' },
    { code: 'cs', name: 'Čeština (Generic)', language: 'cs', localeCode: 'cs', htmlLangCode: 'cs' },
    { code: 'da', name: 'Dansk (Generic)', language: 'da', localeCode: 'da', htmlLangCode: 'da' },
    { code: 'fr', name: 'Français (Generic)', language: 'fr', localeCode: 'fr', htmlLangCode: 'fr' },
    { code: 'he', name: 'עברית (Generic)', language: 'he', localeCode: 'he', htmlLangCode: 'he' },
    { code: 'id', name: 'Bahasa Indonesia (Generic)', language: 'id', localeCode: 'id', htmlLangCode: 'id' },
    { code: 'it', name: 'Italiano (Generic)', language: 'it', localeCode: 'it', htmlLangCode: 'it' },
    { code: 'ja', name: 'Japanese (Generic)', language: 'ja', localeCode: 'ja', htmlLangCode: 'ja' },
    { code: 'ko', name: '한국어 (Generic)', language: 'ko', localeCode: 'ko', htmlLangCode: 'ko' },
    { code: 'ms', name: 'Bahasa Melayu (Generic)', language: 'ms', localeCode: 'ms', htmlLangCode: 'ms' },
    { code: 'nl', name: 'Nederlands (Generic)', language: 'nl', localeCode: 'nl', htmlLangCode: 'nl' },
    { code: 'no', name: 'Norsk (Generic)', language: 'no', localeCode: 'no', htmlLangCode: 'no' },
    { code: 'pl', name: 'Polski (Generic)', language: 'pl', localeCode: 'pl', htmlLangCode: 'pl' },
    { code: 'ro', name: 'Română (Generic)', language: 'ro', localeCode: 'ro', htmlLangCode: 'ro' },
    { code: 'ru', name: 'Русский (Generic)', language: 'ru', localeCode: 'ru', htmlLangCode: 'ru' },
    { code: 'sv', name: 'Svenska (Generic)', language: 'sv', localeCode: 'sv', htmlLangCode: 'sv' },
    { code: 'th', name: 'ไทย (Generic)', language: 'th', localeCode: 'th', htmlLangCode: 'th' },
    { code: 'tr', name: 'Türkçe (Generic)', language: 'tr', localeCode: 'tr', htmlLangCode: 'tr' },
    { code: 'uk', name: 'Українська (Generic)', language: 'uk', localeCode: 'uk', htmlLangCode: 'uk' },

];

export const locales = i18nConfig.map(config => config.code); // Tetap menggunakan 'code' untuk URL slug
export const defaultLocale = 'us'; // Tetap 'us' agar URL default tidak berubah
export const defaultHtmlLang = 'en-US'; // Default cadangan untuk atribut lang HTML jika tidak ada kecocokan