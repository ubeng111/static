'use client';

import React, { useState, useEffect } from 'react';
import DatePicker, { DateObject } from 'react-multi-date-picker';

const DateSearch = ({ onDateChange, dictionary }) => {
  const [dates, setDates] = useState([
    new DateObject(), // Default check-in: hari ini
    new DateObject().add(1, 'day'), // Default check-out: besok
  ]);

  const searchDict = dictionary.search; // Tanpa fallback

  useEffect(() => {
    if (onDateChange && dates.length === 2) {
      onDateChange(dates);
    }
  }, []);

  const handleDateChange = (newDates) => {
    if (newDates && newDates.length === 2) {
      setDates(newDates);
      if (onDateChange) {
        onDateChange(newDates);
      }
    }
  };

  return (
    <div className="w-full">
      <DatePicker
        className="w-full px-4 py-2 border border-gray-300 rounded-4 h-10 text-15 leading-[15px] bg-white"
        containerClassName="w-full"
        value={dates}
        onChange={handleDateChange}
        numberOfMonths={2}
        offsetY={10}
        range
        format="MMMM DD"
        minDate={new Date()}
        placeholder={searchDict.checkInCheckOut} // Baris 42
        inputClass="rmdp-input"
        id="checkinCheckoutInput"
        name="checkin_checkout_dates"
      />
    </div>
  );
};

export default DateSearch;