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

const TopBreadCrumbCity = ({ hotel, categoryslug, countryslug, stateslug, cityslug, currentLang }) => { // Menerima currentLang
  if (!hotel && (!categoryslug || !countryslug || !stateslug || !cityslug)) {
    return <div>No breadcrumb data available.</div>;
  }

  const category = hotel?.category || categoryslug || "unknown";
  const country = hotel?.country || countryslug || "unknown";
  const state = hotel?.state || stateslug || "unknown";
  const city = hotel?.city || cityslug || "unknown";
  const baseUrl = `/${currentLang}/${category}/${country}/${state}/${city}`; // Gunakan currentLang

  return (
    <section className="py-10 d-flex items-center bg-white">
      <div className="container">
        <div className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="row x-gap-10 y-gap-5 items-center text-14 text-light-1">
              <div className="col-auto">
                <Link href={`/${currentLang}`} className="text-blue-1"> {/* Gunakan currentLang */}
                  Home
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                <Link href={`/${currentLang}/${category}`} className="text-blue-1"> {/* Gunakan currentLang */}
                  {capitalizeFirstLetter(category)}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                <Link href={`/${currentLang}/${category}/${country}`} className="text-blue-1"> {/* Gunakan currentLang */}
                  {capitalizeFirstLetter(country)}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                <Link href={`/${currentLang}/${category}/${country}/${state}`} className="text-blue-1"> {/* Gunakan currentLang */}
                  {capitalizeFirstLetter(state)}
                </Link>
              </div>
              <div className="col-auto">&gt;</div> {/* Tambahkan pemisah jika ada elemen berikutnya */}
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