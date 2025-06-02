'use client';

import React, { useState, useEffect, useRef } from 'react';

const counters = [
  { name: 'Adults', defaultValue: 2 },
  { name: 'Children', defaultValue: 0 },
  { name: 'Rooms', defaultValue: 1 },
];

const Counter = ({ name, defaultValue, onCounterChange }) => {
  const [count, setCount] = useState(defaultValue);

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

  return (
    <div className="counter-row">
      <div className="counter-label">
        {name}
        {name === 'Children' && (
          <span className="text-10 text-light-1 ml-2"> (0-17)</span>
        )}
      </div>
      <div className="counter-controls">
        <button onClick={decrementCount} disabled={count === 0} aria-label={`Decrease ${name} count`}>-</button>
        <span className="counter-value">{count}</span>
        <button onClick={incrementCount} aria-label={`Increase ${name} count`}>+</button>
      </div>
    </div>
  );
};

const GuestSearch = ({ onGuestChange }) => {
  const [guestCounts, setGuestCounts] = useState({
    Adults: 2,
    Children: 0,
    Rooms: 1,
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (onGuestChange) {
      onGuestChange(guestCounts);
    }
  }, [guestCounts]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleCounterChange = (name, value) => {
    setGuestCounts((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (onGuestChange) {
      onGuestChange({ ...guestCounts, [name]: value });
    }
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

  return (
    <div className="searchMenu-guests search-field">
      {/* Label di atas komponen */}
      <label>Select Guests & Rooms</label>

      {/* Tombol toggle dropdown dengan ringkasan total */}
      <div
        role="button"
        onClick={toggleDropdown}
        aria-label="Select guest options"
      >
        {guestCounts.Adults} Adult{guestCounts.Adults !== 1 ? 's' : ''},{" "}
        {guestCounts.Children} Child{guestCounts.Children !== 1 ? 'ren' : ''},{" "}
        {guestCounts.Rooms} Room{guestCounts.Rooms !== 1 ? 's' : ''}
      </div>

      <div className={`dropdown ${isOpen ? '-is-active' : ''}`} ref={dropdownRef}>
        <div className="counter-box">
          {counters.map((counter) => (
            <Counter
              key={counter.name}
              name={counter.name}
              defaultValue={counter.defaultValue}
              onCounterChange={handleCounterChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GuestSearch;
