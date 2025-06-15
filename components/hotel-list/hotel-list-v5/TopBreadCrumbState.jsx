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

const TopBreadCrumbState = ({ categoryslug, countryslug, stateslug, currentLang }) => { // Menerima currentLang
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
                <Link href={`/${currentLang}/${categoryslug}`} className="text-blue-1"> {/* Gunakan currentLang */}
                  {capitalizeFirstLetter(categoryslug) || "Unknown Category"}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                <Link href={`/${currentLang}/${categoryslug}/${countryslug}`} className="text-blue-1"> {/* Gunakan currentLang */}
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