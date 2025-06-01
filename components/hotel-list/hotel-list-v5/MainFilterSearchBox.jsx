// components/hotel-list/common/MainFilterSearchBox.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '../CurrencyContext';
import DateSearch from './DateSearch';
import GuestSearch from './GuestSearch';
import LocationSearch from './LocationSearch';

const MainFilterSearchBox = () => {
  const router = useRouter();
  const { currency } = useCurrency();
  const [searchParams, setSearchParams] = useState({
    city: null,
    city_id: null,
    checkInDate: null,
    checkOutDate: null,
    adults: 2,
    children: 0,
    rooms: 1,
    currency: currency.currency,
    language: currency.language,
  });

  useEffect(() => {
    setSearchParams((prev) => ({
      ...prev,
      currency: currency.currency,
      language: currency.language,
    }));
  }, [currency]);

  const updateCity = (cityData) => {
    setSearchParams((prev) => ({
      ...prev,
      city: cityData?.city,
      city_id: cityData?.city_id,
    }));
  };

  const updateDates = (dates) => {
    setSearchParams((prev) => ({
      ...prev,
      checkInDate: dates[0]?.format('YYYY-MM-DD'),
      checkOutDate: dates[1]?.format('YYYY-MM-DD'),
    }));
  };

  const updateGuests = (guestCounts) => {
    setSearchParams((prev) => ({
      ...prev,
      adults: guestCounts.Adults ?? 2,
      children: guestCounts.Children ?? 0,
      rooms: guestCounts.Rooms ?? 1,
    }));
  };

  const handleSearch = () => {
    if (!searchParams.city_id || !searchParams.checkInDate || !searchParams.checkOutDate) {
      alert('Pilih kota dan tanggal.');
      return;
    }

    const query = new URLSearchParams({
      city: searchParams.city || '',
      city_id: searchParams.city_id,
      checkIn: searchParams.checkInDate,
      checkOut: searchParams.checkOutDate,
      adults: searchParams.adults.toString(),
      children: searchParams.children.toString(),
      rooms: searchParams.rooms.toString(),
      currency: searchParams.currency,
      language: searchParams.language,
    }).toString();

    router.push(`/search?${query}`);
  };

  return (
    <div className="mainSearch -col-3-big bg-white px-10 py-10 lg:px-20 lg:pt-5 lg:pb-20 rounded-4 mt-30">
      <div className="button-grid items-center">
        <LocationSearch onCitySelect={updateCity} />
        <div className="searchMenu-date px-30 lg:py-20 sm:px-20 js-form-dd js-calendar">
          <div>
            <h4 className="text-15 fw-500 ls-2 lh-16">Check in - Check out</h4>
            <DateSearch onDateChange={updateDates} />
          </div>
        </div>
        <GuestSearch onGuestChange={updateGuests} />
        <div className="button-item h-full">
          <button
            className="button -dark-1 py-15 px-40 h-full col-12 rounded-0 bg-blue-1 text-white"
            onClick={handleSearch}
          >
            <i className="icon-search text-20 mr-10" />
            Cari
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainFilterSearchBox;