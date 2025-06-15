// components/header/CurrencyMenu.jsx
'use client';

import { useCurrency } from '../CurrencyContext'; // Asumsi CurrencyContext menyediakan currency dan setCurrency
import { currencyContent } from '@/config/currency';
import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const CurrencyMenu = ({ textClass }) => {
  const { currency, setCurrency } = useCurrency(); // 'currency' di sini adalah objek {id, currency, language, ...}
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // --- LOGIKA BARU UNTUK MENDAPATKAN MATA UANG UNIK ---
  const getUniqueCurrencies = () => {
    const seenCurrencyCodes = new Set();
    const uniqueCurrenciesList = [];

    for (const item of currencyContent) {
      if (!seenCurrencyCodes.has(item.currency)) { // Memeriksa kode mata uang (USD, EUR, dll.)
        uniqueCurrenciesList.push(item);
        seenCurrencyCodes.add(item.currency);
      }
    }
    return uniqueCurrenciesList;
  };

  const uniqueCurrencies = getUniqueCurrencies();
  // --- AKHIR LOGIKA MATA UANG UNIK ---

  const handleItemClick = (item) => {
    setCurrency(item); // Update context dengan item mata uang lengkap
    setIsOpen(false);

    // Buat objek URLSearchParams baru dari searchParams yang ada
    const currentSearchParams = new URLSearchParams(searchParams.toString());
    currentSearchParams.set('currency', item.currency); // Set currency baru ke URL params (kode 3 huruf)

    // Dapatkan language saat ini dari URL query, agar tidak hilang saat navigasi
    // Kita tidak akan mengubah 'language' param di sini.
    // Pastikan path tetap sama, hanya query params yang berubah.
    const newPath = `${pathname.split('?')[0]}?${currentSearchParams.toString()}`;

    router.replace(newPath); // Gunakan router.replace untuk tidak menambahkan ke history browser
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className={`custom-currency-menu ${textClass}`} ref={dropdownRef}>
      <div className="selected-option" onClick={() => setIsOpen(!isOpen)}>
        {/* Tampilkan kode mata uang dari konteks (misal: "USD", "EUR") */}
        {currency?.currency || 'USD'}
        <i className={`arrow-icon ${isOpen ? 'up' : 'down'}`}>&#9660;</i>
      </div>

      {isOpen && (
        <ul className="options-list">
          {/* Render daftar mata uang yang sudah unik */}
          {uniqueCurrencies.map((item) => (
            <li
              key={item.id} // Tetap gunakan ID unik asli dari item pertama yang ditemukan
              onClick={() => handleItemClick(item)}
              className={item.currency === currency?.currency ? 'active' : ''}
            >
              {item.currency}
            </li>
          ))}
        </ul>
      )}

      {/* Gaya tetap sama */}
      <style jsx>{`
        .custom-currency-menu {
          position: relative;
          display: inline-block;
          font-size: 14px;
          min-width: 80px;
          max-width: 80px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #fff;
          cursor: pointer;
          user-select: none;
          z-index: 999;
        }

        .selected-option {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          justify-content: space-between;
          height: 32px;
          box-sizing: border-box;
        }

        .arrow-icon {
          margin-left: 8px;
          transition: transform 0.2s;
        }

        .arrow-icon.up {
          transform: rotate(180deg);
        }

        .options-list {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: #fff;
          border: 1px solid #ccc;
          border-top: none;
          border-radius: 0 0 4px 4px;
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 200px;
          overflow-y: auto;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .options-list li {
          display: flex;
          align-items: center;
          padding: 8px 12px;
          cursor: pointer;
          white-space: nowrap;
          height: 32px;
          box-sizing: border-box;
        }

        .options-list li:hover, .options-list li.active {
          background-color: #f0f0f0;
        }

        @media (max-width: 767px) {
          .custom-currency-menu {
            min-width: 65px;
            max-width: 75px;
            font-size: 11px;
          }
          .selected-option {
            height: 30px;
            padding: 0 6px;
          }
          .options-list li {
            height: 30px;
            padding: 0 6px;
          }
        }

        @media (max-width: 479px) {
          .custom-currency-menu {
            min-width: 55px;
            max-width: 65px;
            font-size: 10px;
          }
          .selected-option {
            height: 25px;
            padding: 0 4px;
          }
          .options-list li {
            height: 25px;
            padding: 0 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default CurrencyMenu;