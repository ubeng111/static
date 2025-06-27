// config/i18n.js
export const i18nConfig = [
    // HANYA MASUKKAN LOCALE SPESIFIK WILAYAH YANG ANDA INGINKAN
    { code: 'en-us', name: 'English (US)', language: 'en', localeCode: 'en-us', htmlLangCode: 'en-us', dictionaryCode: 'us', defaultForLanguage: true },
    { code: 'es-es', name: 'Español (ES)', language: 'es', localeCode: 'es-es', htmlLangCode: 'es-es', dictionaryCode: 'es', defaultForLanguage: true },
    { code: 'fr-fr', name: 'Français', language: 'fr', localeCode: 'fr-fr', htmlLangCode: 'fr-fr', dictionaryCode: 'fr', defaultForLanguage: true },
    { code: 'it-it', name: 'Italiano', language: 'it', localeCode: 'it-it', htmlLangCode: 'it-it', dictionaryCode: 'it', defaultForLanguage: true },
    { code: 'nl-nl', name: 'Nederlands', language: 'nl', localeCode: 'nl-nl', htmlLangCode: 'nl-nl', dictionaryCode: 'nl', defaultForLanguage: true },
    { code: 'de-de', name: 'Deutsch (DE)', language: 'de', localeCode: 'de-de', htmlLangCode: 'de-de', dictionaryCode: 'de', defaultForLanguage: true },
    { code: 'pl-pl', name: 'Polski', language: 'pl', localeCode: 'pl-pl', htmlLangCode: 'pl-pl', dictionaryCode: 'pl', defaultForLanguage: true },
    { code: 'bg-bg', name: 'Български', language: 'bg', localeCode: 'bg-bg', htmlLangCode: 'bg-bg', dictionaryCode: 'bg', defaultForLanguage: true },
    { code: 'th-th', name: 'ไทย', language: 'th', localeCode: 'th-th', htmlLangCode: 'th-th', dictionaryCode: 'th', defaultForLanguage: true },
    { code: 'zh-hk', name: '中文 (HK)', language: 'zh', localeCode: 'zh-hk', htmlLangCode: 'zh-hk', dictionaryCode: 'hk', defaultForLanguage: true },
    { code: 'uk-ua', name: 'Українська', language: 'uk', localeCode: 'uk-ua', htmlLangCode: 'uk-ua', dictionaryCode: 'ua', defaultForLanguage: true },
    { code: 'cs-cz', name: 'Čeština', language: 'cs', localeCode: 'cs-cz', htmlLangCode: 'cs-cz', dictionaryCode: 'cz', defaultForLanguage: true },
    { code: 'da-dk', name: 'Dansk', language: 'da', localeCode: 'da-dk', htmlLangCode: 'da-dk', dictionaryCode: 'dk', defaultForLanguage: true },
    { code: 'no-no', name: 'Norsk', language: 'no', localeCode: 'no-no', htmlLangCode: 'no-no', dictionaryCode: 'no', defaultForLanguage: true },
    { code: 'sv-se', name: 'Svenska', language: 'sv', localeCode: 'sv-se', htmlLangCode: 'sv-se', dictionaryCode: 'se', defaultForLanguage: true },
    { code: 'ro-ro', name: 'Română', language: 'ro', localeCode: 'ro-ro', htmlLangCode: 'ro-ro', dictionaryCode: 'ro', defaultForLanguage: true },
    { code: 'tr-tr', name: 'Türkçe', language: 'tr', localeCode: 'tr-tr', htmlLangCode: 'tr-tr', dictionaryCode: 'tr', defaultForLanguage: true },
    { code: 'pt-br', name: 'Português (BR)', language: 'pt', localeCode: 'pt-br', htmlLangCode: 'pt-br', dictionaryCode: 'br', defaultForLanguage: true },
    { code: 'ms-my', name: 'Bahasa Melayu', language: 'ms', localeCode: 'ms-my', htmlLangCode: 'ms-my', dictionaryCode: 'my', defaultForLanguage: true },
    { code: 'ru-ru', name: 'Русский', language: 'ru', localeCode: 'ru-ru', htmlLangCode: 'ru-ru', dictionaryCode: 'ru', defaultForLanguage: true },
    { code: 'id-id', name: 'Bahasa Indonesia', language: 'id', localeCode: 'id-id', htmlLangCode: 'id-id', dictionaryCode: 'id', defaultForLanguage: true },
    { code: 'he-il', name: 'עברית', language: 'he', localeCode: 'he-il', htmlLangCode: 'he-il', dictionaryCode: 'il', defaultForLanguage: true },
    { code: 'ko-kr', name: '한국어', language: 'ko', localeCode: 'ko-kr', htmlLangCode: 'ko-kr', dictionaryCode: 'kr', defaultForLanguage: true },
    { code: 'ja-jp', name: '日本語', language: 'ja', localeCode: 'ja-jp', htmlLangCode: 'ja-jp', dictionaryCode: 'jp', defaultForLanguage: true },
    { code: 'zh-cn', name: '中文 (CN)', language: 'zh', localeCode: 'zh-cn', htmlLangCode: 'zh-cn', dictionaryCode: 'cn' },
    { code: 'en-in', name: 'English (IN)', language: 'en', localeCode: 'en-in', htmlLangCode: 'en-in', dictionaryCode: 'in' },
    { code: 'es-mx', name: 'Español (MX)', language: 'es', localeCode: 'es-mx', htmlLangCode: 'es-mx', dictionaryCode: 'mx' },
    { code: 'ar-sa', name: 'العربية (SA)', language: 'ar', localeCode: 'ar-sa', htmlLangCode: 'ar-sa', dictionaryCode: 'sa', defaultForLanguage: true },
    { code: 'de-ch', name: 'Deutsch (CH)', language: 'de', localeCode: 'de-ch', htmlLangCode: 'de-ch', dictionaryCode: 'ch' },
    { code: 'en-za', name: 'English (ZA)', language: 'en', localeCode: 'en-za', htmlLangCode: 'en-za', dictionaryCode: 'za' },
    { code: 'ar-eg', name: 'العربية (EG)', language: 'ar', localeCode: 'ar-eg', htmlLangCode: 'ar-eg', dictionaryCode: 'eg' },
];

