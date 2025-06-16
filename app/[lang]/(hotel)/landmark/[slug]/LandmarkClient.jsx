// LandmarkClient.jsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCurrency } from '@/components/CurrencyContext';
import { useLanguage } from '@/components/header/LanguageContext'; // Import useLanguage
import HotelProperties2 from "@/components/hotel-list/hotel-list-v5/HotelProperties2";
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";
import Footer from "@/components/footer";
import CallToActions from "@/components/common/CallToActions";
import Header11 from "@/components/header/header-11"; // Import Header11

import React from 'react';
import Faqlandmark from '@/components/faq/faqlandmark'; // <-- BARIS IMPOR INI HARUS ADA!

// Menerima dictionary dan currentLang sebagai prop dari server component
export default function LandmarkClient({ landmarkSlug, dictionary, currentLang }) {
  const searchParams = useSearchParams();
  const { currency } = useCurrency();
  const { language } = useLanguage();

  const [hotels, setHotels] = useState([]);
  const [landmarkName, setLandmarkName] = useState('');
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('');

  // Akses bagian dictionary yang relevan
  const commonDict = dictionary?.common || {};
  const landmarkPageDict = dictionary?.landmarkPage || {};
  const headerDict = dictionary?.header || {};
  const faqDict = dictionary?.faq || {}; // Ini juga harus ada untuk FAQ

  useEffect(() => {
    console.log('CLIENT DEBUG [LandmarkClient]: Received landmarkSlug prop:', landmarkSlug);
    setCityName(commonDict.unknownCity || 'Unknown City');
    setLandmarkName(commonDict.unknownLandmark || 'Landmark');
    setCategory(commonDict.unknownCategory || 'Hotels');
  }, [landmarkSlug, commonDict]);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);

    const checkInDate = searchParams.get('checkIn') || '';
    const checkOutDate = searchParams.get('checkOut') || '';
    const adults = parseInt(searchParams.get('adults') || '2', 10);
    const children = parseInt(searchParams.get('children') || '0', 10);
    const rooms = parseInt(searchParams.get('rooms') || '1', 10);
    const apiCurrency = searchParams.get('currency') || currency?.currency || 'USD';
    const apiLanguage = searchParams.get('language') || language || 'en-us';
    const maxResult = parseInt(searchParams.get('maxResult') || '100', 10);
    const sortBy = searchParams.get('sortBy') || 'Recommended';

    if (!landmarkSlug) {
        console.error('CLIENT DEBUG [LandmarkClient]: landmarkSlug is unexpectedly empty at fetch initiation.');
        setError(landmarkPageDict.errorLandmarkNotFound || commonDict.errorLandmarkNotFound || 'Error: Landmark not found in URL. Cannot load.');
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
          ...(apiCurrency && apiCurrency !== 'USD' && { currency: apiCurrency }),
          ...(apiLanguage && apiLanguage !== 'en-us' && { language: apiLanguage }),
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
        setLandmarkName(data.landmarkName || commonDict.unknownLandmark || 'Landmark');
        setCityName(data.cityName || commonDict.unknownCity || 'Unknown City');
        setCategory(data.category || commonDict.unknownCategory || 'Hotels');
      } else {
        setError(data.message || landmarkPageDict.errorLoadingHotel || commonDict.failedToLoadHotelList || 'Failed to fetch hotel data from API.');
      }
    } catch (err) {
      setError(landmarkPageDict.serverErrorFetchingData || commonDict.errorServer || 'Server error occurred while fetching hotel data.');
      console.error("CLIENT ERROR [LandmarkClient]: Fetch operation failed:", err);
    } finally {
      setLoading(false);
    }
  }, [landmarkSlug, searchParams, currency, language, commonDict, landmarkPageDict]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return (
    <>
      <Header11 dictionary={dictionary} currentLang={currentLang} />

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
                  {landmarkPageDict.topHotelsNear
                    ?.replace("{category}", category)
                    ?.replace("{landmarkName}", landmarkName)
                    || `Top ${category || 'Hotels'} Near ${landmarkName || 'Landmark'}`
                  }
                </h1>
                <p className="text-16 text-white mt-10">
                  {landmarkPageDict.description
                    ?.replace("{category}", category)
                    ?.replace("{landmarkName}", landmarkName)
                    ?.replace("{cityName}", cityName)
                    || `${category || 'Hotels'} ${landmarkName || 'Landmark'} offers top accommodations in ${cityName || 'Unknown City'}, with great deals and amenities like free WiFi.`
                  }
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
         <MainFilterSearchBox dictionary={dictionary} currentLang={currentLang} />
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row">
            {loading && <div>{landmarkPageDict.loadingHotel || commonDict.loadingHotel || 'Loading Hotel...'}</div>}
            {error && <div>{commonDict.errorLoadingData || `Error: ${error}`}</div>}
            {!loading && !error && hotels.length === 0 && <div>{landmarkPageDict.hotelNotFound || commonDict.hotelNotFound || 'Hotel Not Found.'}</div>}
            {!loading && !error && hotels.length > 0 && (
              <>
                {hotels.map((hotel) => (
                  <React.Fragment key={hotel.hotelId}>
                    {/* Schema Markup tetap di sini */}
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
                            "addressCountry": commonDict.unknownCountryCode || "US"
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
                <HotelProperties2 hotels={hotels} cityName={cityName} dictionary={dictionary} currentLang={currentLang}/>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Bagian FAQ HARUS ADA DI SINI */}
      <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="row justify-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">{faqDict.faqTitle || 'Frequently Asked Questions'}</h2>
                  {`Answers to common questions about ${category} near ${landmarkName}.`}
              </div>
            </div>
          </div>
          <div className="row y-gap-30 pt-40 sm:pt-20">
            <Faqlandmark landmark={landmarkName} hotels={hotels} dictionary={dictionary}/> {/* PANGGILAN INI HARUS ADA! */}
          </div>
        </div>
      </section>


      <CallToActions dictionary={dictionary} currentLang={currentLang} />

      <Footer dictionary={dictionary} currentLang={currentLang} />
    </>
  );
}