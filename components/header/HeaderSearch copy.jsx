'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const HeaderSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Fetch city suggestions from the API
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

  // Handle input change and fetch suggestions
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchCities(value);
  };

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (suggestions.length === 1) {
      // If only one city is found, navigate directly
      router.push(`/search-result?city_id=${encodeURIComponent(suggestions[0].city_id)}`);
      setQuery('');
      setSuggestions([]);
    } else if (suggestions.length > 0) {
      // If multiple cities, select the first one (or keep dropdown open)
      router.push(`/search-result?city_id=${encodeURIComponent(suggestions[0].city_id)}`);
      setQuery('');
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (cityId) => {
    router.push(`/search-result?city_id=${encodeURIComponent(cityId)}`);
    setQuery('');
    setSuggestions([]);
    setIsFocused(false);
  };

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSuggestions([]);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '120px', flexShrink: 1, marginRight: '8px' }}>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsFocused(true)}
          style={{
            width: '70%',
            height: '30px',
            fontSize: '13px',
            padding: '3px 6px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#fff',
            color: '#000',
          }}
        />
      </form>
      {isFocused && suggestions.length > 0 && (
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
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {suggestions.map((city) => (
            <li
              key={city.city_id}
              onClick={() => handleSuggestionClick(city.city_id)}
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
  );
};

export default HeaderSearch;