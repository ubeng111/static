import React from "react";

const createSlug = (state) => {
  return state
    ? state.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")
    : "unknown-state";
};

const Relatedcountry88 = React.memo(({ relatedcountry, countryslug, categoryslug }) => {
  const formattedCountry = countryslug
    ? countryslug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Unknown Country";

  const formattedCategory = categoryslug
    ? categoryslug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Unknown Category";

  // Filter out states without hotels
  const validStates = relatedcountry?.filter((stateData) => stateData.hasHotels);

  if (!Array.isArray(validStates) || validStates.length === 0) {
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
        {validStates.map((stateData, index) => {
          const stateSlug = stateData.stateslug || createSlug(stateData.state);
          const capitalizedState = stateData.state
            ? stateData.state.charAt(0).toUpperCase() + stateData.state.slice(1)
            : "Unknown State";

          return (
            <div key={`${stateData.state}-${index}`} className="col-6 col-md-4 col-lg-3">
              <div className="p-2 border rounded bg-white shadow-sm transition-all hover:shadow-md hover:bg-light">
                <a
                  href={`/${categoryslug}/${countryslug}/${stateSlug}`}
                  className="fw-medium text-dark d-block text-start text-decoration-none"
                  style={{ fontSize: "14px" }}
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