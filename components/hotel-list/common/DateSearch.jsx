'use client';

import React, { useState, useEffect, useId } from 'react'; // Import useId hook
import DatePicker, { DateObject } from 'react-multi-date-picker';

const DateSearch = ({ onDateChange }) => {
  const inputId = useId(); // Generate a unique ID for the input

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
  }, [dates, onDateChange]); // Dependency array to prevent infinite loops

  const handleDateChange = (newDates) => {
    if (newDates && newDates.length === 2) {
      setDates(newDates);
    }
  };

  return (
    <div className="searchMenu-date search-field">
      {/* Label yang terhubung secara programatis dan disembunyikan secara visual */}
      {/*
        The label is still good practice for semantic meaning,
        even if the ARIA attribute on the input is the primary fix for the warning.
        Keep it with sr-only for visual hiding.
      */}
      <label htmlFor={inputId} className="sr-only">Check-in - Check-out</label>
      <DatePicker
        value={dates}
        onChange={handleDateChange}
        numberOfMonths={numberOfMonths}
        range
        format="MMM DD"
        minDate={new Date()}
        inputClass="w-full h-32 px-6 py-2"
        containerStyle={{ width: '100%' }}
        calendarPosition="bottom-left"
        // Teruskan ID dan aria-label ke input yang dirender oleh DatePicker
        inputProps={{
          id: inputId,
          placeholder: "Check-in ~ Check-out",
          'aria-label': "Check-in and Check-out Dates" // Ini akan menyelesaikan peringatan
        }}
      />
    </div>
  );
};

export default DateSearch;