'use client';

import React, { useState, useEffect, useId } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';

const DateSearch = ({ onDateChange }) => {
  const labelId = useId(); // Generate a unique ID for the label

  const [dates, setDates] = useState([
    new DateObject(),
    new DateObject().add(1, 'day'),
  ]);
  const [numberOfMonths, setNumberOfMonths] = useState(2); // Default for SSR

  useEffect(() => {
    const handleResize = () => {
      setNumberOfMonths(window.innerWidth < 576 ? 1 : 2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Call onDateChange only if the callback exists and dates are valid
    if (onDateChange && dates.length === 2) {
      const timer = setTimeout(() => onDateChange(dates), 100); // Debounce
      return () => clearTimeout(timer);
    }
  }, [dates, onDateChange]);

  const handleDateChange = (newDates) => {
    if (newDates && newDates.length === 2) {
      setDates(newDates);
    }
  };

  return (
    <div className="searchMenu-date search-field">
      {/* Label yang terhubung secara programatis dan disembunyikan secara visual */}
      <label id={labelId} htmlFor={`${labelId}-input`} className="sr-only">
        Check-in - Check-out
      </label>
      <div className="relative">
        <input
          id={`${labelId}-input`}
          type="text"
          className="w-full h-32 px-6 py-2"
          value={dates.length === 2 ? `${dates[0].format('MMM DD')} ~ ${dates[1].format('MMM DD')}` : ''}
          readOnly
          aria-labelledby={labelId}
          placeholder="Check-in ~ Check-out"
          onClick={(e) => e.target.nextSibling.querySelector('input').focus()} // Fokus ke input DatePicker
        />
        <div style={{ display: 'none' }}>
          <DatePicker
            value={dates}
            onChange={handleDateChange}
            numberOfMonths={numberOfMonths}
            range
            format="MMM DD"
            minDate={new Date()}
            containerStyle={{ width: '100%' }}
            calendarPosition="bottom-left"
          />
        </div>
      </div>
    </div>
  );
};

export default DateSearch;