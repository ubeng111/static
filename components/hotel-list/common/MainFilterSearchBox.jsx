// components/hotel-list/common/MainFilterSearchBox.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrency } from '../../CurrencyContext';
import { useLanguage } from '../../header/LanguageContext';
import DateSearch from './DateSearch';
import GuestSearch from './GuestSearch';
import LocationSearch from './LocationSearch';

const MainFilterSearchBox = ({ dictionary, currentLang: propCurrentLang }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency } = useCurrency();
  const { language } = useLanguage();

  const [activeLang, setActiveLang] = useState(propCurrentLang || language || 'us');

  const [params, setParams] = useState(() => {
    const initialParams = {
      city: searchParams.get('city') || null,
      city_id: searchParams.get('city_id') || null,
      checkInDate: searchParams.get('checkIn') || null,
      checkOutDate: searchParams.get('checkOut') || null,
      adults: parseInt(searchParams.get('adults') || '2', 10),
      children: parseInt(searchParams.get('children') || '0', 10),
      rooms: parseInt(searchParams.get('rooms') || '1', 10),
      currency: searchParams.get('currency') || currency.currency,
      language: searchParams.get('language') || language,
    };
    return initialParams;
  });

  const searchDict = dictionary.search;
  const commonDict = dictionary.common;
  const mainFilterSearchBoxDict = dictionary.mainFilterSearchBox;

  useEffect(() => {
    setParams((prev) => {
        const newCurrency = searchParams.get('currency') || currency.currency;
        const newLanguage = searchParams.get('language') || language;
        return {
            ...prev,
            currency: newCurrency,
            language: newLanguage,
        };
    });

    if (propCurrentLang) {
      setActiveLang(propCurrentLang);
    } else {
      const pathLang = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : null;
      setActiveLang(pathLang || language || 'us');
    }

    if (process.env.NODE_ENV === 'development') { //
      console.log('MainFilterSearchBox useEffect: currentLang prop:', propCurrentLang, 'Active Lang (state):', activeLang); //
    }

  }, [searchParams, currency.currency, language, propCurrentLang, activeLang]);

  const updateCity = useCallback((cityData) => {
    setParams((prev) => ({
      ...prev,
      city: cityData?.city || null,
      city_id: cityData?.city_id || null,
    }));
  }, []);

  const updateDates = useCallback((dates) => {
    if (dates && dates.length === 2) {
      setParams((prev) => ({
        ...prev,
        checkInDate: dates[0]?.format('YYYY-MM-DD'),
        checkOutDate: dates[1]?.format('YYYY-MM-DD'),
      }));
    }
  }, []);

  const updateGuests = useCallback((guestCounts) => {
    setParams((prev) => ({
      ...prev,
      adults: guestCounts.Adults ?? 2,
      children: guestCounts.Children ?? 0,
      rooms: guestCounts.Rooms ?? 1,
    }));
  }, []);

  const handleSearch = () => {
    if (!params.city_id || !params.checkInDate || !params.checkOutDate) {
      alert(searchDict.searchParametersIncomplete);
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

    const finalLang = activeLang || 'us';

    console.log('MainFilterSearchBox handleSearch: Final Language:', finalLang);
    console.log('MainFilterSearchBox handleSearch: Query string:', query);
    console.log('MainFilterSearchBox handleSearch: Full URL to push:', `/${finalLang}/search?${query}`);

    router.push(`/${finalLang}/search?${query}`);
  };

  return (
    <div className="mainSearch">
      <div className="search-form">
        <LocationSearch onCitySelect={updateCity} dictionary={dictionary} />
        <DateSearch onDateChange={updateDates} dictionary={dictionary} />
        <GuestSearch onGuestChange={updateGuests} dictionary={dictionary} />
        <button className="search-button" onClick={handleSearch}>
          {mainFilterSearchBoxDict.searchButton}
        </button>
      </div>
    </div>
  );
};

export default MainFilterSearchBox;