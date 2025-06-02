// app/layout.jsx
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
import { CurrencyProvider } from "../components/CurrencyContext";

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
        {/* Meta tag Content-Type */}
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        {/* Google Site Verification Meta Tag */}
        <meta name="google-site-verification" content="r6fR48wCY8bPAJatfyVhTJmF5ctC1lSg2Y3z0B4LMrg" />
        {/* Verifikasi untuk mesin pencari lain, misalnya Yandex atau Bing */}
        <meta name="yandex-verification" content="48cd7acca9df9841" /> {/* Ubah ke 'msvalidate.01' untuk Bing jika perlu */}
      </head>
      <body>
        <Provider store={store}>
          <CurrencyProvider>
            {children}
            <ScrollTop />
            {/* Teks verifikasi disembunyikan agar tidak terlihat oleh pengguna */}
            <div style={{ display: "none" }}>Verification: 48cd7acca9df9841</div>
          </CurrencyProvider>
        </Provider>
      </body>
    </html>
  );
}