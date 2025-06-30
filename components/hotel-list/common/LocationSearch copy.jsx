'use client';

import { useState, useEffect, useRef } from 'react';

const LocationSearch = ({ onCitySelect }) => {
  const [searchValue, setSearchValue] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false); // Add isFocused state
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const isFetching = useRef(false);

  useEffect(() => {
    // Prevent API call if searchValue is too short or an item is already selected
    if (searchValue.length < 2 || selectedItem) {
      setCities([]);
      setIsLoading(false);
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
      } catch (error) {
        console.error('Error:', error);
        setCities([]);
      } finally {
        setIsLoading(false);
        isFetching.current = false;
      }
    };

    const debounce = setTimeout(fetchCities, 500); // Change to 500ms to match HeaderSearch
    return () => clearTimeout(debounce);
  }, [searchValue, selectedItem]);

  const handleOptionClick = (item) => {
    setSearchValue(item.city);
    setSelectedItem({ city: item.city, city_id: item.city_id });
    setCities([]);
    setIsFocused(false); // Close dropdown on selection
    if (onCitySelect) onCitySelect({ city: item.city, city_id: item.city_id });
    inputRef.current.focus();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value.length < 2) {
      setSelectedItem(null);
      setCities([]);
      if (onCitySelect) onCitySelect(null);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true); // Set focus state
  };

  const handleInputBlur = () => {
    // Delay blur to allow clicking a suggestion
    setTimeout(() => {
      setIsFocused(false);
      setCities([]);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
        setIsFocused(false);
        setCities([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="searchMenu-loc px-30 lg:py-20 lg:px-0 js-form-dd js-liverSearch">
      <div>
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
            onBlur={handleInputBlur}
          />
        </div>
      </div>
      {(isLoading || (isFocused && cities.length > 0 && searchValue.length >= 2)) && (
        <div
          ref={dropdownRef}
          className="shadow-2 min-width-400"
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
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          <div className="bg-white px-20 py-20 sm:px-0 sm:py-15 rounded-4">
            {isLoading && <div style={{ color: '#333', padding: '8px 12px' }}>Loading...</div>}
            {!isLoading && cities.length === 0 && searchValue.length >= 2 && !selectedItem && (
              <div style={{ color: '#333', padding: '8px 12px' }}>City not found</div>
            )}
            {!isLoading && cities.length > 0 && (
              <ul className="y-gap-5 js-results" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {cities.map((item) => (
                  <li
                    className={`-link d-block col-12 text-left rounded-4 px-20 py-15 js-search-option mb-1 ${
                      selectedItem?.city_id === item.city_id ? 'active' : ''
                    }`}
                    key={item.city_id}
                    role="button"
                    onClick={() => handleOptionClick(item)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedItem?.city_id === item.city_id ? 'rgba(0, 0, 0, 0.1)' : 'transparent',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = selectedItem?.city_id === item.city_id ? 'rgba(0, 0, 0, 0.1)' : 'transparent')}
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;