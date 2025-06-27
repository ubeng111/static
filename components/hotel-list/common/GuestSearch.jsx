'use client';

import React, { useState, useEffect, useRef } from 'react';

const countersConfig = [
  { name: 'Adults', defaultValue: 2 },
  { name: 'Children', defaultValue: 0 },
  { name: 'Rooms', defaultValue: 1 },
];

const Counter = ({ name, defaultValue, onCounterChange, dictionary }) => {
  const [count, setCount] = useState(defaultValue);

  const guestLabels = dictionary.mainFilterSearchBox.guestLabels; // Tanpa fallback

  const incrementCount = () => {
    setCount((prev) => prev + 1);
    onCounterChange(name, count + 1);
  };

  const decrementCount = () => {
    const minCount = (name === 'Adults' || name === 'Rooms') ? 1 : 0;
    if (count > minCount) {
      setCount((prev) => prev - 1);
      onCounterChange(name, count - 1);
    }
  };

  const translatedName = guestLabels[name.toLowerCase()];

  return (
    <div className="counter-row">
      <div className="counter-label">
        {translatedName}
        {name === 'Children' && (
          <span className="text-10 text-light-1 ml-2"> ({guestLabels.childrenAgeRange})</span>
        )}
      </div>
      <div className="counter-controls">
        <button
          onClick={decrementCount}
          // Perbaikan untuk baris 39: Pastikan tidak ada spasi atau karakter tersembunyi.
          // Kondisi ini seharusnya benar secara sintaksis.
          disabled={count === (name === 'Adults' || name === 'Rooms' ? 1 : 0)}
          aria-label={`Decrease ${translatedName} count`}
          id={`decrement-${name.toLowerCase()}-button`}
        >-</button>
        <span className="counter-value" id={`${name.toLowerCase()}-count`}>{count}</span>
        <button
          onClick={incrementCount}
          aria-label={`Increase ${translatedName} count`}
          id={`increment-${name.toLowerCase()}-button`}
        >+</button>
      </div>
    </div>
  );
};

const GuestSearch = ({ onGuestChange, dictionary }) => {
  const [guestCounts, setGuestCounts] = useState({
    Adults: 2,
    Children: 0,
    Rooms: 1,
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const mainFilterSearchBoxDict = dictionary.mainFilterSearchBox; // Tanpa fallback
  const guestLabels = mainFilterSearchBoxDict.guestLabels; // Tanpa fallback

  useEffect(() => {
    if (onGuestChange) {
      onGuestChange(guestCounts);
    }
  }, [onGuestChange]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCounterChange = (name, value) => {
    setGuestCounts((prev) => {
      const newCounts = {
        ...prev,
        [name]: value,
      };
      if (name === 'Rooms' && value > 0 && newCounts.Adults === 0) {
        newCounts.Adults = 1;
      }
      if (name === 'Adults' && value > 0 && newCounts.Rooms === 0) {
        newCounts.Rooms = 1;
      }
      return newCounts;
    });
  };

  useEffect(() => {
    if (onGuestChange) {
      onGuestChange(guestCounts);
    }
  }, [guestCounts, onGuestChange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          event.target.closest('.searchMenu-guests') === null) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getGuestText = (type, count) => {
    const singularKey = `${type.toLowerCase()}Singular`;
    const pluralKey = `${type.toLowerCase()}Plural`;
    return `${count} ${count === 1 ? guestLabels[singularKey] : guestLabels[pluralKey]}`;
  };

  const adultText = getGuestText('Adults', guestCounts.Adults);
  const childrenText = getGuestText('Children', guestCounts.Children);
  const roomText = getGuestText('Rooms', guestCounts.Rooms);

  return (
    <div className="searchMenu-guests search-field">
      <label htmlFor="guestsRoomsInput">
        {mainFilterSearchBoxDict.selectGuestsAndRooms}
      </label>

      <div
        id="guestsRoomsInput"
        role="button"
        onClick={toggleDropdown}
        aria-label="Select guest options"
      >
        {adultText}, {childrenText}, {roomText}
      </div>

      <div className={`dropdown ${isOpen ? '-is-active' : ''}`} ref={dropdownRef}>
        <div className="counter-box">
          {countersConfig.map((counter) => (
            <Counter
              key={counter.name}
              name={counter.name}
              defaultValue={guestCounts[counter.name]}
              onCounterChange={handleCounterChange}
              dictionary={dictionary}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestSearch;