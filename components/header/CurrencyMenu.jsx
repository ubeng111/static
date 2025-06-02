'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCurrency } from '../CurrencyContext';

const CurrencyMenu = ({ textClass }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();

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

  useEffect(() => {
    if (!searchParams) return;
    const urlCurrency = searchParams.get('currency');
    if (urlCurrency && !currency.currency) {
      const selectedCurrency = currencyContent.find((item) => item.currency === urlCurrency);
      if (selectedCurrency) {
        setCurrency(selectedCurrency);
      }
    }
  }, [searchParams, setCurrency]);

  const handleItemClick = (item) => {
    setCurrency(item);
    if (pathname !== '/') {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set('currency', item.currency);
      currentParams.set('language', item.language);
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
      router.replace(`/search?${currentParams.toString()}`, { scroll: false });
    }
  };

  return (
    <div className="currency-menu-container relative flex-shrink-0 w-[60px] xs:w-[80px] sm:w-[100px] bg-white rounded-xl border border-gray-200 shadow-sm">
      <select
        value={currency?.currency || 'USD'}
        onChange={(e) => {
          const selectedItem = currencyContent.find((item) => item.currency === e.target.value);
          if (selectedItem) handleItemClick(selectedItem);
        }}
        className={`w-full h-8 px-1 py-0 text-12 xs:text-12 text-dark-1 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-dark-3 appearance-none cursor-pointer ${textClass}`}
        aria-label="Pilih mata uang"
      >
        {currencyContent.map((item) => (
          <option key={item.id} value={item.currency} className="text-dark-1 text-12">
            {item.currency}
          </option>
        ))}
      </select>
      <span className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-dark-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </span>
      <style jsx>{`
        .currency-menu-container {
          width: 60px; /* Lebar lebih kecil untuk konsistensi */
          overflow: hidden;
        }
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 100%;
          max-width: 100px; /* Batasi lebar maksimum */
          padding-right: 20px; /* Ruang untuk ikon panah */
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: 12px;
        }
        option {
          max-width: 100px; /* Batasi lebar opsi */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
          padding: 4px 8px; /* Padding konsisten untuk opsi */
        }
        select::-webkit-scrollbar {
          width: 6px;
        }
        select::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }
        select::-webkit-scrollbar-track {
          background: transparent;
        }
        @media (max-width: 375px) {
          .currency-menu-container {
            width: 60px; /* Lebih kecil untuk ponsel */
          }
          select {
            max-width: 60px;
            font-size: 10px;
            padding-right: 16px;
          }
          option {
            max-width: 60px;
            font-size: 10px;
          }
          .currency-menu-container > span > svg {
            width: 12px;
            height: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default CurrencyMenu;