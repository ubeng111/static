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

  const getFlagUrl = (countryCode) => {
    if (!countryCode) return '';
    return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
  };

  // Ambil locale aktif dari pathname (misalnya 'us', 'es', 'id')
  const currentLangSlug = pathname.split('/')[1];

  const currentLanguageItem = i18nConfig.find(
    (item) => item.code === currentLangSlug
  ) || i18nConfig.find(item => item.code === defaultLocale);

  const handleLanguageChange = (langItem) => {
    const newLangSlugForPath = langItem.code; // 'us', 'sa', 'cn', 'hk'
    const newLangCodeForApi = langItem.localeCode; // 'en-us', 'ar-sa', 'zh-cn', 'zh-hk'

    setIsOpen(false);

    const pathSegments = pathname.split('/').filter(Boolean);

    if (pathSegments.length > 0 && i18nConfig.some(config => config.code === pathSegments[0])) {
      pathSegments[0] = newLangSlugForPath;
    } else {
      pathSegments.unshift(newLangSlugForPath);
    }

    const currentSearchParams = new URLSearchParams(searchParams.toString());
    currentSearchParams.set('language', newLangCodeForApi); // Ini yang akan menjadi 'ar-sa' atau 'zh-cn'

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

  if (!currentLanguageItem) {
    return null;
  }

  return (
    <div className="custom-language-menu" ref={dropdownRef}>
      <div className="selected-option" onClick={() => setIsOpen(!isOpen)}>
        <img
          src={getFlagUrl(currentLanguageItem.code)}
          alt={currentLanguageItem.name}
          className="flag-icon"
          width="36" // Menambahkan lebar default
          height="24" // Menambahkan tinggi default (rasio aspek umum untuk bendera)
        />
        <i className={`arrow-icon ${isOpen ? 'up' : 'down'}`}>&#9660;</i>
      </div>

      {isOpen && (
        <ul className="options-list">
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
                width="36" // Menambahkan lebar default
                height="24" // Menambahkan tinggi default (rasio aspek umum untuk bendera)
              />
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        /* Gaya dasar */
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
        }

        .selected-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 4px 8px;
          height: 40px;
          overflow: hidden;
          background-color: transparent;
        }

        .flag-icon {
          width: 36px;
          height: auto;
          flex-shrink: 0;
          border: none;
          box-shadow: none;
          margin-right: 10px;
        }

        .arrow-icon {
          margin-left: auto;
          transition: transform 0.2s;
          color: #FFFFFF;
        }

        .arrow-icon.up {
          transform: rotate(180deg);
        }

        .options-list {
          position: absolute;
          top: 100%;
          right: 0;
          width: 100px;
          background-color: #333;
          border: 1px solid rgba(255,255,255,0.2);
          border-top: none;
          border-radius: 0 0 4px 4px;
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 200px;
          overflow-y: auto;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
          z-index: 1001;
        }

        .options-list li {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px 8px;
          cursor: pointer;
          height: 40px;
          background-color: transparent;
        }

        .options-list li .flag-icon {
          width: 36px;
          height: auto;
          margin-right: 0;
        }

        .options-list li:hover, .options-list li.active {
          background-color: #555;
        }

        @media (max-width: 767px) {
          .custom-language-menu {
            min-width: 60px;
            max-width: 70px;
          }
          .selected-option {
            height: 36px;
            padding: 3px 6px;
          }
          .flag-icon {
            width: 32px;
            height: 21px; /* Disesuaikan dengan rasio aspek dan lebar baru */
          }
          .options-list {
            width: 80px;
          }
          .options-list li {
            height: 36px;
            padding: 3px 6px;
          }
          .options-list li .flag-icon {
            width: 32px;
            height: 21px; /* Disesuaikan dengan rasio aspek dan lebar baru */
          }
        }

        @media (max-width: 479px) {
          .custom-language-menu {
            min-width: 55px;
            max-width: 65px;
          }
          .selected-option {
            height: 32px;
            padding: 2px 5px;
          }
          .flag-icon {
            width: 28px;
            height: 19px; /* Disesuaikan dengan rasio aspek dan lebar baru */
          }
          .options-list {
            left: 0;
            right: auto;
            width: 50px;
          }
          .options-list li {
            height: 32px;
            padding: 2px 5px;
          }
          .options-list li .flag-icon {
            width: 28px;
            height: 19px; /* Disesuaikan dengan rasio aspek dan lebar baru */
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageMenu;