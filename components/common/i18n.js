import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: [
      'de', 'en', 'es', 'ar', 'bg', 'ms', 'zh', 'cs', 'da',
      'de-at', 'en-gb', 'en-in', 'en-ca', 'en-nz', 'es-mx', 'fr',
      'el', 'he', 'it', 'ja', 'ko', 'hu', 'nl', 'no', 'pl',
      'pt', 'pt-br', 'ro', 'ru', 'sv', 'tr', 'uk', 'vi', 'th',
      'id', 'fr-ca', 'en-au'
    ],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common'],
    defaultNS: 'common',
    detection: {
      order: ['path', 'navigator'],
      lookupFromPathIndex: 0,
    },
  });

export default i18n;