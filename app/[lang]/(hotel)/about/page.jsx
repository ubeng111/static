// app/(others)/about/page.jsx
import { getdictionary } from '@/dictionaries/get-dictionary';
import Client from "./Client"; // Import Client normally again

// **TAMBAHKAN INI UNTUK ISR 1 TAHUN**
export const revalidate = 31536000; // 1 tahun dalam detik (60 * 60 * 24 * 365)

export const metadata = {
  title: "About - Hoteloza",
  description: "Hoteloza - Travel and Accommodation Management Application",
};

export default async function AboutPage({ params }) { // Make the component async and accept params
  // `params` sudah objek langsung di App Router, tidak perlu await params
  const lang = params?.lang || 'en'; // Default to 'en' if lang is not provided
  
  // Data dari getdictionary akan di-cache sesuai `revalidate` yang diekspor di atas.
  const dictionary = await getdictionary(lang); // Fetch the dictionary on the server

  return <Client dictionary={dictionary} currentLang={lang} />; // Pass the dictionary to the Client component
}