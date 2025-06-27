// TopBreadCrumb88.jsx
import Link from "next/link";

const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  // Mengubah "contoh-slug" menjadi "Contoh Slug"
  return str
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Tambahkan 'dictionary' ke dalam props
const TopBreadCrumb88 = ({ hotel, currentLang, dictionary }) => {
  if (!hotel) {
    return <div>No hotel data available.</div>;
  }

  const categorySlug = hotel?.categoryslug || "unknown";
  const countrySlug = hotel?.countryslug || "unknown";
  const stateSlug = hotel?.stateslug || "unknown";
  const citySlug = hotel?.cityslug || "unknown";

  // Buat prefix bahasa.
  const langPrefix = currentLang ? `/${currentLang}` : '';

  // Mengambil teks "Home" dari kamus, dengan fallback.
  const homeText = dictionary?.navigation?.home || 'Home';

  return (
    <section className="py-10 d-flex items-center bg-white">
      <div className="container">
        <div className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <nav aria-label="breadcrumb">
              <div className="row x-gap-10 y-gap-5 items-center text-14 text-light-1">
                <div className="col-auto">
                  {/* Gunakan langPrefix dan homeText dari kamus */}
                  <Link href={`${langPrefix}`} className="text-blue-1">
                    {homeText}
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>
                <div className="col-auto">
                  {/* Gunakan langPrefix untuk tautan kategori */}
                  <Link href={`${langPrefix}/${categorySlug}`} className="text-blue-1">
                    {capitalizeFirstLetter(hotel?.category) || "Unknown Category"}
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>
                <div className="col-auto">
                  {/* Gunakan langPrefix untuk tautan negara */}
                  <Link href={`${langPrefix}/${categorySlug}/${countrySlug}`} className="text-blue-1">
                    {capitalizeFirstLetter(hotel?.country) || "Unknown Country"}
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>
                <div className="col-auto">
                  {/* Gunakan langPrefix untuk tautan provinsi */}
                  <Link href={`${langPrefix}/${categorySlug}/${countrySlug}/${stateSlug}`} className="text-blue-1">
                    {capitalizeFirstLetter(hotel?.state) || "Unknown State"}
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>
                <div className="col-auto">
                  {/* Gunakan langPrefix untuk tautan kota */}
                  {/* Perhatikan bahwa baseUrl tidak lagi diperlukan karena kita membangun path secara inline */}
                  <Link href={`${langPrefix}/${categorySlug}/${countrySlug}/${stateSlug}/${citySlug}`} className="text-blue-1">
                    {capitalizeFirstLetter(hotel?.city) || "Unknown City"}
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>
                <div className="col-auto">
                  {/* Ini adalah elemen teks akhir, tidak perlu Link */}
                  {capitalizeFirstLetter(hotel?.title) || "Untitled Hotel"}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBreadCrumb88;