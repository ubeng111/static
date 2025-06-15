// config/i18n.js
export const i18nConfig = [
    // Pastikan 'htmlLangCode' adalah kode BCP 47 yang valid untuk atribut 'lang' HTML
    { code: 'us', name: 'English (US)', language: 'en', localeCode: 'en-us', htmlLangCode: 'en-US' },
    { code: 'es', name: 'Español (ES)', language: 'es', localeCode: 'es-es', htmlLangCode: 'es' },
    { code: 'fr', name: 'Français', language: 'fr', localeCode: 'fr-fr', htmlLangCode: 'fr' },
    { code: 'it', name: 'Italiano', language: 'it', localeCode: 'it-it', htmlLangCode: 'it' },
    { code: 'nl', name: 'Nederlands', language: 'nl', localeCode: 'nl-nl', htmlLangCode: 'nl' },
    { code: 'de', name: 'Deutsch (DE)', language: 'de', localeCode: 'de-de', htmlLangCode: 'de' },
    { code: 'pl', name: 'Polski', language: 'pl', localeCode: 'pl-pl', htmlLangCode: 'pl' },
    { code: 'bg', name: 'Български', language: 'bg', localeCode: 'bg-bg', htmlLangCode: 'bg' },
    { code: 'th', name: 'ไทย', language: 'th', localeCode: 'th-th', htmlLangCode: 'th' },
    { code: 'hk', name: '中文 (HK)', language: 'zh', localeCode: 'zh-hk', htmlLangCode: 'zh-HK' }, // Diganti menjadi BCP 47 yang lebih spesifik
    { code: 'ua', name: 'Українська', language: 'uk', localeCode: 'uk-ua', htmlLangCode: 'uk' },
    { code: 'cz', name: 'Čeština', language: 'cs', localeCode: 'cs-cz', htmlLangCode: 'cs' },
    { code: 'dk', name: 'Dansk', language: 'da', localeCode: 'da-dk', htmlLangCode: 'da' },
    { code: 'no', name: 'Norsk', language: 'no', localeCode: 'no-no', htmlLangCode: 'no' },
    { code: 'se', name: 'Svenska', language: 'sv', localeCode: 'sv-se', htmlLangCode: 'sv' },
    { code: 'ro', name: 'Română', language: 'ro', localeCode: 'ro-ro', htmlLangCode: 'ro' },
    { code: 'tr', name: 'Türkçe', language: 'tr', localeCode: 'tr-tr', htmlLangCode: 'tr' },
    { code: 'br', name: 'Português (BR)', language: 'pt', localeCode: 'pt-br', htmlLangCode: 'pt-BR' }, // Diganti menjadi BCP 47 yang lebih spesifik
    { code: 'my', name: 'Bahasa Melayu', language: 'ms', localeCode: 'ms-my', htmlLangCode: 'ms' },
    { code: 'ru', name: 'Русский', language: 'ru', localeCode: 'ru-ru', htmlLangCode: 'ru' },
    { code: 'id', name: 'Bahasa Indonesia', language: 'id', localeCode: 'id-id', htmlLangCode: 'id' },
    { code: 'il', name: 'עברית', language: 'he', localeCode: 'he-il', htmlLangCode: 'he' },
    { code: 'kr', name: '한국어', language: 'ko', localeCode: 'ko-kr', htmlLangCode: 'ko-KR' }, // Diganti menjadi BCP 47 yang lebih spesifik
    { code: 'jp', name: '日本語', language: 'ja', localeCode: 'ja-jp', htmlLangCode: 'ja' },
    { code: 'cn', name: '中文 (CN)', language: 'zh', localeCode: 'zh-cn', htmlLangCode: 'zh-CN' }, // Diganti menjadi BCP 47 yang lebih spesifik
    { code: 'in', name: 'English (IN)', language: 'en', localeCode: 'en-in', htmlLangCode: 'en-IN' }, // Diganti menjadi BCP 47 yang lebih spesifik
    { code: 'mx', name: 'Español (MX)', language: 'es', localeCode: 'es-mx', htmlLangCode: 'es-MX' }, // Diganti menjadi BCP 47 yang lebih spesifik
    { code: 'sa', name: 'العربية (SA)', language: 'ar', localeCode: 'ar-sa', htmlLangCode: 'ar' },
    { code: 'ch', name: 'Deutsch (CH)', language: 'de', localeCode: 'de-ch', htmlLangCode: 'de' },
    { code: 'za', name: 'English (ZA)', language: 'en', localeCode: 'en-za', htmlLangCode: 'en-ZA' }, // Diganti menjadi BCP 47 yang lebih spesifik
    { code: 'eg', name: 'العربية (EG)', language: 'ar', localeCode: 'ar-eg', htmlLangCode: 'ar' },
];

export const locales = i18nConfig.map(config => config.code); // Tetap menggunakan 'code' untuk URL slug
export const defaultLocale = 'us'; // Tetap 'us' agar URL default tidak berubah
export const defaultHtmlLang = 'en-US'; // Tambahkan default baru untuk atribut lang HTML