import React from "react";
import Link from "next/link"; // Pastikan Link diimpor

const createSlug = (city) => {
  return city
    ? city.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    : 'unknown-city';
};

const Relatedstate88 = React.memo(({ relatedstate, stateslug, countryslug, categoryslug, dictionary, currentLang }) => { // Menerima categoryslug
  const relatedCitiesDict = dictionary?.relatedCities || {};
  const statePageDict = dictionary?.statePage || {};
  const categoryPageDict = dictionary?.categoryPage || {};
  const commonDict = dictionary?.common || {};

  const formattedState = stateslug
    ? stateslug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : statePageDict.stateDefault || 'Unknown State';

  const formattedCategory = categoryslug // Pastikan categoryslug ada dan digunakan
    ? categoryslug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : categoryPageDict.categoryDefault || 'Unknown Category';

  if (!Array.isArray(relatedstate) || relatedstate.length === 0) {
    return (
      <div className="container">
        <h2 className="text-center fw-bold mb-3 text-dark">
          {relatedCitiesDict.noRelatedCitiesFound || 'No Related Cities Found'}
        </h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="text-center fw-bold mb-3 text-dark">
        {relatedCitiesDict.citiesIn?.replace('{formattedState}', formattedState) || `🏨 Cities in ${formattedState}`}
      </h2>
      
      <div className="row g-2">
        {relatedstate.map((cityData, index) => {
          const citySlug = cityData.cityslug || createSlug(cityData.city);
          const capitalizedCity = cityData.city
            ? cityData.city.charAt(0).toUpperCase() + cityData.city.slice(1)
            : commonDict.unknownCity || 'Unknown City';

          return (
            <div key={`${cityData.cityslug}-${index}`} className="col-6 col-md-4 col-lg-3">
              <div className="p-2 border rounded bg-white shadow-sm transition-all hover:shadow-md hover:bg-light">
                {/* PASTIKAN categoryslug DIGUNAKAN DI SINI UNTUK MEMBANGUN LINK CITY */}
                <Link
                  href={`/${currentLang}/${categoryslug}/${countryslug}/${stateslug}/${citySlug}`} // Menggunakan categoryslug
                  className="fw-medium text-dark d-block text-start text-decoration-none"
                  style={{ fontSize: '14px' }}
                >
                  {`${formattedCategory} In ${capitalizedCity}`}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Relatedstate88;