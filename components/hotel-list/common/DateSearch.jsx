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
    if (onDateChange && dates.length === 2) {
      const timer = setTimeout(() => onDateChange(dates), 100);
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
      {/* Tetapkan ID unik untuk label */}
      <label id={labelId} htmlFor={`${labelId}-input`} className="sr-only">Check-in - Check-out</label>
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
        // Teruskan ID dan aria-labelledby ke input yang dirender oleh DatePicker
        inputProps={{
          id: `${labelId}-input`, // Gunakan ID yang unik untuk input
          placeholder: "Check-in ~ Check-out",
          'aria-labelledby': labelId // Ini akan mengaitkan input dengan label tersembunyi
        }}
      />
    </div>
  );
};

export default DateSearch;