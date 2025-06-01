// page.jsx
import { Suspense } from "react";
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import CallToActions from "@/components/common/CallToActions";
import MainFilterSearchBox from "@/components/hotel-list/common/MainFilterSearchBox";
import SearchResultContent from "./SearchResultContent";

export default function SearchPage({ hotels, cityName, error }) {
  return (
    <>
      <div className="header-margin"></div>
      <Header11 />
      <section className="layout-pt-sm">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <MainFilterSearchBox />
            </div>
          </div>
        </div>
      </section>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResultContent hotels={hotels} cityName={cityName} error={error} />
      </Suspense>
      <CallToActions />
      <DefaultFooter />
    </>
  );
}

export async function getServerSideProps(context) {
  const { query } = context;
  const city_id = query.city_id;
  const checkInDate = query.checkIn;
  const checkOutDate = query.checkOut;
  const adults = parseInt(query.adults || "2", 10);
  const children = parseInt(query.children || "0", 10);
  const rooms = parseInt(query.rooms || "1", 10);
  const city = query.city || "Location not found";
  const currency = query.currency || "USD"; // Default mata uang
  const language = query.language || "en"; // Default bahasa

  if (!city_id || !checkInDate || !checkOutDate) {
    return {
      props: {
        hotels: [],
        cityName: city,
        error: "Parameter pencarian tidak lengkap",
      },
    };
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agoda-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city_id,
        checkInDate,
        checkOutDate,
        numberOfAdults: adults,
        numberOfChildren: children,
        numberOfRooms: rooms,
        currency,
        language,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      return {
        props: {
          hotels: data.hotels || [],
          cityName: data.cityName || city,
          error: null,
        },
      };
    } else {
      return {
        props: {
          hotels: [],
          cityName: city,
          error: data.message || "Gagal mengambil data, silakan coba lagi",
        },
      };
    }
  } catch (err) {
    return {
      props: {
        hotels: [],
        cityName: city,
        error: "Kesalahan server",
      },
    };
  }
}