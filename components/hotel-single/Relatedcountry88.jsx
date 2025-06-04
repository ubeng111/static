import React from "react";

const createSlug = (name) => {
  return name
    ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
    : 'unknown-state'; // Kembali ke 'unknown-state'
};

// KEMBALI MENGGUNAKAN NAMA PROP 'relatedcountry'
const Relatedcountry88 = React.memo(({ relatedcountry, countryslug, categoryslug }) => {
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

  // Validasi dan hapus duplikasi state
  // KEMBALI MENGGUNAKAN 'stateData.state' dan 'stateData.stateslug'
  const validStates = Array.isArray(relatedcountry)
    ? Array.from(
        new Map(
          relatedcountry
            .filter(
              (stateData) =>
                stateData.state &&
                stateData.state.trim() !== '' &&
                stateData.stateslug &&
                stateData.stateslug.match(/^[a-z0-9-]+$/)
            )
            .map((stateData) => [stateData.stateslug, stateData])
        ).values()
      )
    : [];

  if (validStates.length === 0) {
    return (
      <div className="container">
        <h2 className="text-center fw-bold mb-3 text-dark">
          Tidak Ada State Terkait Ditemukan
        </h2>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Kembali ke judul "State di" */}
      <h2 className="text-center fw-bold mb-3 text-dark">
        🏨 State di {formattedCountry}
      </h2>
      
      <div className="row g-2">
        {validStates.map((stateData, index) => {
          // KEMBALI MENGGUNAKAN stateSlug dan capitalizedState
          const stateSlug = stateData.stateslug || createSlug(stateData.state);
          const capitalizedState = stateData.state
            ? stateData.state.charAt(0).toUpperCase() + stateData.state.slice(1)
            : 'Unknown State';

          return (
            <div key={`${stateData.state}-${index}`} className="col-6 col-md-4 col-lg-3">
              <div className="p-2 border rounded bg-white shadow-sm transition-all hover:shadow-md hover:bg-light">
                <a
                  // URL akan menunjuk ke stateSlug
                  href={`/${categoryslug}/${countryslug}/${stateSlug}`}
                  className="fw-medium text-dark d-block text-start text-decoration-none"
                  style={{ fontSize: '14px' }}
                >
                  {/* Teks "State di" */}
                  {`${formattedCategory} in ${capitalizedState}`}
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