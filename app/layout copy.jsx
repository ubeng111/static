"use client";

import Aos from "aos";
import { useEffect } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import ScrollTop from "../components/common/ScrollTop";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
import "aos/dist/aos.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/index.scss";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { CurrencyProvider } from "../components/CurrencyContext"; // Corrected path

// Muat bootstrap.bundle.min.js untuk mendukung dropdown
if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap.bundle.min.js");
}

export default function RootLayout({ children }) {
  useEffect(() => {
    Aos.init({
      duration: 1200,
      once: true,
    });
  }, []);

  return (
    <html lang="en">
      <head>
        {/* Menambahkan favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        {/* Google Site Verification Meta Tag */}
        <meta
          name="google-site-verification"
          content="2CUKI9cYViNxYurFPrRO39L2Qg9DHlUUu6mJssjkuVg"
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
