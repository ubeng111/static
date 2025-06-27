
import ClientProviders from "@/components/ClientProviders";

// Import CSS Anda
import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
import "aos/dist/aos.css";
import "@/styles/index.scss";

// 1. Tambahkan fungsi generateMetadata di sini
export const metadata = {
  // metadataBase digunakan untuk URL Open Graph (og:image)
  metadataBase: new URL('https://hoteloza.com'), 
  
  // Title akan berfungsi sebagai template. 
  // Jika halaman anak punya title "Tentang Kami", hasilnya akan menjadi "Tentang Kami | Hoteloza"
  title: {
    template: '%s | Hoteloza',
    default: 'Hoteloza - Pesan Hotel Mudah, Cepat, dan Terpercaya', // Title default jika tidak ada di halaman anak
  },
  
  // Deskripsi default untuk seluruh situs
  description: 'Temukan dan pesan hotel terbaik di seluruh dunia dengan harga terjangkau. Hoteloza menawarkan ribuan pilihan akomodasi untuk perjalanan Anda.',
  
  // Aturan default untuk robot pencari
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  
  verification: {
    google: '2CUKI9cYViNxYurFPrRO39L2Qg9DHlUUu6mJsskuVg',
  },
};


// 2. Sederhanakan komponen RootLayout Anda
export default function RootLayout({ children }) {
  // Tidak perlu lagi membaca headers di sini untuk locale
  return (
    // Next.js akan menangani lang attribute dari layout anak
    <html> 
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="any" />
      </head>
      <body>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}