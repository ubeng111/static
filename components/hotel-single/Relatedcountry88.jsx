import React from "react";
import Link from "next/link"; // Pastikan Link diimpor

const createSlug = (state) => {
  return state
    ? state.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    : 'unknown-state';
};

const Relatedcountry88 = React.memo(({ relatedcountry, countryslug, categoryslug, dictionary, currentLang }) => {
  console.log('Relatedcountry88: Received props - relatedcountry:', relatedcountry, 'categoryslug:', categoryslug, 'countryslug:', countryslug, 'currentLang:', currentLang);

  const relatedCountriesDict = dictionary?.relatedCountries || {};
  const countryPageDict = dictionary?.countryPage || {};
  const categoryPageDict = dictionary?.categoryPage || {};
  const commonDict = dictionary?.common || {};

  const formattedCountry = countryslug
    ? countryslug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : countryPageDict.countryDefault || 'Unknown Country';

  const formattedCategory = categoryslug
    ? categoryslug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : categoryPageDict.categoryDefault || 'Unknown Category';

  if (!Array.isArray(relatedcountry) || relatedcountry.length === 0) {
    console.log('Relatedcountry88: relatedcountry is empty or not an array. Displaying "No Related States Found".');
    return (
      <div className="container">
        <h2 className="text-center fw-bold mb-3 text-dark">
          {relatedCountriesDict.noRelatedStatesFound || 'No Related States Found'}
        </h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="text-center fw-bold mb-3 text-dark">
        {relatedCountriesDict.statesIn?.replace('{formattedCountry}', formattedCountry) || `🏨 States in ${formattedCountry}`}
      </h2>

      <div className="row g-2">
        {relatedcountry.map((stateData, index) => {
          const stateSlug = stateData.stateslug || createSlug(stateData.state);
          const capitalizedState = stateData.state
            ? stateData.state.charAt(0).toUpperCase() + stateData.state.slice(1)
            : commonDict.unknownState || 'Unknown State';

          // Debugging the generated URL
          const generatedHref = `/${currentLang}/${categoryslug}/${countryslug}/${stateSlug}`;
          console.log(`Relatedcountry88: Generating link for ${capitalizedState}. Href: ${generatedHref}`);

          return (
            <div key={`${stateData.state}-${index}`} className="col-6 col-md-4 col-lg-3">
              <div className="p-2 border rounded bg-white shadow-sm transition-all hover:shadow-md hover:bg-light">
                <Link
                  href={generatedHref}
                  className="fw-medium text-dark d-block text-start text-decoration-none"
                  style={{ fontSize: '14px' }}
                >
                  {`${formattedCategory} In ${capitalizedState}`}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Relatedcountry88;