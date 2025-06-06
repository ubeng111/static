import React from 'react';
import Link from 'next/link';

const createSlug = (name) => {
  return name
    ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/-+/g, '-').trim()
    : 'unknown-state';
};

const RelatedCountry88 = React.memo(({ relatedStates }) => {
  if (!Array.isArray(relatedStates) || relatedStates.length === 0) {
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
        🗺️ Related States
      </h2>
      <div className="row g-2">
        {relatedStates.map((stateData, index) => {
          const stateSlug = stateData.stateslug || createSlug(stateData.state);
          const capitalizedState = stateData.state
            ? stateData.state.charAt(0).toUpperCase() + stateData.state.slice(1)
            : 'Unknown State';

          return (
            <div key={`${stateData.state}-${index}`} className="col-6 col-md-4 col-lg-3">
              <div className="p-2 border rounded bg-white shadow-sm transition-all hover:shadow-md hover:bg-light">
                <Link
                  href={`/state/${stateSlug}`}
                  className="fw-medium text-dark d-block text-start text-decoration-none"
                  style={{ fontSize: '14px' }}
                >
                  {capitalizedState}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default RelatedCountry88;