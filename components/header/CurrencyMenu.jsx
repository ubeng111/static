// File: components/header/CurrencyMenu1.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCurrency } from '../CurrencyContext';

const CurrencyMenu = ({ textClass }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

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
    { id: 28, currency: 'JPY', language: 'ja-jp', symbol: '¥', name: 'Japanese Yen' },
    { id: 29, currency: 'CNY', language: 'zh-cn', symbol: '¥', name: 'Chinese Yuan' },
  ];

  const { currency, setCurrency } = useCurrency();

  const [initialCurrencyCode, setInitialCurrencyCode] = useState(() => {
    const urlCurrency = searchParams.get('currency');
    const defaultItem = currencyContent.find(item => item.currency === urlCurrency) || currencyContent.find(item => item.currency === 'USD');
    return defaultItem ? defaultItem.currency : 'USD';
  });

  useEffect(() => {
    if (currency?.currency && currency.currency !== initialCurrencyCode) {
      setInitialCurrencyCode(currency.currency);
    }
  }, [currency, initialCurrencyCode]);

  useEffect(() => {
    const urlCurrency = searchParams.get('currency');
    if (urlCurrency && currency?.currency !== urlCurrency) {
      const selectedCurrency = currencyContent.find((item) => item.currency === urlCurrency);
      if (selectedCurrency) {
        setCurrency(selectedCurrency);
      }
    }
  }, [searchParams, setCurrency, currency.currency, currencyContent]);

  const handleCurrencyChange = useCallback((e) => {
    const selectedValue = e.target.value;
    const selectedItem = currencyContent.find((item) => item.currency === selectedValue);
    
    if (selectedItem) {
      setCurrency(selectedItem);

      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set('currency', selectedItem.currency);

      if (pathname === '/') {
        const newHomeParams = new URLSearchParams();
        newHomeParams.set('currency', selectedItem.currency);
        router.replace(`/?${newHomeParams.toString()}`, { scroll: false });
      } else {
        if (!currentParams.get('city')) currentParams.set('city', '');
        if (!currentParams.get('city_id')) currentParams.set('city_id', '');
        if (!currentParams.get('adults')) currentParams.set('adults', '2');
        if (!currentParams.get('children')) currentParams.set('children', '0');
        if (!currentParams.get('rooms')) currentParams.set('rooms', '1');
        if (!currentParams.get('checkIn')) {
          const today = new Date();
          currentParams.set('checkIn', today.toISOString().split('T')[0]);
        }
        if (!currentParams.get('checkOut')) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          currentParams.set('checkOut', tomorrow.toISOString().split('T')[0]);
        }
        router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
      }
    }
  }, [router, searchParams, pathname, setCurrency, currencyContent]);

  return (
    <div className={`custom-currency-menu ${textClass}`}>
      <select
        value={initialCurrencyCode}
        onChange={handleCurrencyChange}
        className="custom-select"
        aria-label="Pilih mata uang"
      >
        {currencyContent.map((item) => (
          <option key={item.id} value={item.currency}>
            {item.currency}
          </option>
        ))}
      </select>

      {/* CSS yang disesuaikan untuk elemen <select> */}
      <style jsx>{`
        .custom-currency-menu {
          position: relative;
          display: inline-block;
          font-size: 14px;
          /* Sesuaikan lebar untuk UX yang lebih baik */
          min-width: 90px;  /* Meningkatkan min-width */
          max-width: 100px; /* Meningkatkan max-width, beri ruang lebih */
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #fff;
          cursor: pointer;
          user-select: none;
          z-index: 999;
          flex-shrink: 0;
          height: 32px;
          box-sizing: border-box;
        }

        .custom-select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 100%;
          height: 100%;
          padding: 0 12px; /* Padding untuk teks, pastikan cukup ruang */
          font-size: 14px;
          color: #000;
          background-color: transparent;
          border: none;
          outline: none;
          cursor: pointer;
          box-sizing: border-box;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }

        .custom-currency-menu::after {
          content: '▼';
          position: absolute;
          right: 8px; /* Pastikan ada jarak dari tepi */
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          pointer-events: none;
          color: #555;
        }

        .custom-select::-ms-expand {
            display: none;
        }

        /* Responsive styles for CurrencyMenu */
        @media (max-width: 767px) { /* Tablet Kecil & Mobile */
          .custom-currency-menu {
            min-width: 70px; /* Lebar lebih baik untuk mobile */
            max-width: 80px; /* Lebar lebih baik untuk mobile */
            height: 30px;
          }
          .custom-select {
            font-size: 12px; /* Font size sedikit lebih besar */
            padding: 0 8px; /* Padding disesuaikan */
          }
          .custom-currency-menu::after {
            right: 6px;
            font-size: 9px;
          }
        }

        @media (max-width: 479px) { /* Mobile Sangat Kecil */
          .custom-currency-menu {
            min-width: 60px; /* Lebar minimum yang lebih baik */
            max-width: 70px; /* Lebar maksimum yang lebih baik */
            height: 25px; /* Tinggi disesuaikan */
          }
          .custom-select {
            font-size: 11px; /* Font size sedikit lebih besar */
            padding: 0 5px; /* Padding disesuaikan */
          }
          .custom-currency-menu::after {
            right: 4px;
            font-size: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default CurrencyMenu;