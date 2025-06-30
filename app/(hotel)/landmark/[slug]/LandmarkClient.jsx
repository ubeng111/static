// LandmarkClient.jsx
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCurrency } from '@/components/CurrencyContext';
import HotelProperties2 from "@/components/hotel-list/hotel-list-v5/HotelProperties2";
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";
import Footer from "@/components/footer";
import CallToActions from "@/components/common/CallToActions";
import Header11 from "@/components/header/header-11";

import React from 'react';
import Faqlandmark from '@/components/faq/faqlandmark';

export default function LandmarkClient({
  landmarkSlug,
  initialLandmarkName,
  initialCityName, // Prop cityName yang sudah ada
  initialCategory,
  longDescriptionSegments,
}) {
  const searchParams = useSearchParams();
  const { currency } = useCurrency();

  const [hotels, setHotels] = useState([]);
  const [landmarkName, setLandmarkName] = useState(initialLandmarkName);
  const [cityName, setCityName] = useState(initialCityName); // State untuk cityName
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(initialCategory); // State untuk category

  // Pisahkan longDescription menjadi deskripsi singkat
  const shortDescription = useMemo(() => {
    if (!longDescriptionSegments || longDescriptionSegments.length === 0) return '';
    const firstParagraphContent = longDescriptionSegments[0].content;
    const firstSentenceEnd = firstParagraphContent.indexOf('. ');
    if (firstSentenceEnd !== -1 && firstSentenceEnd < 140) {
      return firstParagraphContent.substring(0, firstSentenceEnd + 1).trim();
    }
    return firstParagraphContent.substring(0, 150).trim() + (firstParagraphContent.length > 150 ? '...' : '');
  }, [longDescriptionSegments]);


  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);

    const checkInDate = searchParams.get('checkIn') || '';
    const checkOutDate = searchParams.get('checkOut') || '';
    const adults = parseInt(searchParams.get('adults') || '2', 10);
    const children = parseInt(searchParams.get('children') || '0', 10);
    const rooms = parseInt(searchParams.get('rooms') || '1', 10);
    const apiCurrency = searchParams.get('currency') || currency?.currency || 'USD';
    const maxResult = parseInt(searchParams.get('maxResult') || '100', 10);
    const sortBy = searchParams.get('sortBy') || 'Recommended';

    if (!landmarkSlug) {
        console.error('CLIENT DEBUG [LandmarkClient]: landmarkSlug is unexpectedly empty at fetch initiation.');
        setError('Error: Landmark not found in URL. Cannot load.');
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
        // Perbarui state lokal dengan data dari API jika ada, tapi prioritaskan initial props dari landmarkData untuk lokasi
        setLandmarkName(data.landmarkName || initialLandmarkName);
        setCityName(data.cityName || initialCityName); // Update cityName dari API jika lebih baru/beda
        setCategory(data.category || initialCategory); // Update category dari API jika lebih baru/beda
      } else {
        setError(data.message || 'Failed to fetch hotel data from API.');
      }
    } catch (err) {
      setError('Server error occurred while fetching hotel data.');
      console.error("CLIENT ERROR [LandmarkClient]: Fetch operation failed:", err);
    } finally {
      setLoading(false);
    }
  }, [landmarkSlug, searchParams, currency, initialLandmarkName, initialCityName, initialCategory]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  return (
    <>
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
                {/* H1 Tag */}
                <h1 className="text-30 fw-600 text-white">
                  {`Discover Best ${category} Options Near ${landmarkName}, ${cityName}`} {/* Gunakan cityName dari state */}
                </h1>
                {/* Deskripsi Singkat di bawah H1 */}
                <p className="text-16 text-white mt-10">
                  {shortDescription}
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
            {error && <div>{`Error: ${error}`}</div>}
            {!loading && !error && hotels.length === 0 && <div>Hotel Not Found.</div>}
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
                            "addressRegion": null,
                            "addressCountry": null
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
                <HotelProperties2 hotels={hotels} cityName={cityName} /> {/* cityName di sini juga dari state */}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Bagian H2 dan LONG DESKRIPSI penuh setelah daftar hotel */}
      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="text-24 fw-600 mb-20">
                {`About Our ${category} Collection Near ${landmarkName}`} {/* H2 Tag baru */}
              </h2>
              {/* Render setiap segmen paragraf dengan sub-header */}
              {longDescriptionSegments.map((segment, index) => (
                <div key={index} className="mt-10">
                  {segment.subHeader && (
                    <h5 className="text-18 fw-500 mb-5">{segment.subHeader}</h5>
                  )}
                  <p className="text-15">{segment.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-lg layout-pb-lg">
        <div className="container">
          <div className="row justify-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Frequently Asked Questions</h2>
                  {`Answers to common questions about ${category} near ${landmarkName}.`}
              </div>
            </div>
          </div>
          <div className="row y-gap-30 pt-40 sm:pt-20">
            {/* Faqlandmark kini hanya menerima parameter yang relevan */}
            <Faqlandmark
              landmark={landmarkName}
              hotels={hotels}
              category={category}
              cityName={cityName} // Meneruskan cityName ke Faqlandmark
            />
          </div>
        </div>
      </section>

      <CallToActions />

      <Footer />
    </>
  );
}