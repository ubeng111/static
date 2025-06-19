// config/i18n.js

// Definisi konfigurasi untuk setiap bahasa/wilayah.
// Setiap entri mewakili sebuah LOKALISASI SPESIFIK DENGAN URL SLUG KANONISNYA.
// Properti:
// - code: SLUG URL kanonis untuk lokalisasi ini (misal: 'us', 'sa', 'id').
//         Ini juga akan digunakan untuk `initialLangSlug` di ClientProviders dan nama folder dictionary.
// - htmlLangCode: Nilai untuk atribut `lang` di tag <html> dan `hreflang` di tag <link rel="alternate">.
//                 Harus sesuai dengan standar BCP 47 (misal: 'en-US', 'ar-SA', 'id').
// - name: Nama deskriptif untuk lokalisasi (untuk UI).
// - defaultForLanguage: Opsional. Gunakan 'true' jika lokalisasi ini adalah default
//                       ketika hanya bahasa umum yang diminta (misal: 'en-US' adalah default untuk 'en').
//                       Ini akan digunakan oleh middleware untuk pengalihan generik.
// - currency: Mata uang default untuk lokalisasi ini.
// - flagLink: Link ke ikon bendera.

export const i18nConfig = [
    // Bahasa Inggris
    { code: 'us', htmlLangCode: 'en-US', name: 'English (US)', currency: 'USD', flagLink: 'https://flagcdn.com/us.svg', defaultForLanguage: true },
    { code: 'gb', htmlLangCode: 'en-GB', name: 'English (UK)', currency: 'GBP', flagLink: 'https://flagcdn.com/gb.svg' },
    { code: 'au', htmlLangCode: 'en-AU', name: 'English (AU)', currency: 'AUD', flagLink: 'https://flagcdn.com/au.svg' },
    { code: 'ca', htmlLangCode: 'en-CA', name: 'English (CA)', currency: 'CAD', flagLink: 'https://flagcdn.com/ca.svg' },
    { code: 'nz', htmlLangCode: 'en-NZ', name: 'English (NZ)', currency: 'NZD', flagLink: 'https://flagcdn.com/nz.svg' },
    { code: 'sg', htmlLangCode: 'en-SG', name: 'English (SG)', currency: 'SGD', flagLink: 'https://flagcdn.com/sg.svg' },
    { code: 'in', htmlLangCode: 'en-IN', name: 'English (IN)', currency: 'INR', flagLink: 'https://flagcdn.com/in.svg' },
    { code: 'za', htmlLangCode: 'en-ZA', name: 'English (ZA)', currency: 'ZAR', flagLink: 'https://flagcdn.com/za.svg' },

    // Bahasa Arab
    { code: 'sa', htmlLangCode: 'ar-SA', name: 'العربية (السعودية)', currency: 'SAR', flagLink: 'https://flagcdn.com/sa.svg', defaultForLanguage: true }, // Default untuk bahasa Arab generik
    { code: 'eg', htmlLangCode: 'ar-EG', name: 'العربية (مصر)', currency: 'EGP', flagLink: 'https://flagcdn.com/eg.svg' },

    // Bahasa Cina
    { code: 'cn', htmlLangCode: 'zh-CN', name: '中文 (简体)', currency: 'CNY', flagLink: 'https://flagcdn.com/cn.svg', defaultForLanguage: true }, // Default untuk bahasa Cina generik
    { code: 'hk', htmlLangCode: 'zh-HK', name: '中文 (香港)', currency: 'HKD', flagLink: 'https://flagcdn.com/hk.svg' },
    { code: 'tw', htmlLangCode: 'zh-TW', name: '中文 (台灣)', currency: 'TWD', flagLink: 'https://flagcdn.com/tw.svg' }, // Anda belum punya ini, tapi contoh jika ada

    // Bahasa Jerman
    { code: 'de', htmlLangCode: 'de-DE', name: 'Deutsch (DE)', currency: 'EUR', flagLink: 'https://flagcdn.com/de.svg', defaultForLanguage: true },
    { code: 'ch', htmlLangCode: 'de-CH', name: 'Deutsch (CH)', currency: 'CHF', flagLink: 'https://flagcdn.com/ch.svg' },

    // Bahasa Spanyol
    { code: 'es', htmlLangCode: 'es-ES', name: 'Español (ES)', currency: 'EUR', flagLink: 'https://flagcdn.com/es.svg', defaultForLanguage: true },
    { code: 'mx', htmlLangCode: 'es-MX', name: 'Español (MX)', currency: 'MXN', flagLink: 'https://flagcdn.com/mx.svg' },

    // Bahasa Portugis
    { code: 'br', htmlLangCode: 'pt-BR', name: 'Português (BR)', currency: 'BRL', flagLink: 'https://flagcdn.com/br.svg', defaultForLanguage: true },

    // Bahasa Lainnya (Pastikan 'code' dan 'htmlLangCode' selalu konsisten)
    { code: 'pl', htmlLangCode: 'pl-PL', name: 'Polski', currency: 'PLN', flagLink: 'https://flagcdn.com/pl.svg', defaultForLanguage: true },
    // PERBAIKAN: Menghapus 'defaultForLanguage: true' untuk menghindari deklarasi hreflang 'bg' ganda bersama 'bg-BG'.
    { code: 'bg', htmlLangCode: 'bg-BG', name: 'Български', currency: 'BGN', flagLink: 'https://flagcdn.com/bg.svg' },
    { code: 'th', htmlLangCode: 'th-TH', name: 'ไทย', currency: 'THB', flagLink: 'https://flagcdn.com/th.svg', defaultForLanguage: true },
    { code: 'uk', htmlLangCode: 'uk-UA', name: 'Українська', currency: 'UAH', flagLink: 'https://flagcdn.com/ua.svg', defaultForLanguage: true },
    { code: 'cz', htmlLangCode: 'cs-CZ', name: 'Čeština', currency: 'CZK', flagLink: 'https://flagcdn.com/cz.svg', defaultForLanguage: true },
    { code: 'da', htmlLangCode: 'da-DK', name: 'Dansk', currency: 'DKK', flagLink: 'https://flagcdn.com/dk.svg', defaultForLanguage: true },
    { code: 'no', htmlLangCode: 'no-NO', name: 'Norsk', currency: 'NOK', flagLink: 'https://flagcdn.com/no.svg', defaultForLanguage: true },
    { code: 'sv', htmlLangCode: 'sv-SE', name: 'Svenska', currency: 'SEK', flagLink: 'https://flagcdn.com/se.svg', defaultForLanguage: true },
    { code: 'ro', htmlLangCode: 'ro-RO', name: 'Română', currency: 'RON', flagLink: 'https://flagcdn.com/ro.svg', defaultForLanguage: true },
    { code: 'tr', htmlLangCode: 'tr-TR', name: 'Türkçe', currency: 'TRY', flagLink: 'https://flagcdn.com/tr.svg', defaultForLanguage: true },
    // PERBAIKAN: Menghapus 'defaultForLanguage: true' untuk menghindari deklarasi hreflang 'ms' ganda bersama 'ms-MY'.
    { code: 'ms', htmlLangCode: 'ms-MY', name: 'Bahasa Melayu', currency: 'MYR', flagLink: 'https://flagcdn.com/my.svg' },
    { code: 'ru', htmlLangCode: 'ru-RU', name: 'Русский', currency: 'RUB', flagLink: 'https://flagcdn.com/ru.svg', defaultForLanguage: true },
    { code: 'id', htmlLangCode: 'id-ID', name: 'Bahasa Indonesia', currency: 'IDR', flagLink: 'https://flagcdn.com/id.svg', defaultForLanguage: true },
    { code: 'il', htmlLangCode: 'he-IL', name: 'עברית', currency: 'ILS', flagLink: 'https://flagcdn.com/il.svg', defaultForLanguage: true },
    { code: 'kr', htmlLangCode: 'ko-KR', name: '한국어', currency: 'KRW', flagLink: 'https://flagcdn.com/kr.svg', defaultForLanguage: true },
    { code: 'jp', htmlLangCode: 'ja-JP', name: 'Japanese', currency: 'JPY', flagLink: 'https://flagcdn.com/jp.svg', defaultForLanguage: true },
    { code: 'fr', htmlLangCode: 'fr-FR', name: 'Français', currency: 'EUR', flagLink: 'https://flagcdn.com/fr.svg', defaultForLanguage: true },
    { code: 'it', htmlLangCode: 'it-IT', name: 'Italiano', currency: 'EUR', flagLink: 'https://flagcdn.com/it.svg', defaultForLanguage: true },
    { code: 'nl', htmlLangCode: 'nl-NL', name: 'Nederlands', currency: 'EUR', flagLink: 'https://flagcdn.com/nl.svg', defaultForLanguage: true },
];

// Helper untuk menemukan konfigurasi default per bahasa generik (misal 'en' -> 'us')
export const defaultLanguageMap = new Map();
i18nConfig.forEach(config => {
    if (config.defaultForLanguage) {
        defaultLanguageMap.set(config.htmlLangCode.split('-')[0].toLowerCase(), config.code);
    }
});

// DEFAULT LOKALISASI: Harus menunjuk ke salah satu 'code' yang ada di i18nConfig
export const defaultLocale = 'us'; // Ini adalah slug URL default, misal: hoteloza.com/us/
export const defaultHtmlLang = 'en-US'; // Ini adalah htmlLangCode default, misal: en-US

// Semua slug URL yang valid
export const locales = i18nConfig.map(config => config.code);