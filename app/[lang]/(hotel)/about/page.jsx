// app/(others)/about/page.jsx
import { getdictionary } from '@/public/dictionaries/get-dictionary';
import Client from "./Client"; // Import Client normally again

export const metadata = {
  title: "About - Hoteloza",
  description: "Hoteloza - Travel and Accommodation Management Application",
};

export default async function AboutPage({ params }) { // Make the component async and accept params
  // Assuming your route is set up like /af/about, the locale will be in params.lang
  const lang = await params?.lang || 'en'; // Default to 'en' if lang is not provided
  const dictionary = await getdictionary(lang); // Fetch the dictionary on the server

  return <Client dictionary={dictionary} />; // Pass the dictionary to the Client component
}