// components/hotel-list/common/MainFilterSearchBox.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrency } from '../../CurrencyContext';
import DateSearch from './DateSearch';
import GuestSearch from './GuestSearch';
import LocationSearch from './LocationSearch';

const MainFilterSearchBox = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency } = useCurrency();
  const [params, setParams] = useState({
    city: searchParams.get('city') || null,
    city_id: searchParams.get('city_id') || null,
    checkInDate: searchParams.get('checkIn') || null,
    checkOutDate: searchParams.get('checkOut') || null,
    adults: parseInt(searchParams.get('adults') || '2', 10),
    children: parseInt(searchParams.get('children') || '0', 10),
    rooms: parseInt(searchParams.get('rooms') || '1', 10),
    currency: currency.currency,
    language: currency.language,
  });

  // Perbarui searchParams saat currency berubah
  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      currency: currency.currency,
      language: currency.language,
    }));
  }, [currency]);

  // Perbarui URL otomatis saat mata uang berubah
  useEffect(() => {
    if (!params.city_id || !params.checkInDate || !params.checkOutDate) return;

    const query = new URLSearchParams({
      city: params.city || '',
      city_id: params.city_id,
      checkIn: params.checkInDate,
      checkOut: params.checkOutDate,
      adults: params.adults.toString(),
      children: params.children.toString(),
      rooms: params.rooms.toString(),
      currency: params.currency,
      language: params.language,
    }).toString();

    router.replace(`/search?${query}`, { scroll: false });
  }, [params.currency, params.language]);

  const updateCity = (cityData) => {
    setParams((prev) => ({
      ...prev,
      city: cityData?.city,
      city_id: cityData?.city_id,
    }));
  };

  const updateDates = (dates) => {
    setParams((prev) => ({
      ...prev,
      checkInDate: dates[0]?.format('YYYY-MM-DD'),
      checkOutDate: dates[1]?.format('YYYY-MM-DD'),
    }));
  };

  const updateGuests = (guestCounts) => {
    setParams((prev) => ({
      ...prev,
      adults: guestCounts.Adults ?? 2,
      children: guestCounts.Children ?? 0,
      rooms: guestCounts.Rooms ?? 1,
    }));
  };

  const handleSearch = () => {
    if (!params.city_id || !params.checkInDate || !params.checkOutDate) {
      alert('Pilih kota dan tanggal.');
      return;
    }

    const query = new URLSearchParams({
      city: params.city || '',
      city_id: params.city_id,
      checkIn: params.checkInDate,
      checkOut: params.checkOutDate,
      adults: params.adults.toString(),
      children: params.children.toString(),
      rooms: params.rooms.toString(),
      currency: params.currency,
      language: params.language,
    }).toString();

    router.push(`/search?${query}`);
  };

  return (
<div className="mainSearch -col-3-big bg-white px-10 py-10 lg:px-20 lg:pt-5 lg:pb-20 rounded-xl mt-8 border border-gray-300 shadow-md transition-all hover:shadow-lg">
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