import React from "react";
import Link from "next/link"; // Pastikan Link diimpor

const createSlug = (city) => {
  return city
    ? city.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    : 'unknown-city';
};

const Relatedcity88 = React.memo(({ relatedcity, stateslug, countryslug, categoryslug, dictionary, currentLang }) => {
  const relatedCitiesDict = dictionary?.relatedCities || {};
  const statePageDict = dictionary?.statePage || {};
  const categoryPageDict = dictionary?.categoryPage || {};
  const commonDict = dictionary?.common || {};

  const formattedState = stateslug
    ? stateslug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : statePageDict.stateDefault || 'Unknown State';

  const formattedCategory = categoryslug
    ? categoryslug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : categoryPageDict.categoryDefault || 'Unknown Category';

  if (!Array.isArray(relatedcity) || relatedcity.length === 0) {
    return (
      <div className="container">
        <h2 className="text-center fw-bold mb-3 text-dark">
          {relatedCitiesDict.noRelatedCitiesFound || 'No Related Cities Found'}
        </h2>
      </div>
    );
  }

  const uniqueCities = Array.from(
    new Map(relatedcity.map((city) => [city.cityslug, city])).values()
  );

  const displayedCities = uniqueCities.slice(0, 40);

  return (
    <div className="container">
      <h2 className="text-center fw-bold mb-3 text-dark">
        {relatedCitiesDict.bestRelatedCitiesIn?.replace('{formattedState}', formattedState) || `🏨 Best Related Cities in ${formattedState}`}
      </h2>
      <div className="row g-2">
        {displayedCities.map((city, index) => {
          const citySlug = city.cityslug || createSlug(city.city);
          const capitalizedCity = city.city
            ? city.city.charAt(0).toUpperCase() + city.city.slice(1)
            : commonDict.unknownCity || 'Unknown City';

          return (
            <div key={`${city.cityslug}-${index}`} className="col-6 col-md-4 col-lg-3">
              <div className="p-2 border rounded bg-white shadow-sm transition-all hover:shadow-md hover:bg-light">
                <Link
                  href={`/${currentLang}/${categoryslug}/${countryslug}/${stateslug}/${citySlug}`} // Gunakan currentLang
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

export default Relatedcity88;