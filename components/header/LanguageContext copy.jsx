// components/header/LanguageContext.jsx
'use client';
import { createContext, useContext, useMemo, useCallback } from 'react'; // Pastikan useCallback diimpor

const LanguageContext = createContext(null);

export function LanguageProvider({ children, initialLang }) {
  // Langsung gunakan initialLang sebagai nilai bahasa
  const currentLanguage = initialLang; // Ini akan menjadi nilai bahasa yang diberikan ke consumer

  // Gunakan useMemo untuk memastikan nilai 'language' yang diberikan ke consumer stabil.
  // Karena 'language' adalah string primitif, useMemo tidak terlalu krusial di sini
  // untuk masalah referensi objek, tetapi ini adalah praktik yang baik jika 'language'
  // adalah bagian dari objek yang lebih besar.
  const language = useMemo(() => currentLanguage, [currentLanguage]);

  // Jika Anda perlu fungsi untuk mengubah bahasa dari komponen anak,
  // Anda harus mengimplementasikan useState di Provider lagi, TAPI dengan sangat hati-hati.
  const setLanguageValue = useCallback((newLang) => {
    console.warn("setLanguage is called in LanguageProvider, but it doesn't update state directly here. Consider if you need internal state management in this provider.");
    // Jika Anda ingin mengubah language dari child, Anda perlu useState di sini
    // Contoh: setInternalLanguageState(newLang);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguageValue }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}