// app/[lang]/(others)/contact/page.jsx
import { getdictionary } from '@/public/dictionaries/get-dictionary';
import Client from "./Client"; // Import Client Component

export const metadata = {
  title: "Contact - Hoteloza",
  description: "Get in touch with Hoteloza for inquiries and support.",
};

export default async function ContactPage({ params }) {
  const lang = params?.lang || 'en'; // Dapatkan locale dari URL
  const dictionary = await getdictionary(lang); // Muat kamus di sisi server

  // --- DEBUGGING SERVER SIDE (akan muncul di terminal Anda) ---
  console.log("SERVER: Dictionary loaded for contact page:", dictionary);
  console.log("SERVER: contactPageDict section:", dictionary?.contactPage);
  console.log("SERVER: navigationDict section:", dictionary?.navigation);
  console.log("SERVER: footerDict section:", dictionary?.footer);
  // --- END DEBUGGING ---

  return <Client dictionary={dictionary} />; // Teruskan dictionary lengkap ke Client Component
}