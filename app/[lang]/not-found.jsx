// app/not-found.jsx
import Footer from "@/components/footer";
import CallToActions from "@/components/common/CallToActions";
import NotFound from "@/components/common/NotFound";
import { getdictionary } from '@/public/dictionaries/get-dictionary'; 

export const metadata = {
  title: "404 || Hotelazo",
  description: "Sorry, the page you're looking for doesn't exist.",
};

// Ubah NotFoundPage menjadi async function untuk memuat dictionary
const NotFoundPage = async ({ params }) => {
  // Ambil bahasa dari params, jika tidak ada, gunakan 'us' sebagai default
  // Meskipun not-found biasanya tidak memiliki params.lang langsung,
  // ini adalah praktik yang baik jika Next.js di masa mendatang menyediakannya
  // atau jika ada routing kompleks. Untuk saat ini, 'us' adalah fallback yang aman.
  const lang = params?.lang || 'us'; // Variabel yang dideklarasikan adalah 'lang'
  const dictionary = await getdictionary(lang);

  return (
    <>
      <div className="header-margin"></div>
      <NotFound />
      {/* Gunakan 'lang' sebagai pengganti 'currentLang' */}
      <CallToActions dictionary={dictionary} currentLang={lang} />
      <Footer dictionary={dictionary} currentLang={lang} />
    </>
  );
};

export default NotFoundPage;