// components/CurrencyContext.jsx
'use client';
// TAMBAHKAN useMemo DI SINI
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'; // <--- TAMBAHKAN useMemo
import { currencyContent, defaultCurrency } from '@/config/currency';

const CurrencyContext = createContext(null);

export function CurrencyProvider({ children, initialLang }) {
  // 1. Inisialisasi default yang konsisten di server dan klien
  const defaultCurrencyObj = useMemo(() => {
    // Logika untuk menentukan default currency berdasarkan initialLang
    // Ini harus sama di server dan klien untuk rendering awal
    const initialCodeFromLang = initialLang === 'fr' ? 'EUR' : defaultCurrency;
    const foundDefault = currencyContent.find(c => c.currency === initialCodeFromLang);
    if (!foundDefault) {
      console.warn(`Default currency for initialLang (${initialLang}) or defaultCurrency (${defaultCurrency}) not found in currencyContent.`);
      return currencyContent.find(c => c.currency === 'USD') || { currency: 'USD', language: 'en-us', symbol: '$', name: 'US Dollar' }; // Fallback paling aman
    }
    return foundDefault;
  }, [initialLang]);

  // 2. Gunakan useState untuk state actual currency.
  // Inisialisasi awal dengan nilai default yang konsisten dari server.
  const [currency, setCurrency] = useState(defaultCurrencyObj);

  // 3. Gunakan useEffect untuk membaca localStorage HANYA di sisi klien setelah mount.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrencyCode = localStorage.getItem('appCurrency');
      if (savedCurrencyCode) {
        const savedCurrency = currencyContent.find(c => c.currency === savedCurrencyCode);
        // Hanya update state jika savedCurrency berbeda dari current default
        if (savedCurrency && savedCurrency.currency !== currency.currency) {
          setCurrency(savedCurrency);
        }
      }
    }
  }, []); // [] agar hanya berjalan sekali saat mount di klien

  // 4. Efek untuk menyimpan mata uang ke localStorage saat berubah
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