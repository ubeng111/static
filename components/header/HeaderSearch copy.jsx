// components/hotel-list/common/HeaderSearch.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// HAPUS SEMUA IMPOR BERIKUT KARENA TIDAK DIGUNAKAN DI DALAM KOMPONEN INI:
// import MainMenu from '../MainMenu';
// import CurrencyMenu from '../CurrencyMenu';
// import HeaderSearch from '../HeaderSearch'; // Ini mengimpor dirinya sendiri!
// import Head from 'next/head'; // Head tidak digunakan di komponen ini
// import LanguageMenu from '../LanguageMenu';


const HeaderSearch = ({ dictionary, currentLang }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false); // Internal state for overlay
  const [isMobile, setIsMobile] = useState(false); // State to track mobile view

  const router = useRouter();
  const dropdownRef = useRef(null); // Ref for suggestions dropdown (desktop & overlay)
  const searchInputRef = useRef(null); // Ref for the actual input field (desktop & overlay)

  const searchDict = dictionary?.search || {};
  const commonDict = dictionary?.common || {};

  // Detect mobile view on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      // Pastikan breakpoint ini konsisten dengan yang di Header1
      setIsMobile(window.innerWidth <= 767);
    };
    checkIsMobile(); // Initial check
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Memfokuskan input ketika overlay terbuka
  useEffect(() => {
    if (isOverlayOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOverlayOpen]);

  const fetchCities = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(`/api/city-id?city=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        console.error('Failed to fetch cities:', response.status);
        setSuggestions([]);
        return;
      }
      const data = await response.json();
      setSuggestions(data.cities || []);
    } catch (error) {
      console.error('Error fetching cities:', error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchCities(value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (suggestions.length >= 1) {
      const selectedCityId = suggestions[0].city_id;
      const selectedCityName = suggestions[0].city;
      router.push(`/${currentLang}/search-result?city_id=${encodeURIComponent(selectedCityId)}&city=${encodeURIComponent(selectedCityName)}`);
      setQuery('');
      setSuggestions([]);
      setIsOverlayOpen(false); // Close overlay after search
    }
  };

  const handleSuggestionClick = (city) => {
    router.push(`/${currentLang}/search-result?city_id=${encodeURIComponent(city.city_id)}&city=${encodeURIComponent(city.city)}`);
    setQuery('');
    setSuggestions([]);
    setIsOverlayOpen(false); // Close overlay after selection
  };

  // Close suggestions dropdown (for desktop input) AND overlay suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Logic for desktop suggestions dropdown
      if (!isMobile && dropdownRef.current && !dropdownRef.current.contains(event.target) && searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setSuggestions([]);
      }

      // Logic for closing mobile search overlay when clicking outside its content
      if (isMobile && isOverlayOpen && event.target.closest('.search-overlay-content') === null) {
          if (event.target.closest('.mobile-search-toggle') === null) {
             setIsOverlayOpen(false);
             setQuery('');
             setSuggestions([]);
          }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef, isOverlayOpen, isMobile, searchInputRef]);


  return (
    <>
      {/* Desktop Search Input - Displayed only on desktop */}
      {!isMobile && (
        <div className="header-search-container">
          <form onSubmit={handleSearch}>
            <label htmlFor="hotel-search-input-desktop" className="sr-only">Search for hotels or destinations</label>
            <input
              id="hotel-search-input-desktop"
              ref={searchInputRef} // Use searchInputRef for desktop input too
              type="text"
              placeholder={searchDict.destinationPlaceholder || "Search..."}
              value={query}
              onChange={handleInputChange}
              style={{
                width: '100%',
                height: '32px',
                fontSize: '13px',
                padding: '3px 6px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#fff',
                color: '#000',
                boxSizing: 'border-box'
              }}
            />
          </form>
          {query && suggestions.length > 0 && (
            <ul
              ref={dropdownRef}
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 10,
                listStyle: 'none',
                padding: 0,
                margin: 0,
                maxHeight: '150px',
                overflowY: 'auto',
              }}
            >
              {suggestions.map((city) => (
                <li
                  key={city.city_id}
                  onClick={() => handleSuggestionClick(city)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#000',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#fff')}
                >
                  {city.city}, {city.country}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Mobile Search Icon - Displayed only on mobile */}
      {isMobile && (
        <button
          className="mobile-search-toggle"
          onClick={() => setIsOverlayOpen(true)}
          aria-label="Search"
        >
          {/* SVG for Search Icon */}
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      )}

      {/* Mobile Search Overlay - Displayed when isOverlayOpen is true */}
      {isOverlayOpen && (
        <div className="search-overlay">
          <div className="search-overlay-content">
            <form onSubmit={handleSearch} className="overlay-search-form">
              <label htmlFor="hotel-search-input-mobile" className="sr-only">Search for hotels or destinations</label>
              <input
                id="hotel-search-input-mobile"
                ref={searchInputRef}
                type="text"
                placeholder={searchDict.destinationPlaceholder || "Search..."}
                value={query}
                onChange={handleInputChange}
                className="overlay-search-input"
              />
              <button type="submit" className="overlay-search-submit" aria-label="Submit search">
                {/* SVG for Arrow Right Icon (optional, you can keep or replace this) */}
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </button>
            </form>
            <button
              className="overlay-close-button"
              onClick={() => {
                setIsOverlayOpen(false);
                setQuery('');
                setSuggestions([]);
              }}
              aria-label="Close search"
            >
              {/* SVG for Close Icon */}
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>

            {query && suggestions.length > 0 && (
              <ul className="overlay-suggestions-list" ref={dropdownRef}>
                {suggestions.map((city) => (
                  <li
                    key={city.city_id}
                    onClick={() => handleSuggestionClick(city)}
                  >
                    {city.city}, {city.country}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* Desktop Search Input Container */
        .header-search-container {
          position: relative;
          flex: 1 1 auto;
          min-width: 70px;
          max-width: 220px;
          box-sizing: border-box;
          flex-shrink: 1;
        }

        /* Mobile Search Toggle (always styled for visibility when displayed) */
        .mobile-search-toggle {
          background: none;
          border: none;
          color: #FFFFFF; /* White icon color, now applies to SVG fill */
          font-size: 20px; /* Keep for general sizing, but SVG will use width/height */
          cursor: pointer;
          height: 48px; /* Large touch target */
          width: 48px; /* Large touch target */
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mobile-search-toggle .icon {
          width: 20px; /* Adjust SVG icon size */
          height: 20px; /* Adjust SVG icon size */
          fill: currentColor; /* Inherit color from parent (.mobile-search-toggle) */
        }


        /* Search Overlay Styles */
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.9); /* Darker overlay */
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 60px; /* Space for header */
          z-index: 1000;
        }

        .search-overlay-content {
          width: 90%;
          max-width: 500px;
          position: relative; /* For suggestions */
        }

        .overlay-search-form {
          display: flex;
          border-bottom: 2px solid #fff; /* Underline effect */
          padding-bottom: 5px;
          margin-bottom: 20px;
        }

        .overlay-search-input {
          flex-grow: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 20px;
          color: #FFFFFF;
          padding: 8px 0;
        }
        .overlay-search-input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .overlay-search-submit {
          background: none;
          border: none;
          color: #FFFFFF;
          font-size: 20px;
          cursor: pointer;
          padding: 8px 10px;
        }
        .overlay-search-submit .icon {
          width: 20px; /* Adjust SVG icon size */
          height: 20px; /* Adjust SVG icon size */
          fill: currentColor;
        }


        .overlay-close-button {
          position: absolute;
          top: -40px; /* Position above search bar in overlay */
          right: 0;
          background: none;
          border: none;
          color: #FFFFFF;
          font-size: 24px;
          cursor: pointer;
          height: 48px;
          width: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .overlay-close-button .icon {
          width: 24px; /* Adjust SVG icon size */
          height: 24px; /* Adjust SVG icon size */
          fill: currentColor;
        }


        .overlay-suggestions-list {
          background-color: #fff;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 250px;
          overflow-y: auto;
          color: #000;
        }
        .overlay-suggestions-list li {
          padding: 12px 15px;
          cursor: pointer;
          font-size: 16px;
        }
        .overlay-suggestions-list li:hover {
          background-color: #f0f0f0;
        }


        @media (max-width: 767px) {
          .header-search-container {
            display: none; /* Hide desktop input container on mobile */
          }
          /* mobile-search-toggle is displayed by default for mobile within its component's render logic */
        }

        @media (max-width: 479px) { /* iPhone SE specific overrides */
          .mobile-search-toggle {
            height: 44px; /* Consistent touch target */
            width: 44px;
            /* font-size: 18px; <- ini tidak lagi relevan untuk SVG */
          }
          .mobile-search-toggle .icon {
            width: 18px; /* Adjust SVG icon size for iPhone SE */
            height: 18px; /* Adjust SVG icon size for iPhone SE */
          }
          .search-overlay {
            padding-top: 50px; /* Adjust padding for smaller header */
          }
          .overlay-close-button {
            top: -35px; /* Adjust close button position */
          }
          .overlay-close-button .icon {
            width: 22px; /* Adjust SVG icon size for iPhone SE */
            height: 22px; /* Adjust SVG icon size for iPhone SE */
          }
          .overlay-search-input {
            font-size: 18px; /* Slightly smaller font in overlay for SE */
          }
          .overlay-suggestions-list li {
            font-size: 14px; /* Smaller font for suggestions */
          }
          .overlay-search-submit .icon {
            width: 18px; /* Adjust SVG icon size for iPhone SE */
            height: 18px; /* Adjust SVG icon size for iPhone SE */
          }
        }
      `}</style>
    </>
  );
};

export default HeaderSearch;