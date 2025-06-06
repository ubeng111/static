import React from "react";

const createSlug = (city) => {
  return city
    ? city.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    : 'unknown-city';
};

const Relatedstate88 = React.memo(({ relatedstate, stateslug, countryslug, categoryslug }) => {
  const formattedState = stateslug
    ? stateslug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Unknown State';

  const formattedCategory = categoryslug
    ? categoryslug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Unknown Category';

  if (!Array.isArray(relatedstate) || relatedstate.length === 0) {
    return (
      <div className="container">
        <h2 className="text-center fw-bold mb-3 text-dark">
          No Related Cities Found
        </h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="text-center fw-bold mb-3 text-dark">
        🏨 Cities in {formattedState}
      </h2>
      
      <div className="row g-2">
        {relatedstate.map((cityData, index) => {
          const citySlug = cityData.cityslug || createSlug(cityData.city);
          const capitalizedCity = cityData.city
            ? cityData.city.charAt(0).toUpperCase() + cityData.city.slice(1)
            : 'Unknown City';

          return (
            <div key={`${cityData.city}-${index}`} className="col-6 col-md-4 col-lg-3">
              <div className="p-2 border rounded bg-white shadow-sm transition-all hover:shadow-md hover:bg-light">
                <a
                  href={`/city/${citySlug}`}
                  className="fw-medium text-dark d-block text-start text-decoration-none"
                  style={{ fontSize: '14px' }}
                >
                  {` ${capitalizedCity}`}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Relatedstate88;