'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const LocationSearch = ({ onCitySelect, dictionary }) => {
  const [searchValue, setSearchValue] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const isFetching = useRef(false);

  const mainFilterSearchBoxDict = dictionary.mainFilterSearchBox; // Tanpa fallback
  const commonDict = dictionary.common; // Tanpa fallback

  useEffect(() => {
    if (searchValue.length < 2 || selectedItem) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      if (isFetching.current) return;
      isFetching.current = true;

      try {
        const response = await fetch(`/api/city-id?city=${encodeURIComponent(searchValue)}`);
        const data = await response.json();
        setCities(response.ok ? data.cities : []);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      } finally {
        isFetching.current = false;
      }
    };

    const debounce = setTimeout(fetchCities, 300);
    return () => clearTimeout(debounce);
  }, [searchValue, selectedItem]);

  const handleOptionClick = useCallback((item) => {
    setSearchValue(item.city);
    setSelectedItem({ city: item.city, city_id: item.city_id });
    setCities([]);
    setIsOpen(false);
    if (onCitySelect) onCitySelect({ city: item.city, city_id: item.city_id });
    inputRef.current.blur();
  }, [onCitySelect]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setIsOpen(true);
    if (value.length < 2) {
      setSelectedItem(null);
      setCities([]);
      if (onCitySelect) onCitySelect(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="searchMenu-loc search-field">
      <label htmlFor="locationInput">
        {mainFilterSearchBoxDict.destinationPlaceholder}
      </label>
      <input
        ref={inputRef}
        id="locationInput"
        name="city"
        autoComplete="off"
        type="search"
        placeholder={mainFilterSearchBoxDict.destinationPlaceholder}
        value={searchValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        className="h-32 px-6 py-2"
      />
      {isOpen && (searchValue.length >= 2 || cities.length > 0) && (
        <div className="dropdown -is-active" ref={dropdownRef}>
          {cities.length === 0 && searchValue.length >= 2 && !selectedItem ? (
            <div className="dropdown-item">{commonDict.cityNotFound}</div>
          ) : (
            cities.map((item) => (
              <div
                key={item.city_id}
                className={`dropdown-item ${selectedItem?.city_id === item.city_id ? 'active' : ''}`}
                onClick={() => handleOptionClick(item)}
              >
                <i className="icon-location-2 text-12 mr-4" />
                {item.city}{item.country ? `, ${item.country}` : ''}
              </div>
            ))
          )}
        </div>
      )}

      {/* Perbaikan untuk style jsx errors */}
      {/* Pastikan tidak ada kurung kurawal atau karakter yang salah di sini */}
      <style jsx>{`
        .searchMenu-loc {
          position: relative;
        }
        .dropdown {
          position: absolute;
          top: calc(100% + 5px);
          left: 0;
          right: 0;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          z-index: 10;
          max-height: 150px;
          overflow-y: auto;
          padding: 5px 0;
        }

        .dropdown-item {
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
          color: #333;
          display: flex;
          align-items: center;
        }

        .dropdown-item.active,
        .dropdown-item:hover {
          background-color: #f0f0f0;
        }

        .dropdown::-webkit-scrollbar {
          width: 8px;
        }

        .dropdown::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 4px;
        }

        .dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default LocationSearch;