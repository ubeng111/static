// components/ClientProviders.jsx
'use client';

import { Provider } from "react-redux";
import { store } from "@/store/store";
import { CurrencyProvider } from "@/components/CurrencyContext";
import { LanguageProvider } from "@/components/header/LanguageContext";
import { usePathname } from 'next/navigation';


import { useState, useEffect } from 'react';
import Aos from "aos";
if (typeof window !== "undefined") {
  require("bootstrap/dist/js/bootstrap.bundle.min.js");
}

export default function ClientProviders({ children, dictionary, initialLangSlug }) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const lang = pathSegments[0] || initialLangSlug || 'us';

  useEffect(() => {
    Aos.init({
      duration: 1200,
      once: true,
    });
  }, []);

  // const headerHeight = '90px'; // <<< SESUAIKAN NILAI INI DENGAN TINGGI HEADER ANDA // HAPUS BARIS INI JIKA TIDAK DIGUNAKAN

  return (
    <Provider store={store}>
      <LanguageProvider initialLang={lang}>
        <CurrencyProvider initialLang={lang}>

          {/* HAPUS padding-top pada div ini */}
          <div /* style={{ paddingTop: headerHeight }} */> 
            {children}
          </div>

        </CurrencyProvider>
      </LanguageProvider>
    </Provider>
  );
}