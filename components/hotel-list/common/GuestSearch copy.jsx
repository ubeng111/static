'use client';

import React, { useState, useEffect, useRef } from 'react';

const counters = [
  { name: 'Adults', defaultValue: 2 },
  { name: 'Children', defaultValue: 0 },
  { name: 'Rooms', defaultValue: 1 },
];

const Counter = ({ name, defaultValue, onCounterChange, dictionary }) => { // Menerima dictionary
  const [count, setCount] = useState(defaultValue);

  const guestLabels = dictionary?.mainFilterSearchBox?.guestLabels || {};

  const incrementCount = () => {
    setCount((prev) => prev + 1);
    onCounterChange(name, count + 1);
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount((prev) => prev - 1);
      onCounterChange(name, count - 1);
    }
  };

  const translatedName = guestLabels[name.toLowerCase()] || name;

  return (
    <div className="counter-row">
      <div className="counter-label">
        {translatedName}
        {name === 'Children' && (
          <span className="text-10 text-light-1 ml-2"> ({guestLabels.childrenAgeRange || '0-17'})</span>
        )}
      </div>
      <div className="counter-controls">
        <button onClick={decrementCount} disabled={count === 0} aria-label={`Decrease ${translatedName} count`}>-</button>
        <span className="counter-value">{count}</span>
        <button onClick={incrementCount} aria-label={`Increase ${translatedName} count`}>+</button>
      </div>
    </div>
  );
};

const GuestSearch = ({ onGuestChange, dictionary }) => { // Menerima dictionary
  const [guestCounts, setGuestCounts] = useState({
    Adults: 2,
    Children: 0,
    Rooms: 1,
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const mainFilterSearchBoxDict = dictionary?.mainFilterSearchBox || {};
  const guestLabels = mainFilterSearchBoxDict.guestLabels || {};

  useEffect(() => {
    if (onGuestChange) {
      onGuestChange(guestCounts);
    }
  }, [guestCounts, onGuestChange]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCounterChange = (name, value) => {
    setGuestCounts((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const adultText = `${guestCounts.Adults} ${guestCounts.Adults !== 1 ? (guestLabels.adultsPlural || 'Adults') : (guestLabels.adultsSingular || 'Adult')}`;
  const childrenText = `${guestCounts.Children} ${guestCounts.Children !== 1 ? (guestLabels.childrenPlural || 'Children') : (guestLabels.childrenSingular || 'Child')}`;
  const roomText = `${guestCounts.Rooms} ${guestCounts.Rooms !== 1 ? (guestLabels.roomsPlural || 'Rooms') : (guestLabels.roomsSingular || 'Room')}`;


  return (
    <div className="searchMenu-guests search-field">
      <label>{mainFilterSearchBoxDict.selectGuestsAndRooms || 'Select Guests & Rooms'}</label>

      <div
        role="button"
        onClick={toggleDropdown}
        aria-label="Select guest options"
      >
        {adultText}, {childrenText}, {roomText}
      </div>

      <div className={`dropdown ${isOpen ? '-is-active' : ''}`} ref={dropdownRef}>
        <div className="counter-box">
          {counters.map((counter) => (
            <Counter
              key={counter.name}
              name={counter.name}
              defaultValue={counter.defaultValue}
              onCounterChange={handleCounterChange}
              dictionary={dictionary} // Teruskan dictionary ke Counter
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestSearch;