'use client';

import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import useSWR from 'swr';
import BookNow from '@/components/hotel-single/BookNow';

// Dynamically import components
const ClientPageContent = dynamic(() => import('@/components/hotel-single/ClientPageContent'), { ssr: false });

export default function ClientPage({ categoryslug, countryslug, stateslug, cityslug, hotelslug }) {
  const searchParams = useSearchParams();

  // Memoize the fetcher function
  const fetcher = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch hotel data');
    return response.json();
  }, []);

  // Use SWR for data fetching
  const { data, error, isLoading } = useSWR(
    `/api/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
    fetcher,
    {
      revalidateOnFocus: false,
      keepPreviousData: true,
      dedupingInterval: 60000, // Cache for 1 minute
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (retryCount >= 3) return;
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

  // Memoize derived data
  const hotel = useMemo(() => data?.hotel || { title: formatSlug(hotelslug) }, [data, hotelslug]);
  const relatedHotels = useMemo(() => data?.relatedHotels || [], [data]);
  const schema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': ['Hotel', 'LocalBusiness'],
      name: hotel.title,
      description: `Book ${hotel.title}, a luxury hotel in ${formatSlug(cityslug)} for ${new Date().getFullYear()} on Hoteloza.`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: hotel.city,
        addressRegion: hotel.state,
        addressCountry: hotel.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: hotel.latitude,
        longitude: hotel.longitude,
      },
      image: hotel.img || 'https://hoteloza.com/default-hotel-image.jpg',
      numberOfRooms: hotel.numberrooms,
      telephone: hotel.telephone || '',
      email: hotel.email || '',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: hotel.ratings || 0,
        reviewCount: hotel.numberOfReviews || 0,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://hoteloza.com' },
          {
            '@type': 'ListItem',
            position: 2,
            name: hotel.category || 'Hotels',
            item: `https://hoteloza.com/${categoryslug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: hotel.country,
            item: `https://hoteloza.com/${categoryslug}/${countryslug}`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: hotel.state,
            item: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}`,
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: hotel.city,
            item: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}`,
          },
          {
            '@type': 'ListItem',
            position: 6,
            name: hotel.title,
            item: `https://hoteloza.com/${categoryslug}/${countryslug}/${stateslug}/${cityslug}/${hotelslug}`,
          },
        ],
      },
    }),
    [hotel, categoryslug, countryslug, stateslug, cityslug, hotelslug]
  );

  if (isLoading) {
    return (
      <div className="preloader">
        <div className="preloader__wrap">
          <div className="preloader__icon"></div>
        </div>
        <div className="preloader__title">Hoteloza...</div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading hotel data. Please try again later.</div>;
  }

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <BookNow hotel={hotel} hotelId={hotel?.id} />
      <ClientPageContent
        hotel={hotel}
        relatedHotels={relatedHotels}
        useHotels2={true}
        hotelslug={hotelslug}
        categoryslug={categoryslug}
        countryslug={countryslug}
        stateslug={stateslug}
        cityslug={cityslug}
      />
    </>
  );
}

// Helper function to format slugs
const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';