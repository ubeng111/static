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

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      currency: currency.currency,
      language: currency.language,
    }));
  }, [currency.currency, currency.language]);

  const updateCity = (cityData) => {
    setParams((prev) => ({
      ...prev,
      city: cityData?.city || null,
      city_id: cityData?.city_id || null,
    }));
  };

  const updateDates = (dates) => {
    if (dates && dates.length === 2) {
      setParams((prev) => ({
        ...prev,
        checkInDate: dates[0]?.format('YYYY-MM-DD'),
        checkOutDate: dates[1]?.format('YYYY-MM-DD'),
      }));
    }
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
      alert('Please select city and dates.');
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
    <div className="mainSearch">
      <div className="search-form">
        <LocationSearch onCitySelect={updateCity} />
        <DateSearch onDateChange={updateDates} />
        <GuestSearch onGuestChange={updateGuests} />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};

export default MainFilterSearchBox;