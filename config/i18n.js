export const i18nConfig = [
    { code: 'us', name: 'English (US)', language: 'en', localeCode: 'en-us', htmlLangCode: 'en-US' },
    { code: 'es', name: 'Español (ES)', language: 'es', localeCode: 'es-es', htmlLangCode: 'es-ES' },
    { code: 'fr', name: 'Français', language: 'fr', localeCode: 'fr-fr', htmlLangCode: 'fr-FR' },
    { code: 'it', name: 'Italiano', language: 'it', localeCode: 'it-it', htmlLangCode: 'it-IT' },
    { code: 'nl', name: 'Nederlands', language: 'nl', localeCode: 'nl-nl', htmlLangCode: 'nl-NL' },
    { code: 'de', name: 'Deutsch (DE)', language: 'de', localeCode: 'de-de', htmlLangCode: 'de-DE' },
    { code: 'pl', name: 'Polski', language: 'pl', localeCode: 'pl-pl', htmlLangCode: 'pl-PL' },
    { code: 'bg', name: 'Български', language: 'bg', localeCode: 'bg-bg', htmlLangCode: 'bg-BG' },
    { code: 'th', name: 'ไทย', language: 'th', localeCode: 'th-th', htmlLangCode: 'th-TH' },
    { code: 'hk', name: '中文 (HK)', language: 'zh', localeCode: 'zh-hk', htmlLangCode: 'zh-HK' }, // Chinese (Traditional, Hong Kong)
    { code: 'ua', name: 'Українська', language: 'uk', localeCode: 'uk-ua', htmlLangCode: 'uk-UA' },
    { code: 'cz', name: 'Čeština', language: 'cs', localeCode: 'cs-cz', htmlLangCode: 'cs-CZ' },
    { code: 'dk', name: 'Dansk', language: 'da', localeCode: 'da-dk', htmlLangCode: 'da-DK' },
    { code: 'no', name: 'Norsk', language: 'no', localeCode: 'no-no', htmlLangCode: 'no-NO' },
    { code: 'se', name: 'Svenska', language: 'sv', localeCode: 'sv-se', htmlLangCode: 'sv-SE' },
    { code: 'ro', name: 'Română', language: 'ro', localeCode: 'ro-ro', htmlLangCode: 'ro-RO' },
    { code: 'tr', name: 'Türkçe', language: 'tr', localeCode: 'tr-tr', htmlLangCode: 'tr-TR' },
    { code: 'br', name: 'Português (BR)', language: 'pt', localeCode: 'pt-br', htmlLangCode: 'pt-BR' }, // Portuguese (Brazil)
    { code: 'my', name: 'Bahasa Melayu', language: 'ms', localeCode: 'ms-my', htmlLangCode: 'ms-MY' },
    { code: 'ru', name: 'Русский', language: 'ru', localeCode: 'ru-ru', htmlLangCode: 'ru-RU' },
    { code: 'id', name: 'Bahasa Indonesia', language: 'id', localeCode: 'id-id', htmlLangCode: 'id-ID' },
    { code: 'il', name: 'עברית', language: 'he', localeCode: 'he-il', htmlLangCode: 'he-IL' }, // Hebrew (Israel)
    { code: 'kr', name: '한국어', language: 'ko', localeCode: 'ko-kr', htmlLangCode: 'ko-KR' }, // Korean (Republic of Korea)
    { code: 'jp', name: '日本語', language: 'ja', localeCode: 'ja-jp', htmlLangCode: 'ja-JP' }, // Japanese (Japan)
    { code: 'cn', name: '中文 (CN)', language: 'zh', localeCode: 'zh-cn', htmlLangCode: 'zh-CN' }, // Chinese (Simplified, China)
    { code: 'en', name: 'English (Generic)', language: 'en', localeCode: 'en', htmlLangCode: 'en' },
    { code: 'es', name: 'Español (Generic)', language: 'es', localeCode: 'es', htmlLangCode: 'es' },
    { code: 'de', name: 'Deutsch (Generic)', language: 'de', localeCode: 'de', htmlLangCode: 'de' },
    { code: 'ar', name: 'العربية (Generic)', language: 'ar', localeCode: 'ar', htmlLangCode: 'ar' },
    { code: 'zh', name: '中文 (Generic)', language: 'zh', localeCode: 'zh', htmlLangCode: 'zh' },
    { code: 'pt', name: 'Português (Generic)', language: 'pt', localeCode: 'pt', htmlLangCode: 'pt' }, // Jika Anda memiliki konten Portugis umum selain BR

    { code: 'in', name: 'English (IN)', language: 'en', localeCode: 'en-in', htmlLangCode: 'en-IN' },
    { code: 'mx', name: 'Español (MX)', language: 'es', localeCode: 'es-mx', htmlLangCode: 'es-MX' },
    { code: 'sa', name: 'العربية (SA)', language: 'ar', localeCode: 'ar-sa', htmlLangCode: 'ar-SA' },
    { code: 'ch', name: 'Deutsch (CH)', language: 'de', localeCode: 'de-ch', htmlLangCode: 'de-CH' },
    { code: 'za', name: 'English (ZA)', language: 'en', locale: 'en-za', htmlLangCode: 'en-ZA' },
    { code: 'eg', name: 'العربية (EG)', language: 'ar', localeCode: 'ar-eg', htmlLangCode: 'ar-EG' },
];

export const locales = i18nConfig.map(config => config.code); // Tetap menggunakan 'code' untuk URL slug
export const defaultLocale = 'us'; // Tetap 'us' agar URL default tidak berubah
export const defaultHtmlLang = 'en-US'; // Default cadangan untuk atribut lang HTML jika tidak ada kecocokan