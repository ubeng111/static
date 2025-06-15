// config/i18n.js
export const i18nConfig = [
    { code: 'us', name: 'English (US)', language: 'en', localeCode: 'en-us' },
    { code: 'es', name: 'Español (ES)', language: 'es', localeCode: 'es-es' },
    { code: 'fr', name: 'Français', language: 'fr', localeCode: 'fr-fr' },
    { code: 'it', name: 'Italiano', language: 'it', localeCode: 'it-it' },
    { code: 'nl', name: 'Nederlands', language: 'nl', localeCode: 'nl-nl' },
    { code: 'de', name: 'Deutsch (DE)', language: 'de', localeCode: 'de-de' },
    { code: 'pl', name: 'Polski', language: 'pl', localeCode: 'pl-pl' },
    { code: 'bg', name: 'Български', language: 'bg', localeCode: 'bg-bg' },
    { code: 'th', name: 'ไทย', language: 'th', localeCode: 'th-th' },
    { code: 'hk', name: '中文 (HK)', language: 'zh', localeCode: 'zh-hk' }, // Hong Kong (Traditional Chinese)
    { code: 'ua', name: 'Українська', language: 'uk', localeCode: 'uk-ua' },
    { code: 'cz', name: 'Čeština', language: 'cs', localeCode: 'cs-cz' },
    { code: 'dk', name: 'Dansk', language: 'da', localeCode: 'da-dk' },
    { code: 'no', name: 'Norsk', language: 'no', localeCode: 'no-no' },
    { code: 'se', name: 'Svenska', language: 'sv', localeCode: 'sv-se' },
    { code: 'ro', name: 'Română', language: 'ro', localeCode: 'ro-ro' },
    { code: 'tr', name: 'Türkçe', language: 'tr', localeCode: 'tr-tr' },
    { code: 'br', name: 'Português (BR)', language: 'pt', localeCode: 'pt-br' },
    { code: 'my', name: 'Bahasa Melayu', language: 'ms', localeCode: 'ms-my' },
    { code: 'ru', name: 'Русский', language: 'ru', localeCode: 'ru-ru' },
    { code: 'id', name: 'Bahasa Indonesia', language: 'id', localeCode: 'id-id' },
    { code: 'il', name: 'עברית', language: 'he', localeCode: 'he-il' },
    { code: 'kr', name: '한국어', language: 'ko', localeCode: 'ko-kr' },
    { code: 'jp', name: '日本語', language: 'ja', localeCode: 'ja-jp' },
    { code: 'cn', name: '中文 (CN)', language: 'zh', localeCode: 'zh-cn' }, // Mainland China (Simplified Chinese)
    { code: 'in', name: 'English (IN)', language: 'en', localeCode: 'en-in' },
    { code: 'mx', name: 'Español (MX)', language: 'es', localeCode: 'es-mx' },
    { code: 'sa', name: 'العربية (SA)', language: 'ar', localeCode: 'ar-sa' }, // Arabic (Saudi Arabia)
    { code: 'ch', name: 'Deutsch (CH)', language: 'de', localeCode: 'de-ch' },
    { code: 'za', name: 'English (ZA)', language: 'en', localeCode: 'en-za' },
    { code: 'eg', name: 'العربية (EG)', language: 'ar', localeCode: 'ar-eg' }, // Arabic (Egypt)
];

export const locales = i18nConfig.map(config => config.code); // URL path will use this (e.g., /us, /id, /cn, /hk)
export const defaultLocale = 'us';