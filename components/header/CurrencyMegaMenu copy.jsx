// components/header/CurrencyMenu.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../CurrencyContext';
import { currencyContent } from '@/config/currency';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const CurrencyMenu = ({ textClass }) => {
  const { currency, setCurrency } = useCurrency();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleItemClick = (item) => {
    setCurrency(item);
    setIsOpen(false);

    const currentSearchParams = new URLSearchParams(searchParams.toString());
    currentSearchParams.set('currency', item.currency);

    const newPath = `${pathname.split('?')[0]}?${currentSearchParams.toString()}`;

    router.replace(newPath);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className={`custom-currency-menu ${textClass}`} ref={dropdownRef}>
      <div className="selected-option" onClick={() => setIsOpen(!isOpen)}>
        {currency?.currency || 'USD'}
        <i className={`arrow-icon ${isOpen ? 'up' : 'down'}`}>&#9660;</i>
      </div>

      {isOpen && (
        <ul className="options-list">
          {uniqueCurrencies.map((item) => (
            <li
              key={item.id}
              onClick={() => handleItemClick(item)}
              className={item.currency === currency?.currency ? 'active' : ''}
            >
              {item.currency}
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .custom-currency-menu {
          position: relative;
          display: inline-block;
          font-size: 14px;
          min-width: 80px; /* Default desktop width */
          max-width: 80px; /* Default desktop width */
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: #fff;
          cursor: pointer;
          user-select: none;
          z-index: 999;
          flex-shrink: 0;
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
            min-width: 60px;
            max-width: 70px;
            font-size: 12px;
            height: 32px;
          }
          .selected-option {
            height: 32px;
            padding: 0 6px;
          }
          .options-list li {
            height: 32px;
            padding: 0 6px;
            font-size: 12px;
          }
        }

        @media (max-width: 479px) { /* iPhone SE specific overrides */
          .custom-currency-menu {
            min-width: 50px; /* Slightly larger than previous attempt */
            max-width: 55px; /* Allow a bit more space */
            font-size: 11px; /* Optimal small font */
            height: 28px; /* Consistent with new Search input height */
            border: 1px solid #777; /* For better visibility */
          }
          .selected-option {
            height: 28px;
            padding: 0 4px; /* Minimal padding */
            justify-content: center; /* Center content */
          }
          .arrow-icon {
            font-size: 8px;
            margin-left: 2px;
          }
          .options-list {
            min-width: 100%; /* Make dropdown match parent width */
            left: auto;
            right: 0; /* Align to right if placed at end of header-right-group */
          }
          .options-list li {
            height: 28px;
            padding: 0 6px;
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

export default CurrencyMenu;