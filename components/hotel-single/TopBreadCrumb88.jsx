// TopBreadCrumb88.jsx
import Link from "next/link";

const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const TopBreadCrumb88 = ({ hotel, currentLang }) => { // Menerima currentLang
  if (!hotel) {
    return <div>No hotel data available.</div>;
  }

  const categorySlug = hotel?.categoryslug || "unknown";
  const countrySlug = hotel?.countryslug || "unknown";
  const stateSlug = hotel?.stateslug || "unknown";
  const citySlug = hotel?.cityslug || "unknown";
  const baseUrl = `/${currentLang}/${categorySlug}/${countrySlug}/${stateSlug}/${citySlug}`; // Gunakan currentLang

  return (
    <section className="py-10 d-flex items-center bg-white">
      <div className="container">
        <div className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <nav aria-label="breadcrumb">
              <div className="row x-gap-10 y-gap-5 items-center text-14 text-light-1">
                <div className="col-auto">
                  <Link href={`/${currentLang}`} className="text-blue-1"> {/* Gunakan currentLang */}
                    Home
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>
                <div className="col-auto">
                  <Link href={`/${currentLang}/${categorySlug}`} className="text-blue-1"> {/* Gunakan currentLang */}
                    {capitalizeFirstLetter(hotel?.category) || "Unknown Category"}
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>
                <div className="col-auto">
                  <Link href={`/${currentLang}/${categorySlug}/${countrySlug}`} className="text-blue-1"> {/* Gunakan currentLang */}
                    {capitalizeFirstLetter(hotel?.country) || "Unknown Country"}
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>
                <div className="col-auto">
                  <Link href={`/${currentLang}/${categorySlug}/${countrySlug}/${stateSlug}`} className="text-blue-1"> {/* Gunakan currentLang */}
                    {capitalizeFirstLetter(hotel?.state) || "Unknown State"}
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>
                <div className="col-auto">
                  <Link href={baseUrl} className="text-blue-1"> {/* baseUrl sudah mengandung currentLang */}
                    {capitalizeFirstLetter(hotel?.city) || "Unknown City"}
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>
                <div className="col-auto">
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