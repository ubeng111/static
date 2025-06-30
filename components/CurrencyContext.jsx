// components/CurrencyContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState({
    currency: 'USD',
    language: 'en-us',
    symbol: '$',
    name: 'US Dollar',
  });

  // Initialize currency from localStorage or URL parameters
  useEffect(() => {
    const savedCurrency = localStorage.getItem('currency');
    if (savedCurrency) {
      try {
        setCurrency(JSON.parse(savedCurrency));
      } catch (e) {
        console.error('Failed to parse saved currency:', e);
      }
    }
  }, []);

  // Update localStorage when currency changes
  useEffect(() => {
    try {
      localStorage.setItem('currency', JSON.stringify(currency));
    } catch (e) {
      console.error('Failed to save currency to localStorage:', e);
    }
  }, [currency]);

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