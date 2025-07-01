import Wrapper from "@/components/layout/Wrapper";
import MainHome from "../app/(homes)/home_1/page";

export const metadata = {
  title: "Find the Best Hotels & Deals | Hoteloza ",
  description:
    "Discover unbeatable hotel deals, compare prices, and book easily with Hoteloza – your trusted travel affiliate partner.",
  keywords: [
    "hotel deals",
    "travel affiliate",
    "cheap hotels",
    "best hotel booking site",
    "Hoteloza",
    "compare hotel prices",
    "book hotels online",
  ],
  openGraph: {
    title: "Find the Best Hotels & Deals | Hoteloza",
    description:
      "Easily compare and book top-rated hotels worldwide. Powered by Hoteloza – trusted by thousands of travelers.",
    url: "https://hoteloza.com",
    siteName: "Hoteloza",
    images: [
      {
        url: "https://hoteloza.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hoteloza Hotel Booking Deals",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find the Best Hotels & Deals | Hoteloza",
    description:
      "Book your next stay with Hoteloza – the easiest way to find the best hotel deals online.",
    images: ["https://hoteloza.com/og-image.jpg"],
  },
  // Tambahkan tag canonical di sini
  alternates: {
    canonical: "https://hoteloza.com", // Ganti dengan URL halaman ini
  },
};

export default function Home() {
  return (
    <>
      <Wrapper>
        <MainHome />
      </Wrapper>
    </>
  );
}