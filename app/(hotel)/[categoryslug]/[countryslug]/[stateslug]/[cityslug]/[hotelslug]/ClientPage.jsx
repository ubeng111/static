'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import BookNow from '@/components/hotel-single/BookNow';

const ClientPageContent = dynamic(() => import('@/components/hotel-single/ClientPageContent'), {
  ssr: false,
});

const formatSlug = (slug) =>
  slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '';

export default function ClientPage({
  categoryslug,
  countryslug,
  stateslug,
  cityslug,
  hotelslug,
  hotel = {},
  relatedHotels = [],
}) {
  const formattedHotel = useMemo(() => formatSlug(hotelslug), [hotelslug]);

  // Show loading state if hotel data is empty
  if (!hotel || Object.keys(hotel).length === 0) {
    return (
      <div className="preloader">
        <div className="preloader__wrap">
          <div className="preloader__icon"></div>
        </div>
        <div className="preloader__title">Hoteloza...</div>
      </div>
    );
  }

  return (
    <>
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