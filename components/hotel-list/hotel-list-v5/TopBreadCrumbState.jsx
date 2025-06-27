// TopBreadCrumbState.jsx
import Link from "next/link";

const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const TopBreadCrumbState = ({ categoryslug, countryslug, stateslug, currentLang, dictionary }) => { // Menerima currentLang dan dictionary
  // Buat prefix bahasa. Jika currentLang adalah 'en' dan itu default, mungkin tidak perlu prefix.
  // Sesuaikan logika ini dengan konfigurasi i18n Anda jika Anda tidak ingin '/en' di URL.
  // Berdasarkan middleware.js, defaultLocale tidak akan memiliki prefix jika tidak ada slug di path.
  // Jadi, jika currentLang sama dengan defaultLocale, kita mungkin tidak perlu prefix.
  // Untuk saat ini, kita akan selalu menambahkan prefix jika currentLang ada.
  const langPrefix = currentLang ? `/${currentLang}` : '';

  // Mengambil teks "Home" dari kamus
  const homeText = dictionary?.navigation?.home || 'Home'; // Fallback ke 'Home' jika tidak ada

  return (
    <section className="py-10 d-flex items-center bg-white">
      <div className="container">
        <div className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="row x-gap-10 y-gap-5 items-center text-14 text-light-1">
              <div className="col-auto">
                <Link href={`${langPrefix}`} className="text-blue-1"> {/* Gunakan langPrefix untuk Home */}
                  {homeText} {/* Menggunakan teks "Home" dari kamus */}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                <Link href={`${langPrefix}/${categoryslug}`} className="text-blue-1"> {/* Gunakan langPrefix */}
                  {capitalizeFirstLetter(categoryslug) || "Unknown Category"}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                <Link href={`${langPrefix}/${categoryslug}/${countryslug}`} className="text-blue-1"> {/* Gunakan langPrefix */}
                  {capitalizeFirstLetter(countryslug) || "Unknown Country"}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                {/* Ini adalah elemen teks akhir, tidak perlu Link */}
                {capitalizeFirstLetter(stateslug) || "Unknown State"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBreadCrumbState;