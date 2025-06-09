// LandmarkClient.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCurrency } from '@/components/CurrencyContext';
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";
import HotelProperties2 from "@/components/hotel-list/hotel-list-v5/HotelProperties2";
import React from 'react';

export default function LandmarkClient({ landmarkSlug }) {
  const searchParams = useSearchParams();
  const { currency } = useCurrency();
  const [hotels, setHotels] = useState([]);
  const [landmarkName, setLandmarkName] = useState('');
  const [cityName, setCityName] = useState('Unknown City');
  const [loading, setLoading] = useState(true); // <--- KESALAHAN SINTAKS DIBETULKAN DI SINI
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('Hotels');

  useEffect(() => {
    console.log('CLIENT DEBUG [LandmarkClient]: Received landmarkSlug prop:', landmarkSlug);
  }, [landmarkSlug]);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);

    const checkInDate = searchParams.get('checkIn') || '';
    const checkOutDate = searchParams.get('checkOut') || '';
    const adults = parseInt(searchParams.get('adults') || '2', 10);
    const children = parseInt(searchParams.get('children') || '0', 10);
    const rooms = parseInt(searchParams.get('rooms') || '1', 10);
    const searchCurrency = searchParams.get('currency') || currency?.currency || 'USD';
    const language = searchParams.get('language') || currency?.language || 'en-us';
    const maxResult = parseInt(searchParams.get('maxResult') || '100', 10);
    const sortBy = searchParams.get('sortBy') || 'Recommended';

    if (!landmarkSlug) {
        console.error('CLIENT DEBUG [LandmarkClient]: landmarkSlug is unexpectedly empty at fetch initiation.');
        setError('Error: Slug Landmark tidak ditemukan di URL. Tidak dapat memuat.');
        setLoading(false);
        return;
    }

    try {
      const requestBody = {
          landmark_slug: landmarkSlug,
          ...(checkInDate && { checkInDate }),
          ...(checkOutDate && { checkOutDate }),
          ...(adults !== 2 && { numberOfAdults: adults }),
          ...(children !== 0 && { numberOfChildren: children }),
          ...(rooms !== 1 && { numberOfRooms: rooms }),
          ...(searchCurrency && searchCurrency !== 'USD' && { currency: searchCurrency }),
          ...(language && language !== 'en-us' && { language }),
          ...(maxResult !== 100 && { maxResult }),
          ...(sortBy !== 'Recommended' && { sortBy }),
      };

      console.log('CLIENT DEBUG [LandmarkClient]: Sending request body to /api/landmark:', requestBody);

      const response = await fetch('/api/landmark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('CLIENT DEBUG [LandmarkClient]: Received response from /api/landmark:', data);

      if (response.ok) {
        setHotels(data.hotels || []);
        setLandmarkName(data.landmarkName || '');
        setCityName(data.cityName || 'Unknown City');
        setCategory(data.category || 'Hotels');
      } else {
        setError(data.message || 'Gagal mengambil data hotel dari API.');
      }
    } catch (err) {
      setError('Terjadi kesalahan server saat mengambil data hotel.');
      console.error("CLIENT ERROR [LandmarkClient]: Fetch operation failed:", err);
    } finally {
      setLoading(false);
    }
  }, [landmarkSlug, searchParams, currency]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return (
    <>
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
                <h1 className="text-30 fw-600 text-white">
                  Top {category || 'Hotels'} Near {landmarkName}
                </h1>
                <p className="text-16 text-white mt-10">
                  {(category || 'Hotels') + ' ' + (landmarkName || 'Landmark')} offers top accommodations in {cityName}, with great deals and amenities like free WiFi.
                </p>
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
            {loading && <div>Loading Hotel...</div>}
            {error && <div>Error: {error}</div>}
            {!loading && !error && hotels.length === 0 && <div>Hotel Not Found.</div>}
            {!loading && !error && hotels.length > 0 && (
              <>
                {hotels.map((hotel) => (
                  <React.Fragment key={hotel.hotelId}>
                    <script
                      type="application/ld+json"
                      dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                          "@context": "https://schema.org",
                          "@type": "Hotel",
                          "name": hotel.hotelName,
                          "url": hotel.landingURL,
                          "image": hotel.imageURL,
                          "starRating": {
                            "@type": "Rating",
                            "ratingValue": hotel.starRating,
                            "bestRating": 5
                          },
                          "aggregateRating": hotel.reviewCount > 0 ? {
                            "@type": "AggregateRating",
                            "ratingValue": hotel.reviewScore,
                            "bestRating": 10,
                            "worstRating": 1,
                            "reviewCount": hotel.reviewCount
                          } : undefined,
                          "offers": {
                            "@type": "Offer",
                            "priceCurrency": hotel.currency,
                            "price": hotel.dailyRate,
                            "url": hotel.landingURL,
                            "availability": "https://schema.org/InStock",
                            "validFrom": new Date().toISOString().split('T')[0]
                          },
                          "address": {
                            "@type": "PostalAddress",
                            "addressLocality": cityName,
                            "addressCountry": "US"
                          },
                          "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": hotel.latitude,
                            "longitude": hotel.longitude
                          },
                          "amenityFeature": [
                            ...(hotel.freeWifi ? [{ "@type": "LocationFeatureSpecification", "value": "Free Wifi", "name": "Free Wifi" }] : []),
                            ...(hotel.includeBreakfast ? [{ "@type": "LocationFeatureSpecification", "value": "Breakfast Included", "name": "Breakfast Included" }] : [])
                          ]
                        })
                      }}
                    />
                  </React.Fragment>
                ))}
                <HotelProperties2 hotels={hotels} cityName={cityName} />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}