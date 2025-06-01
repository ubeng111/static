import React from "react";

const createSlug = (state) => {
  return state
    ? state.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    : 'unknown-state';
};

const Relatedcountry88 = React.memo(({ relatedcountry, countryslug, categoryslug }) => { // <--- React.memo applied here
  const formattedCountry = countryslug
    ? countryslug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Unknown Country';

  const formattedCategory = categoryslug
    ? categoryslug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Unknown Category';

  if (!Array.isArray(relatedcountry) || relatedcountry.length === 0) {
    return (
      <div className="container">
        <h2 className="text-center fw-bold mb-3 text-dark">
          No Related States Found
        </h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="text-center fw-bold mb-3 text-dark">
        🏨 States in {formattedCountry}
      </h2>
      
      <div className="row g-2">
        {relatedcountry.map((stateData, index) => {
          const stateSlug = stateData.stateslug || createSlug(stateData.state);
          const capitalizedState = stateData.state
            ? stateData.state.charAt(0).toUpperCase() + stateData.state.slice(1)
            : 'Unknown State';

          return (
            <div key={`${stateData.state}-${index}`} className="col-6 col-md-4 col-lg-3">
              <div className="p-2 border rounded bg-white shadow-sm transition-all hover:shadow-md hover:bg-light">
                <a
                  href={`/${categoryslug}/${countryslug}/${stateSlug}`}
                  className="fs-6 fw-medium text-dark d-block text-start text-decoration-none"
                >
                  {`${formattedCategory} In ${capitalizedState}`}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Relatedcountry88;