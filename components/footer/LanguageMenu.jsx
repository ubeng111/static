// components/footer/LanguageMenu.jsx
'use client'; // WAJIB: Menandakan ini adalah komponen klien yang interaktif.

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
// WAJIB: Gunakan 'usePathname' dari 'next/navigation' di App Router
import { usePathname } from 'next/navigation'; 
import { i18nConfig, defaultLocale } from '@/config/i18n';

// --- Anda bisa meletakkan semua logika dan UI di sini ---

// Fungsi bantuan
const getFlagUrl = (localeCode) => {
  if (!localeCode) return '';
  const countryCode = (localeCode.split('-')[1] || localeCode).toLowerCase();
  return `https://flagcdn.com/w40/${countryCode}.png`;
};

const LanguageMenu = () => {
  // Hook dari next/navigation untuk mendapatkan path URL saat ini
  const pathname = usePathname();

  // State dan Ref untuk fungsionalitas dropdown (dari LanguageMenuUI lama)
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Efek untuk menutup dropdown saat klik di luar area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logika untuk menentukan bahasa saat ini
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentLangSlug = i18nConfig.some(config => config.code === pathSegments[0]) 
    ? pathSegments[0] 
    : defaultLocale;

  const currentLanguageItem = 
    i18nConfig.find(item => item.code === currentLangSlug) || 
    i18nConfig.find(item => item.code === defaultLocale);

  if (!currentLanguageItem) {
    return null; // Jangan render apapun jika data bahasa tidak ditemukan
  }

  return (
    <div className="custom-language-menu" ref={dropdownRef}>
      <div 
        className="selected-option" 
        onClick={() => setIsOpen(!isOpen)} 
        role="button" 
        tabIndex={0}
      >
        <img
          src={getFlagUrl(currentLanguageItem.code)}
          alt={currentLanguageItem.name}
          className="flag-icon"
        />
        <i className={`arrow-icon ${isOpen ? 'down' : 'up'}`}>&#9650;</i>
      </div>

      {isOpen && (
        <ul className="options-list">
          {i18nConfig.map((lang) => {
            // Logika untuk membuat path baru
            let newPathSegments = pathSegments;
            if (i18nConfig.some(config => config.code === newPathSegments[0])) {
              newPathSegments = newPathSegments.slice(1);
            }
            if (lang.code !== defaultLocale) {
              newPathSegments.unshift(lang.code);
            }
            const newPath = `/${newPathSegments.join('/')}`;

            return (
              <li
                key={lang.code}
                className={lang.code === currentLangSlug ? 'active' : ''}
                onClick={() => setIsOpen(false)} // Tutup menu setelah memilih
              >
                <Link href={newPath} className="language-link" prefetch={false}>
                  <img
                    src={getFlagUrl(lang.code)}
                    alt={lang.name}
                    className="flag-icon"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      
      {/* CSS diletakkan langsung di sini untuk kemudahan */}
      <style jsx>{`
        .custom-language-menu { position: relative; display: inline-block; }
        .selected-option { display: flex; align-items: center; padding: 4px 8px; cursor: pointer; }
        .flag-icon { width: 36px; height: 24px; object-fit: contain; margin-right: 8px; }
        .arrow-icon { color: white; transition: transform 0.2s; }
        .arrow-icon.down { transform: rotate(180deg); }
        .options-list {
          position: absolute;
          bottom: calc(100% + 5px);
          right: 0;
          background-color: #333;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          list-style: none;
          padding: 8px;
          margin: 0;
          min-width: 70px;
          box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.2);
          z-index: 1001;
          max-height: 210px;
          overflow-y: auto;
        }
        .options-list li { list-style-type: none; margin: 0 0 8px 0; padding: 0; }
        .options-list li:last-child { margin-bottom: 0; }
        .language-link { display: flex; align-items: center; justify-content: center; padding: 4px; height: 32px; border-radius: 4px; text-decoration: none; }
        .language-link:hover, li.active .language-link { background-color: #555; }
        .language-link .flag-icon { margin: 0; }
      `}</style>
    </div>
  );
};

export default LanguageMenu;