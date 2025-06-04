// app/layout.jsx
"use client";

import Aos from "aos";
import { useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/index.scss";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { CurrencyProvider } from "../components/CurrencyContext";
import ScrollTop from "../components/common/ScrollTop";

// Muat hanya komponen Bootstrap yang diperlukan
if (typeof window !== "undefined") {
  require("bootstrap/js/dist/dropdown"); // Hanya muat dropdown
}

export default function RootLayout({ children, hotels }) {
  useEffect(() => {
    Aos.init({
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Your Site Title</title>
        {/* Preload gambar LCP jika tersedia */}
        {hotels?.[0]?.img && (
          <link
            rel="preload"
            href={hotels[0].img}
            as="image"
            fetchPriority="high"
          />
        )}
        {/* CSS asinkronus untuk mengurangi render-blocking */}
        <link
          rel="stylesheet"
          href="/path/to/bootstrap.min.css"
          media="print"
          onLoad="this.media='all'"
        />
      </head>
      <body>
        <Provider store={store}>
          <CurrencyProvider>
            {children}
            <ScrollTop />
          </CurrencyProvider>
        </Provider>
      </body>
    </html>
  );
}