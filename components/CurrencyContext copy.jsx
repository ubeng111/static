// components/CurrencyContext.jsx
'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Pastikan Anda juga memiliki file '@/config/currency.js' yang berisi currencyContent, defaultCurrency
import { currencyContent, defaultCurrency } from '@/config/currency';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children, initialLang }) { // Mengubah initialLang menjadi initialCurrencyCode lebih baik
  // Gunakan useState untuk mengelola state mata uang yang bisa berubah
  const [currency, setCurrency] = useState(() => {
    // Logika inisialisasi:
    // 1. Coba ambil dari localStorage
    // 2. Jika tidak ada di localStorage, gunakan initialLang untuk menentukan default
    // 3. Jika masih tidak ada, gunakan defaultCurrency
    if (typeof window !== 'undefined') {
      const savedCurrencyCode = localStorage.getItem('appCurrency');
      // Tentukan kode mata uang awal berdasarkan initialLang atau savedCurrencyCode
      // Asumsi initialLang bisa mapping ke currencyCode
      const initialCodeFromLang = initialLang === 'fr' ? 'EUR' : defaultCurrency; // Sesuaikan logika ini dengan maping lang ke currency Anda
      const initialCode = savedCurrencyCode || initialCodeFromLang;

      const foundCurrency = currencyContent.find(c => c.currency === initialCode);
      return foundCurrency || currencyContent.find(c => c.currency === defaultCurrency);
    }
    // Untuk Server Side Rendering (SSR) atau saat window tidak tersedia
    const defaultCurrencyObj = currencyContent.find(c => c.currency === defaultCurrency);
    if (!defaultCurrencyObj) {
      console.error("Default currency not found in currencyContent!");
      return { currency: 'USD', language: 'en-us', symbol: '$', name: 'US Dollar' }; // Fallback minimal
    }
    return defaultCurrencyObj;
  });

  // Efek untuk menyimpan mata uang ke localStorage saat berubah
  useEffect(() => {
    if (typeof window !== 'undefined' && currency) {
      localStorage.setItem('appCurrency', currency.currency);
    }
  }, [currency]); // Jalankan efek ini setiap kali 'currency' berubah

  // Fungsi yang diekspos untuk mengubah mata uang dari komponen anak
  const changeCurrency = useCallback((newCurrencyItem) => {
    const found = currencyContent.find(c => c.currency === newCurrencyItem.currency);
    if (found) {
      setCurrency(found); // Ini akan memicu re-render dan memperbarui nilai 'currency'
    } else {
      console.warn("Attempted to set an invalid currency:", newCurrencyItem);
    }
  }, []); // Dependensi kosong karena fungsi itu sendiri tidak bergantung pada state yang berubah

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: changeCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}