export const locales = i18nConfig.map(config => config.code);
export const defaultLocale = 'en-us';
export const defaultHtmlLang = 'en-us';
export const defaultDictionaryCode = 'us';

// Tambahkan daftar kode bahasa generik (satu kata) yang ingin Anda referensikan untuk hreflang
export const genericLanguages = [
    { langCode: 'en', defaultRegional: 'en-us' },
    { langCode: 'es', defaultRegional: 'es-es' },
    { langCode: 'fr', defaultRegional: 'fr-fr' },
    { langCode: 'it', defaultRegional: 'it-it' },
    { langCode: 'nl', defaultRegional: 'nl-nl' },
    { langCode: 'de', defaultRegional: 'de-de' },
    { langCode: 'pl', defaultRegional: 'pl-pl' },
    { langCode: 'bg', defaultRegional: 'bg-bg' },
    { langCode: 'th', defaultRegional: 'th-th' },
    { langCode: 'zh', defaultRegional: 'zh-hk' },
    { langCode: 'uk', defaultRegional: 'uk-ua' },
    { langCode: 'cs', defaultRegional: 'cs-cz' },
    { langCode: 'da', defaultRegional: 'da-dk' },
    { langCode: 'no', defaultRegional: 'no-no' },
    { langCode: 'sv', defaultRegional: 'sv-se' },
    { langCode: 'ro', defaultRegional: 'ro-ro' },
    { langCode: 'tr', defaultRegional: 'tr-tr' },
    { langCode: 'pt', defaultRegional: 'pt-br' },
    { langCode: 'ms', defaultRegional: 'ms-my' },
    { langCode: 'ru', defaultRegional: 'ru-ru' },
    { langCode: 'id', defaultRegional: 'id-id' },
    { langCode: 'he', defaultRegional: 'he-il' },
    { langCode: 'ko', defaultRegional: 'ko-kr' },
    { langCode: 'ja', defaultRegional: 'ja-jp' },
    { langCode: 'ar', defaultRegional: 'ar-sa' },
];