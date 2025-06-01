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
    setTimeout(() => {
      onCounterChange(name, count + 1);
    }, 0);
  };

  const decrementCount = () => {
    if (count > 0) {
      setCount((prev) => prev - 1);
      setTimeout(() => {
        onCounterChange(name, count - 1);
      }, 0);
    }
  };

  return (
    <>
      <div className="row y-gap-10 justify-between items-center">
        <div className="col-auto">
          <div className="text-15 lh-12 fw-500">{name}</div>
          {name === 'Children' && (
            <div className="text-14 lh-12 text-light-1 mt-5">Usia 0 - 17</div>
          )}
        </div>
        <div className="col-auto">
          <div className="d-flex items-center js-counter">
            <button
              className="button -outline-blue-1 text-blue-1 size-44 rounded-4 js-down"
              onClick={decrementCount}
              aria-label={`Decrease ${name} count`}
              style={{ minWidth: '44px', minHeight: '44px', margin: '0 8px' }}
            >
              <i className="icon-minus text-12" />
            </button>
            <div className="flex-center size-20 ml-15 mr-15">
              <div className="text-15 js-count">{count}</div>
            </div>
            <button
              className="button -outline-blue-1 text-blue-1 size-44 rounded-4 js-up"
              onClick={incrementCount}
              aria-label={`Increase ${name} count`}
              style={{ minWidth: '44px', minHeight: '44px', margin: '0 8px' }}
            >
              <i className="icon-plus text-12" />
            </button>
          </div>
        </div>
      </div>
      <div className="border-top-light mt-24 mb-24" />
    </>
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
  }, []);

  const openDropdown = () => {
    if (dropdownRef.current && typeof window.bootstrap !== 'undefined') {
      const dropdown = new window.bootstrap.Dropdown(dropdownRef.current);
      dropdown.show();
      setIsOpen(true);
    }
  };

  const handleCounterChange = (name, value) => {
    setGuestCounts((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setTimeout(() => {
      if (onGuestChange) {
        onGuestChange({ ...guestCounts, [name]: value });
      }
    }, 0);
  };

  const handleInputClick = () => {
    openDropdown();
  };

  return (
    <div className="searchMenu-guests px-20 lg:py-20 lg:px-0 js-form-dd bg-white position-relative">
      <div
        ref={dropdownRef}
        role="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded={isOpen}
        aria-label="Select guest options"
        data-bs-offset="0,22"
        onClick={handleInputClick}
        tabIndex={0}
      >
        <h4 className="text-15 fw-500 ls-2 lh-16">Guest</h4>
        <div className="text-15 text-light-1 ls-2 lh-16">
          <span className="js-count-adult">{guestCounts.Adults}</span> Adult -{' '}
          <span className="js-count-child">{guestCounts.Children}</span> Children -{' '}
          <span className="js-count-room">{guestCounts.Rooms}</span> Room
        </div>
      </div>
      <div className="shadow-2 dropdown-menu min-width-400">
        <div className="bg-white px-30 py-30 rounded-4 counter-box">
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