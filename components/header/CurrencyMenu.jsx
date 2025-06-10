// CurrencyMenu.jsx
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation'; // Masih perlu ini untuk route.replace
import { useCurrency } from '../CurrencyContext';

const CurrencyMenu = ({ textClass }) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Mungkin masih berguna untuk membaca param lain
  const pathname = usePathname(); // Untuk mendapatkan path saat ini
  const { currency, setCurrency } = useCurrency(); // Gunakan mata uang dari context

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
    { id: 28, currency: 'JPY', language: 'ja-jp', symbol: '¥', name: 'Japanese Yen' },
    { id: 29, currency: 'CNY', language: 'zh-cn', symbol: '¥', name: 'Chinese Yuan' },
  ];

  const handleItemClick = (item) => {
    setCurrency(item); // Perbarui context currency

    // Sekarang, kita tidak perlu lagi mengubah URL parameter currency/language
    // Kita hanya ingin memastikan URL tidak berubah (misalnya, jika ada parameter pencarian lain)
    // Jika Anda ingin membersihkan parameter currency/language yang mungkin ada dari kunjungan sebelumnya (walaupun tidak direkomendasikan jika tidak ada di context):
    // const currentParams = new URLSearchParams(searchParams.toString());
    // currentParams.delete('currency');
    // currentParams.delete('language');
    // router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false });
    // Namun, jika Anda memang tidak menggunakan parameter ini, tidak perlu melakukan apa-apa di sini
    // selain mengupdate context. Router.replace hanya jika ada param lain yang perlu dipertahankan.
    // Jika tidak ada param lain, update context saja sudah cukup.
    // Untuk kesederhanaan, kita bisa biarkan saja atau menghapus bagian router.replace
  };

  return (
    <div className="currency-menu-container relative flex-shrink-0 bg-white rounded-xl border border-gray-200 shadow-sm">
      <select
        value={currency?.currency || 'USD'} // Gunakan currency dari context
        onChange={(e) => {
          const selectedItem = currencyContent.find((item) => item.currency === e.target.value);
          if (selectedItem) handleItemClick(selectedItem);
        }}
        className={`w-full h-8 px-2 py-0 text-12 xs:text-12 text-dark-1 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-dark-3 cursor-pointer ${textClass}`}
        aria-label="Pilih mata uang"
      >
        {currencyContent.map((item) => (
          <option key={item.id} value={item.currency} className="text-dark-1 text-12">
            {item.currency}
          </option>
        ))}
      </select>
      <style jsx>{`
        .currency-menu-container {
          width: 80px;
          overflow: hidden;
          min-width: 60px;
          max-width: 80px;
          flex-shrink: 0;
          flex-grow: 0;
          box-sizing: border-box;
        }
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          width: 100%;
          height: 25px;
          padding: 0 8px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: 12px;
          box-sizing: border-box;
          border: none;
        }
        option {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 12px;
          padding: 4px 8px;
          max-width: 80px;
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
        @media (max-width: 767px) {
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

        @media (max-width: 479px) {
          .currency-menu-container {
            width: 55px;
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