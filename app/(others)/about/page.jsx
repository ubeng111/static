// app/(others)/about/page.jsx
import Client from "./Client"; // Import Client normally again

export const metadata = {
  title: "About - Hoteloza",
  description: "Hoteloza - Travel and Accommodation Management Application",
  // Tambahkan tag canonical di sini
  alternates: {
    canonical: "https://hoteloza.com/about", // Ganti dengan URL halaman ini
  },
};

export default Client;