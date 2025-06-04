import React from "react";

const createSlug = (city) => {
  return city
    ? city.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
    : "unknown-city";
};

const Relatedcity88 = React.memo(({ relatedcity, stateslug, countryslug, categoryslug }) => {
  const formattedState = stateslug
    ? stateslug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Unknown State";

  const formattedCategory = categoryslug
    ? categoryslug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Unknown Category";

  // Filter out cities without hotels and ensure uniqueness
  const uniqueCities = Array.from(
    new Map(
      relatedcity
        ?.filter((city) => city.hasHotels)
        .map((city) => [city.cityslug, city])
    ).values()
  );

  const displayedCities = uniqueCities.slice(0, 40);

  if (!Array.isArray(displayedCities) || displayedCities.length === 0) {
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
        🏨 Best Related Cities in {formattedState}
      </h2>
      <div className="row g-2">
        {displayedCities.map((city, index) => {
          const citySlug = city.cityslug || createSlug(city.city);
          const capitalizedCity = city.city
            ? city.city.charAt(0).toUpperCase() + city.city.slice(1)
            : "Unknown City";

          return (
            <div key={`${city.cityslug}-${index}`} className="col-6 col-md-4 col-lg-3">
              <div className="p-2 border rounded bg-white shadow-sm transition-all hover:shadow-md hover:bg-light">
                <a
                  href={`/${categoryslug}/${countryslug}/${stateslug}/${citySlug}`}
                  className="fw-medium text-dark d-block text-start text-decoration-none"
                  style={{ fontSize: "14px" }}
                >
                  {`${formattedCategory} In ${capitalizedCity}`}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Relatedcity88;