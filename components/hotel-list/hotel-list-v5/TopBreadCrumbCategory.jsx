// TopBreadCrumbCategory.jsx
import Link from "next/link";

const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const TopBreadCrumbCategory = ({ categoryslug, currentLang, dictionary }) => { // Menerima currentLang dan dictionary
  // Buat prefix bahasa. Jika currentLang adalah 'en' dan itu default, mungkin tidak perlu prefix.
  // Sesuaikan logika ini dengan konfigurasi i18n Anda jika Anda tidak ingin '/en' di URL.
  const langPrefix = currentLang && currentLang !== 'en' ? `/${currentLang}` : ''; // Asumsi 'en' adalah default tanpa prefix.

  // Pastikan dictionary.navigation.home ada sebelum digunakan
  const homeText = dictionary?.navigation?.home || 'Home'; // Fallback ke 'Home' jika tidak ada

  return (
    <section className="py-10 d-flex items-center bg-white">
      <div className="container">
        <div className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="row x-gap-10 y-gap-5 items-center text-14 text-light-1">
              <div className="col-auto">
                {/* Perbaikan di sini: Gunakan langPrefix untuk tautan Home */}
                <Link href={`${langPrefix}/`} className="text-blue-1">
                  {homeText} {/* Menggunakan teks "Home" dari kamus */}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                {/* Ini adalah elemen teks akhir, tidak perlu Link */}
                {capitalizeFirstLetter(categoryslug) || "Unknown Category"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBreadCrumbCategory;