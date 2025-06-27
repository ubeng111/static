// TopBreadCrumbCountry.jsx
import Link from "next/link";

const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Tambahkan 'dictionary' ke dalam props
const TopBreadCrumbCountry = ({ categoryslug, countryslug, currentLang, dictionary }) => {
  // Buat prefix bahasa.
  const langPrefix = currentLang ? `/${currentLang}` : '';

  // Mengambil teks "Home" dari kamus, dengan fallback.
  const homeText = dictionary?.navigation?.home || 'Home';

  return (
    <section className="py-10 d-flex items-center bg-white">
      <div className="container">
        <div className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="row x-gap-10 y-gap-5 items-center text-14 text-light-1">
              <div className="col-auto">
                {/* Gunakan langPrefix dan homeText dari kamus*/}
                <Link href={`${langPrefix}`} className="text-blue-1">
                  {homeText}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                {/* Gunakan langPrefix untuk tautan kategori */}
                <Link href={`${langPrefix}/${categoryslug}`} className="text-blue-1">
                  {capitalizeFirstLetter(categoryslug) || "Unknown Category"}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                {/* Ini adalah elemen teks akhir, tidak perlu Link */}
                {capitalizeFirstLetter(countryslug) || "Unknown Country"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBreadCrumbCountry;