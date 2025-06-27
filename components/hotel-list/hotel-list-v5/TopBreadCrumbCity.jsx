// TopBreadCrumbCity.jsx
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
const TopBreadCrumbCity = ({ hotel, categoryslug, countryslug, stateslug, cityslug, currentLang, dictionary }) => {
  if (!hotel && (!categoryslug || !countryslug || !stateslug || !cityslug)) {
    return <div>No breadcrumb data available.</div>;
  }

  const category = hotel?.category || categoryslug || "unknown";
  const country = hotel?.country || countryslug || "unknown";
  const state = hotel?.state || stateslug || "unknown";
  const city = hotel?.city || cityslug || "unknown";
  
  // Buat prefix bahasa. Jika currentLang adalah 'en' dan itu default, mungkin tidak perlu prefix.
  const langPrefix = currentLang ? `/${currentLang}` : ''; //

  // Mengambil teks "Home" dari kamus
  const homeText = dictionary?.navigation?.home || 'Home'; //

  return (
    <section className="py-10 d-flex items-center bg-white">
      <div className="container">
        <div className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="row x-gap-10 y-gap-5 items-center text-14 text-light-1">
              <div className="col-auto">
                {/* Gunakan langPrefix dan homeText dari kamus */}
                <Link href={`${langPrefix}`} className="text-blue-1">
                  {homeText}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                <Link href={`${langPrefix}/${category}`} className="text-blue-1">
                  {capitalizeFirstLetter(category)}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                <Link href={`${langPrefix}/${category}/${country}`} className="text-blue-1">
                  {capitalizeFirstLetter(country)}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                <Link href={`${langPrefix}/${category}/${country}/${state}`} className="text-blue-1">
                  {capitalizeFirstLetter(state)}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                {/* Ini adalah elemen teks akhir, tidak perlu Link */}
                {capitalizeFirstLetter(city)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBreadCrumbCity;