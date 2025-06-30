'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Hapus prop dictionary dan currentLang
const HeaderSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  // Ganti penggunaan kamus dengan string statis
  const searchPlaceholder = "Cari...";
  const searchButtonLabel = "Cari hotel atau destinasi";
  const closeButtonLabel = "Tutup";
  const submitSearchLabel = "Kirim pencarian";


  /**
   * Effect untuk menentukan apakah perangkat adalah mobile berdasarkan lebar jendela.
   * Berjalan sekali saat mount dan saat jendela diubah ukurannya.
   */
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    checkIsMobile(); // Pengecekan awal
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  /**
   * Effect untuk memfokuskan input pencarian saat overlay mobile terbuka.
   */
  useEffect(() => {
    if (isOverlayOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOverlayOpen]);

  /**
   * Mengambil saran kota berdasarkan istilah pencarian.
   * Menggunakan useCallback untuk memoize fungsi dan mencegah re-render yang tidak perlu.
   * @param {string} searchTerm - Nilai saat ini dari input pencarian.
   */
  const fetchCities = useCallback(async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/city-id?city=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        console.error('Gagal mengambil kota:', response.status, response.statusText);
        setSuggestions([]);
        return;
      }
      const data = await response.json();
      setSuggestions(data.cities || []);
    } catch (error) {
      console.error('Error saat mengambil kota:', error);
      setSuggestions([]);
    }
  }, []); // Tidak ada dependensi karena menggunakan `setSuggestions` secara langsung

  /**
   * Menangani perubahan pada bidang input pencarian.
   * Memperbarui status kueri dan mengambil saran kota.
   * @param {Event} e - Event perubahan input.
   */
  const handleInputChange = (e) => {
    const { value } = e.target;
    setQuery(value);
    fetchCities(value);
  };

  /**
   * Menangani pengiriman formulir pencarian.
   * Jika saran ada, navigasi ke halaman hasil pencarian menggunakan saran pertama.
   * @param {Event} e - Event pengiriman formulir.
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      const selectedCity = suggestions[0];
      navigateToSearchResult(selectedCity);
    }
    // Hapus status terlepas dari navigasi untuk mengatur ulang komponen pencarian
    resetSearchState();
  };

  /**
   * Menangani klik pada saran kota.
   * Navigasi ke halaman hasil pencarian untuk kota yang dipilih.
   * @param {Object} city - Objek kota yang dipilih.
   */
  const handleSuggestionClick = (city) => {
    navigateToSearchResult(city);
    resetSearchState();
  };

  /**
   * Fungsi pembantu untuk navigasi ke halaman hasil pencarian.
   * @param {Object} city - Objek kota yang berisi city_id dan nama kota.
   */
  const navigateToSearchResult = (city) => {
    // Hapus langPrefix
    router.push(`/search-result?city_id=${encodeURIComponent(city.city_id)}&city=${encodeURIComponent(city.city)}`);
  };

  /**
   * Fungsi pembantu untuk mengatur ulang input pencarian dan status saran.
   */
  const resetSearchState = () => {
    setQuery('');
    setSuggestions([]);
    setIsOverlayOpen(false);
  };

  /**
   * Effect untuk menangani klik di luar input/dropdown pencarian (desktop) atau overlay (mobile).
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Desktop: Tutup saran jika klik di luar input dan dropdown
      if (!isMobile && dropdownRef.current && searchInputRef.current &&
          !dropdownRef.current.contains(event.target) &&
          !searchInputRef.current.contains(event.target)) {
        setSuggestions([]);
      }

      // Mobile: Tutup overlay jika klik di luar konten overlay dan bukan pada tombol toggle
      if (isMobile && isOverlayOpen &&
          !event.target.closest('.search-overlay-content') &&
          !event.target.closest('.mobile-search-toggle')) {
        resetSearchState();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef, isOverlayOpen, isMobile, searchInputRef, resetSearchState]);

  return (
    <>
      {/* Input Pencarian Desktop - Ditampilkan hanya di desktop */}
      {!isMobile && (
        <div className="header-search-container">
          <form onSubmit={handleSearch}>
            <label htmlFor="hotel-search-input-desktop" className="sr-only">
              {searchButtonLabel}
            </label>
            <input
              id="hotel-search-input-desktop"
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
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
              aria-autocomplete="list"
              aria-controls="desktop-suggestions-list"
              aria-expanded={suggestions.length > 0}
            />
          </form>
          {query && suggestions.length > 0 && (
            <ul
              id="desktop-suggestions-list"
              ref={dropdownRef}
              role="listbox"
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
                  role="option"
                >
                  {city.city}, {city.country}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Ikon Pencarian Mobile - Ditampilkan hanya di mobile */}
      {isMobile && (
        <button
          className="mobile-search-toggle"
          onClick={() => setIsOverlayOpen(true)}
          aria-label={searchButtonLabel}
        >
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </button>
      )}

      {/* Overlay Pencarian Mobile - Ditampilkan saat isOverlayOpen bernilai true */}
      {isOverlayOpen && (
        <div className="search-overlay">
          <div className="search-overlay-content">
            <form onSubmit={handleSearch} className="overlay-search-form">
              <label htmlFor="hotel-search-input-mobile" className="sr-only">
                {searchButtonLabel}
              </label>
              <input
                id="hotel-search-input-mobile"
                ref={searchInputRef}
                type="text"
                placeholder={searchPlaceholder}
                value={query}
                onChange={handleInputChange}
                className="overlay-search-input"
                aria-autocomplete="list"
                aria-controls="mobile-suggestions-list"
                aria-expanded={suggestions.length > 0}
              />
              <button type="submit" className="overlay-search-submit" aria-label={submitSearchLabel}>
                <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                </svg>
              </button>
            </form>
            <button
              className="overlay-close-button"
              onClick={resetSearchState}
              aria-label={closeButtonLabel}
            >
              <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>

            {query && suggestions.length > 0 && (
              <ul className="overlay-suggestions-list" ref={dropdownRef} role="listbox" id="mobile-suggestions-list">
                {suggestions.map((city) => (
                  <li
                    key={city.city_id}
                    onClick={() => handleSuggestionClick(city)}
                    role="option"
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
          min-width: 150px;
          max-width: 220px;
          box-sizing: border-box;
          flex-shrink: 1;
        }

        /* Mobile Search Toggle (always styled for visibility when displayed) */
        .mobile-search-toggle {
          background: none;
          border: none;
          color: #FFFFFF;
          font-size: 20px;
          cursor: pointer;
          height: 48px;
          width: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mobile-search-toggle .icon {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        /* Search Overlay Styles */
        .search-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 60px;
          z-index: 1000;
        }

        .search-overlay-content {
          width: 90%;
          max-width: 500px;
          position: relative;
        }

        .overlay-search-form {
          display: flex;
          border-bottom: 2px solid #fff;
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
          width: 20px;
          height: 20px;
          fill: currentColor;
        }

        .overlay-close-button {
          position: absolute;
          top: -40px;
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
          width: 24px;
          height: 24px;
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
            display: none;
          }
        }

        @media (max-width: 479px) {
          .mobile-search-toggle {
            height: 44px;
            width: 44px;
          }
          .mobile-search-toggle .icon {
            width: 18px;
            height: 18px;
          }
          .search-overlay {
            padding-top: 50px;
          }
          .overlay-close-button {
            top: -35px;
          }
          .overlay-close-button .icon {
            width: 22px;
            height: 22px;
          }
          .overlay-search-input {
            font-size: 18px;
          }
          .overlay-suggestions-list li {
            font-size: 14px;
          }
          .overlay-search-submit .icon {
            width: 18px;
            height: 18px;
          }
        }
      `}</style>
    </>
  );
};

export default HeaderSearch;