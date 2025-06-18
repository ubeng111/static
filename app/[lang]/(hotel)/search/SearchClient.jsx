// app/search/SearchClient.jsx
'use client';

import { useState, useEffect, useCallback } from 'react'; // Tambahkan useCallback
import { useSearchParams } from 'next/navigation';
import { useCurrency } from '@/components/CurrencyContext';
import { useLanguage } from '@/components/header/LanguageContext';

// --- MODIFIKASI: Impor Komponen Secara Dinamis (next/dynamic) ---
import dynamic from 'next/dynamic';

const DynamicMainFilterSearchBox = dynamic(() => import("@/components/hotel-list/common/MainFilterSearchBox"), {
  ssr: false,
  loading: () => <p>Loading search box...</p>,
});
const DynamicHotelProperties2 = dynamic(() => import("@/components/hotel-list/hotel-list-v5/HotelProperties2"), {
  ssr: false,
  loading: () => <p>Loading hotel properties...</p>,
});
const DynamicFooter = dynamic(() => import("@/components/footer"), {
  ssr: false,
  loading: () => <p>Loading footer...</p>,
});
const DynamicCallToActions = dynamic(() => import("@/components/common/CallToActions"), {
  ssr: false,
  loading: () => <p>Loading call to actions...</p>,
});
const DynamicHeader11 = dynamic(() => import("@/components/header/header-11"), {
  ssr: false,
  loading: () => <p>Loading header...</p>,
});

// --- AKHIR MODIFIKASI next/dynamic ---


// Add dictionary and currentLang to the destructured props
export default function SearchClient({ dictionary, currentLang }) {
  const searchParams = useSearchParams();
  const { currency } = useCurrency();
  const { language } = useLanguage();

  const [hotels, setHotels] = useState([]);
  const [cityName, setCityName] = useState('Lokasi Tidak Diketahui');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Akses bagian dictionary yang relevan
  const searchDict = dictionary?.search || {};
  const commonDict = dictionary?.common || {};
  const headerDict = dictionary?.header || {};

  const fetchHotels = useCallback(async () => { // Gunakan useCallback
    console.log('SearchClient: fetchHotels triggered!');
    setLoading(true);
    setError(null);

    const city_id = searchParams.get('city_id') || '';
    const checkInDate = searchParams.get('checkIn') || '';
    const checkOutDate = searchParams.get('checkOut') || '';
    const adults = parseInt(searchParams.get('adults') || '2', 10);
    const children = parseInt(searchParams.get('children') || '0', 10);
    const rooms = parseInt(searchParams.get('rooms') || '1', 10);
    const city = searchParams.get('city') || 'Lokasi Tidak Diketahui';

    const searchCurrency = searchParams.get('currency') || currency.currency || 'USD';
    const searchLanguage = searchParams.get('language') || language || 'en';

    console.log('SearchClient: Fetching with params from URLSearchParams:', {
        city_id, checkInDate, checkOutDate, adults, children, rooms, searchCurrency, searchLanguage
    });

    if (!city_id || !checkInDate || !checkOutDate) {
      setError(searchDict.searchParamsIncomplete || 'Parameter pencarian tidak lengkap');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/agoda-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city_id,
          checkInDate,
          checkOutDate,
          numberOfAdults: adults,
          numberOfChildren: children,
          numberOfRooms: rooms,
          currency: searchCurrency,
          language: searchLanguage,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setHotels(data.hotels || []);
        setCityName(data.cityName || city);
      } else {
        setError(data.message || searchDict.failedToFetchHotelData || 'Gagal mengambil data hotel');
      }
    } catch (err) {
      setError(commonDict.errorServer || 'Error server');
    } finally {
      setLoading(false);
    }
  }, [searchParams, currency, language, searchDict, commonDict]); // Tambahkan semua dependensi

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]); // Gunakan fetchHotels sebagai dependensi karena sudah pakai useCallback

  return (
    <>
      <DynamicHeader11 dictionary={dictionary} currentLang={currentLang} />

      <section className="section-bg pt-40 pb-40 relative z-5">
        <div className="section-bg__item col-12">
          <img
            src="/img/misc/bg-1.webp"
            srcSet="/img/misc/bg-1.webp 480w, /img/misc/bg-1.webp 768w, /img/misc/bg-1.webp 1200w"
            alt={headerDict.luxuryBackgroundImageAlt || "Luxury background image"}
            loading="lazy"
            className="w-full h-full object-cover"
            width="1200"
            height="800"
          />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h1 className="text-30 fw-600 text-white">
                  {searchDict.searchResultAccommodationIn?.replace('{cityName}', cityName) || `Search Result Accomodation In ${cityName}`}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-sm">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <DynamicMainFilterSearchBox dictionary={dictionary} currentLang={currentLang} />
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row">
            {loading && <div>{commonDict.loadingHotel || 'Loading hotel...'}</div>}
            {error && <div>{commonDict.errorOccurred || `Error: ${error}`}</div>}
            {!loading && !error && hotels.length === 0 && <div>{commonDict.hotelNotFound || 'Hotel not found.'}</div>}
            {!loading && !error && hotels.length > 0 && (
                <DynamicHotelProperties2 hotels={hotels} cityName={cityName} dictionary={dictionary} currentLang={currentLang}/>
            )}
          </div>
        </div>
      </section>
      <DynamicCallToActions dictionary={dictionary} currentLang={currentLang} />

      <DynamicFooter dictionary={dictionary} currentLang={currentLang} />
    </>
  );
}