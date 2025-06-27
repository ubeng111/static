// components/hotel-list/common/MainFilterSearchBox.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCurrency } from '../../CurrencyContext';
import { useLanguage } from '../../header/LanguageContext'; // Path yang benar
import DateSearch from './DateSearch';
import GuestSearch from './GuestSearch';
import LocationSearch from './LocationSearch';

const MainFilterSearchBox = ({ dictionary, currentLang: propCurrentLang }) => { // Ganti nama prop untuk menghindari konflik
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency } = useCurrency();
  const { language } = useLanguage();

  // State untuk bahasa yang aktif, dengan fallback 'us'
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

  // Akses dictionary
  const searchDict = dictionary?.search || {};
  const commonDict = dictionary?.common || {};

  useEffect(() => {
    // Update currency dan language dari searchParams atau context
    setParams((prev) => {
        const newCurrency = searchParams.get('currency') || currency.currency;
        const newLanguage = searchParams.get('language') || language;
        return {
            ...prev,
            currency: newCurrency,
            language: newLanguage,
        };
    });

    // Update activeLang jika propCurrentLang berubah
    if (propCurrentLang) {
      setActiveLang(propCurrentLang);
    } else {
      // Fallback jika propCurrentLang tidak tersedia (misal di halaman non-[lang] atau saat loading)
      const pathLang = window.location.pathname.split('/')[1]; // Coba ambil dari path URL
      setActiveLang(pathLang || language || 'us');
    }

    console.log('MainFilterSearchBox useEffect: currentLang prop:', propCurrentLang, 'Active Lang (state):', activeLang); // DEBUGGING
  }, [searchParams, currency.currency, currency.language, language, propCurrentLang, activeLang]); // Tambahkan activeLang ke dep. array

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
      alert(searchDict.searchParametersIncomplete || 'Please select city and dates.');
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

    // Pastikan activeLang selalu memiliki nilai yang valid
    const finalLang = activeLang || 'us'; // Fallback final jika activeLang masih kosong

    console.log('MainFilterSearchBox handleSearch: Final Language:', finalLang); // DEBUGGING
    console.log('MainFilterSearchBox handleSearch: Query string:', query);     // DEBUGGING
    console.log('MainFilterSearchBox handleSearch: Full URL to push:', `/${finalLang}/search?${query}`); // DEBUGGING

    // Mengarahkan ke rute pencarian yang benar
    router.push(`/${finalLang}/search?${query}`);
  };

  return (
    <div className="mainSearch">
      <div className="search-form">
        <LocationSearch onCitySelect={updateCity} dictionary={dictionary} />
        <DateSearch onDateChange={updateDates} dictionary={dictionary} />
        <GuestSearch onGuestChange={updateGuests} dictionary={dictionary} />
        <button className="search-button" onClick={handleSearch}>
          {commonDict.search || 'Search'}
        </button>
      </div>
    </div>
  );
};

export default MainFilterSearchBox;