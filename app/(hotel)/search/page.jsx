// app/search/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCurrency } from '@/components/CurrencyContext';
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import HotelProperties2 from "@/components/hotel-list/hotel-list-v5/HotelProperties2";
import CallToActions from "@/components/common/CallToActions";
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { currency } = useCurrency();
  const [hotels, setHotels] = useState([]);
  const [cityName, setCityName] = useState('Location not found');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHotels = async () => {
    setLoading(true);
    setError(null);

    const city_id = searchParams.get('city_id');
    const checkInDate = searchParams.get('checkIn');
    const checkOutDate = searchParams.get('checkOut');
    const adults = parseInt(searchParams.get('adults') || '2', 10);
    const children = parseInt(searchParams.get('children') || '0', 10);
    const rooms = parseInt(searchParams.get('rooms') || '1', 10);
    const city = searchParams.get('city') || 'Location not found';
    const searchCurrency = searchParams.get('currency') || currency.currency;
    const language = searchParams.get('language') || currency.language;

    if (!city_id || !checkInDate || !checkOutDate) {
      setError('Parameter pencarian tidak lengkap');
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
          language,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setHotels(data.hotels || []);
        setCityName(data.cityName || city);
      } else {
        setError(data.message || 'Error Fetching data please try again');
      }
    } catch (err) {
      setError('Error server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [searchParams, currency]);

  return (
    <>
      <div className="header-margin"></div>
      <Header11 />
      <section className="section-bg pt-40 pb-40 relative z-5">
        <div className="section-bg__item col-12">
          <img
            src="/img/misc/bg-1.webp"
            srcSet="/img/misc/bg-1.webp 480w, /img/misc/bg-1.webp 768w, /img/misc/bg-1.webp 1200w"
            alt="Luxury background image"
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
                <h1 className="text-30 fw-600 text-white">Search Result Accomodation In {cityName}</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-sm">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <MainFilterSearchBox />
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row">
            {loading && <div>Loading hotel...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && !error && hotels.length === 0 && <div>Hotel not found.</div>}
            {!loading && !error && hotels.length > 0 && (
              <HotelProperties2 hotels={hotels} cityName={cityName} />
            )}
          </div>
        </div>
      </section>
      <CallToActions />
      <DefaultFooter />
    </>
  );
}