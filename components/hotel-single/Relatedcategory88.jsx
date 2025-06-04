import React from "react";

const createSlug = (country) => {
  return country
    ? country.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    : 'unknown-country';
};

const Relatedcategory88 = React.memo(({ relatedcategory, categoryslug }) => {
  const formattedCategory = categoryslug
    ? categoryslug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : 'Unknown Category';

  return (
    <div className="container">
      <h2 className="text-center fw-bold mb-3 text-dark">
        🏨 Countries in {formattedCategory}
      </h2>

      <div className="row g-2">
        {relatedcategory?.map((countryData, index) => {
          const countrySlug = countryData.countryslug || createSlug(countryData.country);
          const capitalizedCountry = countryData.country
            ? countryData.country.charAt(0).toUpperCase() + countryData.country.slice(1)
            : 'Unknown Country';

          return (
            <div key={`${countryData.country}-${index}`} className="col-6 col-md-4 col-lg-3">
              <div className="p-2 border rounded bg-white shadow-sm transition-all hover:shadow-md hover:bg-light">
                <a
                  href={`/${categoryslug}/${countrySlug}`}
                  className="fw-medium text-dark d-block text-start text-decoration-none"
                  style={{ fontSize: '14px' }}
                >
                  {`${formattedCategory} In ${capitalizedCountry}`}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Relatedcategory88;