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
          width="36"
          height="24"
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
          min-width: 75px; /* Default desktop width */
          max-width: 95px; /* Default desktop width */
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
          color: #FFFFFF; /* Ensure text color is white on dark background */
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
          color: #FFFFFF; /* Ensure text color is white for list items */
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
            height: 32px;
          }
          .selected-option {
            height: 32px;
            padding: 3px 6px;
          }
          .flag-icon {
            width: 28px;
            height: 19px;
            margin-right: 5px;
          }
          .options-list {
            width: 70px;
          }
          .options-list li {
            height: 32px;
            padding: 3px 6px;
          }
          .options-list li .flag-icon {
            width: 28px;
            height: 19px;
          }
        }

        @media (max-width: 479px) { /* iPhone SE specific overrides */
          .custom-language-menu {
            min-width: 48px; /* Target 48px touch target */
            max-width: 52px; /* Slight buffer */
            height: 28px; /* Consistent height with Currency & Search input */
            border: 1px solid #777; /* Border for clarity */
            border-radius: 4px;
          }
          .selected-option {
            height: 28px;
            padding: 0 4px; /* Minimal padding */
            justify-content: center;
          }
          .flag-icon {
            width: 24px; /* Smallest practical flag size */
            height: 16px;
            margin-right: 2px; /* Minimal margin */
          }
          .arrow-icon {
            font-size: 8px; /* Very small arrow */
          }
          .options-list {
            min-width: 100%; /* Make dropdown match parent width */
            right: 0; /* Align dropdown to right edge of parent */
            left: auto;
          }
          .options-list li {
            height: 28px;
            padding: 0 6px;
            font-size: 11px; /* Consistent with Currency */
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageMenu;