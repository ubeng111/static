'use client';

import { useState, useEffect, useRef } from 'react';

const LocationSearch = ({ onCitySelect }) => {
  const [searchValue, setSearchValue] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const isFetching = useRef(false);

  // Fungsi untuk membuka dropdown
  const openDropdown = () => {
    if (dropdownRef.current && typeof window.bootstrap !== 'undefined') {
      const dropdown = new window.bootstrap.Dropdown(dropdownRef.current);
      dropdown.show();
    }
  };

  // Fungsi untuk menutup dropdown
  const closeDropdown = () => {
    if (dropdownRef.current && typeof window.bootstrap !== 'undefined') {
      const dropdown = new window.bootstrap.Dropdown(dropdownRef.current);
      dropdown.hide();
    }
  };

  useEffect(() => {
    // Prevent API call if searchValue is too short or an item is already selected
    if (searchValue.length < 2 || selectedItem) {
      setCities([]);
      setIsLoading(false);
      closeDropdown(); // Tutup dropdown saat input tidak valid
      return;
    }

    const fetchCities = async () => {
      if (isFetching.current) return;
      isFetching.current = true;
      setIsLoading(true);
      try {
        const response = await fetch(`/api/city-id?city=${encodeURIComponent(searchValue)}`);
        const data = await response.json();
        setCities(response.ok ? data.cities : []);
        if (data.cities?.length > 0 && searchValue.length >= 2) {
          openDropdown(); // Buka dropdown hanya jika ada data valid
        } else {
          closeDropdown(); // Tutup dropdown jika tidak ada data
        }
      } catch (error) {
        console.error('Error:', error);
        setCities([]);
        closeDropdown(); // Tutup dropdown saat error
      } finally {
        setIsLoading(false);
        isFetching.current = false;
      }
    };

    const debounce = setTimeout(fetchCities, 100);
    return () => clearTimeout(debounce);
  }, [searchValue, selectedItem]);

  const handleOptionClick = (item) => {
    setSearchValue(item.city);
    setSelectedItem({ city: item.city, city_id: item.city_id });
    setCities([]);
    closeDropdown(); // Tutup dropdown setelah memilih
    if (onCitySelect) onCitySelect({ city: item.city, city_id: item.city_id });
    inputRef.current.focus();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.length < 2) {
      setSelectedItem(null);
      setCities([]); // Kosongkan cities saat input kurang dari 2 karakter
      closeDropdown(); // Tutup dropdown saat input tidak valid
      if (onCitySelect) onCitySelect(null);
    }
  };

  const handleInputFocus = () => {
    if (searchValue.length < 2 || cities.length === 0) {
      closeDropdown(); // Pastikan dropdown tertutup saat input kosong atau tidak ada data
      return;
    }
    if (searchValue.length >= 2 && cities.length > 0) {
      openDropdown(); // Buka dropdown hanya jika input valid dan ada data
    }
  };

  return (
    <div className="searchMenu-loc px-30 lg:py-20 lg:px-0 js-form-dd js-liverSearch">
      <div
        ref={dropdownRef}
        data-bs-toggle="dropdown"
        data-bs-auto-close="false"
        data-bs-offset="0,22"
      >
        <h4 className="text-15 fw-500 ls-2 lh-16">Location</h4>
        <div className="text-15 text-light-1 ls-2 lh-16">
          <input
            ref={inputRef}
            autoComplete="off"
            type="search"
            placeholder="What is your destination?"
            className="js-search js-dd-focus"
            value={searchValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>
      </div>
      <div
        className="shadow-2 dropdown-menu min-width-400"
        style={{ transition: 'opacity 0.2s ease-in-out', backgroundColor: 'transparent' }}
      >
        <div className="bg-white px-20 py-20 sm:px-0 sm:py-15 rounded-4">
          {isLoading && <div style={{ color: '#333' }}>Loading...</div>}
          {!isLoading && cities.length === 0 && searchValue.length >= 2 && !selectedItem && (
            <div style={{ color: '#333' }}>City not found</div>
          )}
          <ul className="y-gap-5 js-results">
            {cities.map((item) => (
              <li
                className={`-link d-block col-12 text-left rounded-4 px-20 py-15 js-search-option mb-1 ${
                  selectedItem?.city_id === item.city_id ? 'active' : ''
                }`}
                key={item.city_id}
                role="button"
                onClick={() => handleOptionClick(item)}
                style={{
                  backgroundColor: selectedItem?.city_id === item.city_id ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                }}
              >
                <div className="d-flex">
                  <div className="icon-location-2 text-light-1 text-20 pt-4" />
                  <div className="ml-10">
                    <div className="text-15 lh-12 fw-500" style={{ color: '#333' }}>
                      {item.city}{item.country ? `, ${item.country}` : ''}
                    </div>
                    <div className="text-14 lh-12 text-light-1 mt-5" style={{ color: '#666' }}>
                      City ID: {item.city_id}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LocationSearch;