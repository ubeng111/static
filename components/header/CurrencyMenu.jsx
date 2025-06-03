// CurrencyMenu.jsx
'use client';

import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCurrency } from '../CurrencyContext';

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

const CurrencyMenu = ({ textClass }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    if (!searchParams) return;
    const urlCurrency = searchParams.get('currency');
    if (urlCurrency && !currency.currency) {
      const selectedCurrency = currencyContent.find((item) => item.currency === urlCurrency);
      if (selectedCurrency) {
        setCurrency(selectedCurrency);
      }
    }
  }, [searchParams, setCurrency, currency.currency]);

  const handleItemClick = useCallback((item) => {
    setCurrency(item); // Update the currency context

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('currency', item.currency);
    currentParams.set('language', item.language);

    // If on homepage, only update currency and language in the URL
    if (pathname === '/') {
      const newHomeParams = new URLSearchParams();
      newHomeParams.set('currency', item.currency);
      newHomeParams.set('language', item.language);
      router.replace(`/?${newHomeParams.toString()}`, { scroll: false });
    } else {
      // If not on homepage, preserve existing parameters and add defaults if missing
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
      // Replace the URL for the current path with updated parameters
      router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
    }
  }, [setCurrency, searchParams, pathname, router]);

  return (
    <div className="currency-menu-container relative flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm">
      <select
        value={currency?.currency || 'USD'}
        onChange={(e) => {
          const selectedItem = currencyContent.find((item) => item.currency === e.target.value);
          if (selectedItem) handleItemClick(selectedItem);
        }}
        // Hapus `appearance-none` jika Anda ingin panah default browser
        // Tambahkan lagi `appearance-none` jika Anda ingin tidak ada panah sama sekali
        className={`w-full h-8 px-2 py-0 text-12 xs:text-12 text-dark-1 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-dark-3 cursor-pointer ${textClass}`}
        aria-label="Pilih mata uang"
      >
        {currencyContent.map((item) => (
          // HANYA menampilkan singkatan mata uang di sini
          <option key={item.id} value={item.currency} className="text-dark-1 text-12">
            {item.currency}
          </option>
        ))}
      </select>
      <style jsx>{`
        .currency-menu-container {
          /* Updated width to better accommodate abbreviations + padding */
          width: 80px; /* Adjust this value as needed based on testing */
          overflow: hidden; /* Penting agar tidak ada konten yang melebihi batas */
          min-width: 60px; /* Minimal width untuk mobile */
          max-width: 80px; /* Maksimal width */
          flex-shrink: 0; /* KRITIS: Jangan biarkan menyusut kecuali ruang sangat sempit */
          flex-grow: 0; /* Tidak tumbuh */
          box-sizing: border-box;
        }
        select {
          /* Pertahankan appearance: none jika Anda tidak ingin panah default browser */
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 100%; /* Agar mengisi lebar container */
          height: 25px; /* Seragamkan tinggi */
          padding: 0 8px;
          text-overflow: ellipsis; /* Memotong teks dengan elipsis jika terlalu panjang */
          white-space: nowrap; /* Mencegah teks melompat ke baris baru */
          overflow: hidden; /* Menyembunyikan bagian teks yang terpotong */
          font-size: 12px;
          box-sizing: border-box; /* Pastikan padding dihitung dalam lebar total */
          border: none; /* Hilangkan border jika container sudah ada border */
        }
        option {
          /* These styles are often ignored by browsers for native select dropdowns */
          /* but keep them for consistency and potential browser variations */
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
          padding: 4px 8px; /* Padding konsisten untuk opsi */
          max-width: 80px; /* Match container width, still might be ignored in dropdown */
          box-sizing: border-box;
        }
        /* Scrollbar styles (tetap sama) */
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

        /* Responsive styles for CurrencyMenu */
        @media (max-width: 767px) { /* Tablet Kecil & Mobile */
          .currency-menu-container {
            width: 50px;
            min-width: 60px;
            max-width: 70px;
          }
          select {
            font-size: 11px;
            height: 30px;
            padding: 0 6px;
          }
          option {
            font-size: 11px;
          }
        }

        @media (max-width: 479px) { /* Mobile Sangat Kecil */
          .currency-menu-container {
            width: 55px; /* Paling kecil untuk layar sempit */
            min-width: 50px;
            max-width: 55px;
          }
          select {
            font-size: 10px;
            height: 20px;
            padding: 0 4px;
          }
          option {
            font-size: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default CurrencyMenu;