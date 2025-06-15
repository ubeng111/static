// components/LanguageMenu.jsx
'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { i18nConfig, defaultLocale } from '@/config/i18n';

import { useState, useRef, useEffect } from 'react';

const LanguageMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOptionRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const getFlagUrl = (countryCode) => {
    if (!countryCode) return '';
    return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
  };

  const currentLangSlug = pathname.split('/')[1];

  const currentLanguageItem = i18nConfig.find(
    (item) => item.code === currentLangSlug
  ) || i18nConfig.find(item => item.code === defaultLocale);

  const handleLanguageChange = (langItem) => {
    const newLangSlugForPath = langItem.code;
    const newLangCodeForApi = langItem.localeCode;

    setIsOpen(false);

    const pathSegments = pathname.split('/').filter(Boolean);

    if (pathSegments.length > 0 && i18nConfig.some(config => config.code === pathSegments[0])) {
      pathSegments[0] = newLangSlugForPath;
    } else {
      pathSegments.unshift(newLangSlugForPath);
    }

    const currentSearchParams = new URLSearchParams(searchParams.toString());
    currentSearchParams.set('language', newLangCodeForApi);

    const newPath = `/${pathSegments.join('/')}?${currentSearchParams.toString()}`;
    router.push(newPath);
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

  useEffect(() => {
    if (isOpen && selectedOptionRef.current) {
      const rect = selectedOptionRef.current.getBoundingClientRect();
      const offset = 5;

      let dropdownCalculatedWidth = 100;
      const isMobileView = window.innerWidth <= 767;
      const isIphoneSEView = window.innerWidth <= 479;

      if (isIphoneSEView) {
        dropdownCalculatedWidth = 52;
      } else if (isMobileView) {
        dropdownCalculatedWidth = 70;
      }

      let dropdownHeightLimit = 400;
      if (isIphoneSEView) {
          dropdownHeightLimit = 280;
      } else if (isMobileView) {
          dropdownHeightLimit = 320;
      }

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      let finalTop = rect.bottom + offset;
      let finalRight = window.innerWidth - rect.right;

      const headerHeightDesktop = 60;
      if (!isMobileView && finalTop < headerHeightDesktop) {
          finalTop = headerHeightDesktop + offset;
      }

      if (isMobileView) {
          if (spaceBelow < dropdownHeightLimit && spaceAbove > dropdownHeightLimit) {
              finalTop = rect.top - dropdownHeightLimit - offset;
          } else if (spaceBelow < dropdownHeightLimit && spaceAbove < dropdownHeightLimit) {
              finalTop = window.innerHeight - dropdownHeightLimit - offset;
              finalTop = Math.max(0, finalTop);
          }
      }

      setDropdownStyle({
        position: 'fixed',
        top: `${finalTop}px`,
        right: `${finalRight}px`,
        width: `${dropdownCalculatedWidth}px`,
        zIndex: 9999
      });
    } else {
      setDropdownStyle({});
    }
  }, [isOpen]);

  if (!currentLanguageItem) {
    return null;
  }

  return (
    <div className="custom-language-menu" ref={dropdownRef}>
      <div className="selected-option" onClick={() => setIsOpen(!isOpen)} ref={selectedOptionRef}>
        <img
          src={getFlagUrl(currentLanguageItem.code)}
          alt={currentLanguageItem.name}
          className="flag-icon"
          width="36"
          height="24"
        />
        <i className={`arrow-icon ${isOpen ? 'up' : 'down'}`}>&#9660;</i>
      </div>

      {isOpen && (
        <ul className="options-list" style={dropdownStyle}>
          {i18nConfig.map((lang) => (
            <li
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className={lang.code === currentLangSlug ? 'active' : ''}
            >
              <img
                src={getFlagUrl(lang.code)}
                alt={lang.name}
                className="flag-icon"
                width="36"
                height="24"
              />
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .custom-language-menu {
          position: relative;
          display: inline-block;
          font-size: 14px;
          min-width: 75px;
          max-width: 95px;
          border: none;
          background-color: transparent;
          cursor: pointer;
          user-select: none;
          z-index: 1000;
          flex-shrink: 0;
        }

        .selected-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 8px;
          height: 40px;
          overflow: hidden;
          background-color: transparent;
          color: #FFFFFF;
        }

        /* --- PERUBAHAN CSS UNTUK .flag-icon DIMULAI DI SINI --- */
        .flag-icon {
          width: 36px;   /* Set width explicitly to match HTML attribute */
          height: 24px;  /* Set height explicitly to match HTML attribute */
          object-fit: contain;
          flex-shrink: 0;
          border: none;
          box-shadow: none;
          margin-right: 10px;
        }
        /* --- PERUBAHAN CSS UNTUK .flag-icon SELESAI DI SINI --- */

        .arrow-icon {
          margin-left: auto;
          transition: transform 0.2s;
          color: #FFFFFF;
        }

        .arrow-icon.up {
          transform: rotate(180deg);
        }

        .options-list {
          background-color: #333;
          border: 1px solid rgba(255,255,255,0.2);
          border-top: none;
          border-radius: 0 0 4px 4px;
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 400px;
          overflow-y: auto;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
        }

        .options-list li {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 8px;
          cursor: pointer;
          height: 40px;
          box-sizing: border-box;
          background-color: transparent;
          color: #FFFFFF;
        }

        /* Apply margin-bottom to list items themselves for vertical spacing */
        .options-list li:not(:last-child) {
          margin-bottom: 10px;
        }

        .options-list li .flag-icon {
          width: 36px;  /* Match desktop size for list items */
          height: 24px; /* Match desktop size for list items */
          object-fit: contain;
          margin-right: 0;
        }

        .options-list li:hover, .options-list li.active {
          background-color: #555;
        }

        @media (max-width: 767px) {
          .custom-language-menu {
            min-width: 60px;
            max-width: 70px;
            height: 32px;
            border: none;
          }
          .selected-option {
            height: 32px;
            padding: 3px 6px;
          }
          .flag-icon {
            width: 30px; /* Contoh skala kecil untuk mobile umum */
            height: 20px; /* Contoh skala kecil untuk mobile umum */
            margin-right: 5px;
          }
          .options-list {
            max-height: 320px;
          }
          .options-list li {
            height: 32px;
            padding: 3px 6px;
            box-sizing: border-box;
          }
          .options-list li:not(:last-child) {
            margin-bottom: 8px;
          }
          .options-list li .flag-icon {
            width: 30px; /* Konsisten dengan flag-icon di selected-option untuk mobile */
            height: 20px; /* Konsisten dengan flag-icon di selected-option untuk mobile */
            margin-right: 0;
          }
        }

        @media (max-width: 479px) { /* iPhone SE specific overrides */
          .custom-language-menu {
            min-width: 48px;
            max-width: 52px;
            height: 28px;
            border: none;
            border-radius: 4px;
          }
          .selected-option {
            height: 28px;
            padding: 0 4px;
            justify-content: center;
          }
          .flag-icon {
            width: 24px; /* Skala lebih kecil lagi untuk iPhone SE */
            height: 16px; /* Skala lebih kecil lagi untuk iPhone SE */
            margin-right: 2px;
          }
          .arrow-icon {
            font-size: 8px;
          }
          .options-list {
            max-height: 280px;
          }
          .options-list li {
            height: 28px;
            padding: 0 6px;
            font-size: 11px;
            box-sizing: border-box;
          }
          .options-list li:not(:last-child) {
            margin-bottom: 6px;
          }
          .options-list li .flag-icon {
            width: 24px; /* Konsisten dengan flag-icon di selected-option untuk iPhone SE */
            height: 16px; /* Konsisten dengan flag-icon di selected-option untuk iPhone SE */
            margin-right: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageMenu;