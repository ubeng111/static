// components/header/LanguageContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { i18nConfig, defaultLocale } from '@/config/i18n';
import { currencyContent } from '@/config/currency';

const LanguageContext = createContext();

export function LanguageProvider({ children, initialLang }) {
  const [language, setLanguage] = useState(() => {
    if (initialLang) {
      const matchingConfig = i18nConfig.find(
        (config) => config.countryCode.toLowerCase() === initialLang.toLowerCase()
      );
      if (matchingConfig) {
        return matchingConfig.code;
      }
    }
    const defaultLocaleConfig = i18nConfig.find(config => config.countryCode === defaultLocale);
    return defaultLocaleConfig ? defaultLocaleConfig.code : 'en-us';
  });

  // PERIKSA useEffect ini.
  // Jika `language` sudah sama dengan `newDetectedLocale`, setLanguage tidak perlu dipanggil.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('appLocale');
      let newDetectedLocale = null;

      if (savedLocale) {
        newDetectedLocale = savedLocale;
      } else {
        const browserLanguage = navigator.language || 'en-US';
        const browserLangCode = browserLanguage.toLowerCase();
        
        const directMatch = i18nConfig.find((config) => config.code.toLowerCase() === browserLangCode);
        if (directMatch) {
          newDetectedLocale = directMatch.code;
        } else {
          const primaryBrowserLang = browserLangCode.split('-')[0];
          const primaryLangMatch = i18nConfig.find((config) => config.code.startsWith(primaryBrowserLang));
          if (primaryLangMatch) {
            newDetectedLocale = primaryLangMatch.code;
          }
        }
      }

      // KOREKSI: Hanya panggil setLanguage jika nilainya benar-benar berbeda
      if (newDetectedLocale && newDetectedLocale !== language) {
        setLanguage(newDetectedLocale);
      }
    }
  }, [language]); // Dependensi `language` di sini OK karena `setLanguage` hanya dipanggil kondisional

  // PERIKSA useEffect ini (untuk menyimpan ke localStorage)
  // Ini juga harus memanggil localStorage.setItem hanya jika language berubah.
  useEffect(() => {
    if (typeof window !== 'undefined' && language) {
      localStorage.setItem('appLocale', language);
    }
  }, [language]); // Dependensi `language` di sini OK

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}