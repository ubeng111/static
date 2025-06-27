// File: components/header/CurrencyMenu.jsx (Disesuaikan dengan Context yang Ada)
'use client';

import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../CurrencyContext'; // Kita asumsikan path ini benar
import { currencyContent, defaultCurrency } from '@/config/currency';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const CurrencyMenu = ({ textClass }) => {
  // --- PERBAIKAN UTAMA DIMULAI DI SINI ---

  // 1. Sesuaikan dengan Context Anda: Gunakan `currency` dan `setCurrency`.
  //    Ini akan langsung memperbaiki error "setCurrencyCode is not a function".
  const { currency, setCurrency } = useCurrency();

  // 2. Terapkan kembali pola untuk mencegah Hydration Mismatch.
  //    State ini hanya untuk TAMPILAN di komponen ini.
  const [isMounted, setIsMounted] = useState(false);
  const [displayCurrencyCode, setDisplayCurrencyCode] = useState(defaultCurrency); // Default: 'USD'

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 3. Sinkronkan tampilan dengan data dari Context setelah client-side mount.
  useEffect(() => {
    // `currency` adalah objek dari context (misal: { id: 1, currency: 'USD', ...})
    if (isMounted && currency?.currency) {
      setDisplayCurrencyCode(currency.currency);
    }
  }, [currency, isMounted]); // Dijalankan saat nilai `currency` dari context berubah.

  const handleItemClick = (item) => {
    // 4. Panggil `setCurrency` dengan SELURUH OBJEK `item`.
    //    Ini sesuai dengan bagaimana context Anda kemungkinan besar bekerja.
    setCurrency(item);
    setIsOpen(false);

    // Sisa logika untuk update URL tidak berubah
    const currentSearchParams = new URLSearchParams(searchParams.toString());
    currentSearchParams.set('currency', item.currency);
    const newPath = `${pathname.split('?')[0]}?${currentSearchParams.toString()}`;
    router.replace(newPath);
  };

  // --- AKHIR PERBAIKAN UTAMA ---

  // Sisa kode (state & logika dropdown) tidak banyak berubah
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getUniqueCurrencies = () => {
    const seenCurrencyCodes = new Set();
    const uniqueCurrenciesList = [];
    for (const item of currencyContent) {
      if (!seenCurrencyCodes.has(item.currency)) {
        uniqueCurrenciesList.push(item);
        seenCurrencyCodes.add(item.currency);
      }
    }
    return uniqueCurrenciesList;
  };
  const uniqueCurrencies = getUniqueCurrencies();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);
  
  // Fallback render untuk keamanan hidrasi
  if (!isMounted) {
    return (
        <div className={`custom-currency-menu ${textClass}`} style={{height: '32px', border: '1px solid #ccc', borderRadius: '4px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', padding: '8px 12px'}}>
            {defaultCurrency}
        </div>
    );
  }

  return (
    <div className={`custom-currency-menu ${textClass}`} ref={dropdownRef}>
      <div className="selected-option" onClick={() => setIsOpen(!isOpen)}>
        {/* Tampilkan KODE dari state tampilan lokal kita */}
        {displayCurrencyCode}
        <i className={`arrow-icon ${isOpen ? 'up' : 'down'}`}>&#9660;</i>
      </div>

      {isOpen && (
        <ul className="options-list">
          {uniqueCurrencies.map((item) => (
            <li
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={item.currency === displayCurrencyCode ? 'active' : ''}
            >
              {/* Tampilkan KODE di dalam daftar */}
              {item.currency}
            </li>
          ))}
        </ul>
      )}

      {/* CSS simpel dari versi sebelumnya */}
      <style jsx>{`
        .custom-currency-menu {
          position: relative; display: inline-block; font-size: 14px;
          min-width: 80px; max-width: 80px; border: 1px solid #ccc;
          border-radius: 4px; background-color: #fff; cursor: pointer;
          user-select: none; z-index: 999; flex-shrink: 0;
        }
        .selected-option {
          display: flex; align-items: center; padding: 8px 12px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
          justify-content: space-between; height: 32px; box-sizing: border-box;
        }
        .arrow-icon {
          margin-left: 8px; transition: transform 0.2s; font-size: 10px;
        }
        .arrow-icon.up { transform: rotate(180deg); }
        .options-list {
          position: absolute; top: 100%; left: 0; right: 0;
          background-color: #fff; border: 1px solid #ccc; border-top: none;
          border-radius: 0 0 4px 4px; list-style: none; padding: 0; margin: 0;
          max-height: 200px; overflow-y: auto;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); z-index: 1000;
        }
        .options-list li {
          display: flex; align-items: center; padding: 8px 12px;
          cursor: pointer; white-space: nowrap; height: 32px; box-sizing: border-box;
        }
        .options-list li:hover, .options-list li.active { background-color: #f0f0f0; }
      `}</style>
    </div>
  );
};

export default CurrencyMenu;