import React from "react";

// Fungsi untuk mengonversi nama country menjadi slug
const createSlug = (country) => {
  return country
    ? country.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') // Convert to lowercase, replace spaces with hyphens, remove special characters
    : 'unknown-country'; // fallback jika tidak ada nama country
};

const relatedcategory = ({ relatedcategory }) => {
  if (!Array.isArray(relatedcategory) || relatedcategory.length === 0) {
    return (
      <div className="container">
        <h2 className="text-center fw-bold mb-3 text-dark">
          No Related countrys Found
        </h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="text-center fw-bold mb-3 text-dark">
        🏨 Countrys in {relatedcategory[0]?.category || 'Unknown Category'}
      </h2>
      <div className="row g-2">
        {relatedcategory.map((countryData, index) => {
          // Menggunakan fungsi createSlug untuk menghasilkan slug country
          const countrySlug = countryData.countryslug || createSlug(countryData.country);

          // Kapitalisasi huruf pertama dari nama country
          const capitalizedcountry = countryData.country
            ? countryData.country.charAt(0).toUpperCase() + countryData.country.slice(1)
            : 'Unknown country';

          return (
            <div key={`${countryData.country}-${index}`} className="col-6 col-md-4 col-lg-3">
              <div className="p-2 border rounded bg-white shadow-sm transition-all hover:shadow-md hover:bg-light">
                <a
                  href={`/country/${countrySlug}`} // Link untuk halaman yang menampilkan hotel di country tersebut
                  className="fs-6 fw-medium text-dark d-block text-start text-decoration-none"
                >
                  {capitalizedcountry} {/* Menampilkan nama country dengan huruf pertama kapital */}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default relatedcategory;
