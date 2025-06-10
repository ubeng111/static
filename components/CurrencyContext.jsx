// components/CurrencyContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  // Data mata uang dan bahasa Agoda yang didukung
  const currencyContent = [
    { id: 1, currency: 'USD', language: 'en-us', symbol: '$', name: 'US Dollar' },
    { id: 2, currency: 'EUR', language: 'de-de', symbol: '€', name: 'Euro' },
    { id: 3, currency: 'GBP', language: 'en-gb', symbol: '£', name: 'Pound Sterling' },
    { id: 4, currency: 'PLN', language: 'pl-pl', symbol: 'zł', name: 'Polish Zloty' },
    { id: 5, currency: 'BGN', language: 'bg-bg', symbol: 'лв.', name: 'Bulgarian Lev' },
    { id: 6, currency: 'THB', language: 'th-th', symbol: '฿', name: 'Thai Baht' },
    { id: 7, currency: 'AUD', language: 'en-au', symbol: 'A$', name: 'Australian Dollar' },
    { id: 8, currency: 'HKD', language: 'zh-hk', symbol: 'HK$', name: 'Hong Kong Dollar' },
    { id: 9, currency: 'CAD', language: 'en-ca', symbol: 'CA$', name: 'Canadian Dollar' },
    { id: 10, currency: 'NZD', language: 'en-nz', symbol: 'NZ$', name: 'New Zealand Dollar' },
    { id: 11, currency: 'SGD', language: 'en-sg', symbol: 'S$', name: 'Singapore Dollar' },
    { id: 12, currency: 'CHF', language: 'de-ch', symbol: 'CHF', name: 'Swiss Franc' },
    { id: 13, currency: 'UAH', language: 'uk-ua', symbol: '₴', name: 'Ukrainian Hryvnia' },
    { id: 14, currency: 'CZK', language: 'cs-cz', symbol: 'Kč', name: 'Czech Koruna' },
    { id: 15, currency: 'DKK', language: 'da-dk', symbol: 'kr', name: 'Danish Krone' },
    { id: 16, currency: 'NOK', language: 'no-no', symbol: 'kr', name: 'Norwegian Krone' },
    { id: 17, currency: 'SEK', language: 'sv-se', symbol: 'kr', name: 'Swedish Krona' },
    { id: 18, currency: 'RON', language: 'ro-ro', symbol: 'L', name: 'Romanian Leu' },
    { id: 19, currency: 'TRY', language: 'tr-tr', symbol: '₺', name: 'Turkish Lira' },
    { id: 20, currency: 'ZAR', language: 'af-za', symbol: 'R', name: 'South African Rand' },
    { id: 21, currency: 'BRL', language: 'pt-br', symbol: 'R$', name: 'Brazilian Real' },
    { id: 22, currency: 'MYR', language: 'ms-my', symbol: 'RM', name: 'Malaysian Ringgit' },
    { id: 23, currency: 'SAR', language: 'ar-sa', symbol: 'ر.س', name: 'Saudi Riyal' },
    { id: 24, currency: 'RUB', language: 'ru-ru', symbol: '₽', name: 'Russian Ruble' },
    { id: 25, currency: 'IDR', language: 'id-id', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { id: 26, currency: 'ILS', language: 'he-il', symbol: '₪', name: 'Israeli Shekel' },
    { id: 27, currency: 'KRW', language: 'ko-kr', symbol: '₩', name: 'South Korean Won' },
    { id: 28, currency: 'JPY', language: 'ja-jp', symbol: '¥', name: 'Japanese Yen' }, // Jepang
    { id: 29, currency: 'CNY', language: 'zh-cn', symbol: '¥', name: 'Chinese Yuan' },
  ];

  // Inisialisasi state mata uang
  const [currency, setCurrency] = useState(() => {
    // Jalankan kode ini hanya di sisi klien saat inisialisasi state
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('currency');
      if (savedCurrency) {
        try {
          // Jika ada di localStorage, gunakan itu
          return JSON.parse(savedCurrency);
        } catch (e) {
          console.error('Failed to parse saved currency from localStorage:', e);
          // Fallback ke default jika parsing gagal
        }
      } else {
        // Jika tidak ada di localStorage, coba deteksi dari bahasa browser
        const browserLanguage = navigator.language || 'en-US'; // Contoh: "en-US", "ja", "id"
        const primaryBrowserLanguage = browserLanguage.split('-')[0].toLowerCase();

        const detectedFromBrowser = currencyContent.find(
          (item) => item.language.toLowerCase() === browserLanguage.toLowerCase() ||
                    item.language.startsWith(primaryBrowserLanguage)
        );

        if (detectedFromBrowser) {
          return detectedFromBrowser;
        }
      }
    }
    // Default jika tidak ada di localStorage atau deteksi browser, atau saat SSR
    return { currency: 'USD', language: 'en-us', symbol: '$', name: 'US Dollar' };
  });

  // Efek untuk menyimpan perubahan mata uang ke localStorage setiap kali state 'currency' berubah
  useEffect(() => {
    if (typeof window !== 'undefined' && currency) {
      try {
        localStorage.setItem('currency', JSON.stringify(currency));
      } catch (e) {
        console.error('Failed to save currency to localStorage:', e);
      }
    }
  }, [currency]); // Berjalan setiap kali 'currency' berubah

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}