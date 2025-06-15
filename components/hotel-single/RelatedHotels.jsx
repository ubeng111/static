import Link from 'next/link';

// CSS for truncation and responsive layout
const styles = {
  container: {
    maxWidth: '1200px',
    boxSizing: 'border-box',
    margin: '0 auto',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '1rem 0',
    color: '#1a1a1a',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  hotelCard: {
    border: '1px solid #dee2e6',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    boxSizing: 'border-box',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  hotelLink: {
    flex: 1,
    minWidth: 0, // Allows text truncation within flex container
    textDecoration: 'none',
    color: '#1a1a1a',
    fontSize: '14px',
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};

export default function RelatedHotels({ relatedHotels, dictionary, currentLang }) { // Add dictionary and currentLang props
  const commonDict = dictionary?.common || {};
  const hotelSinglePageDict = dictionary?.hotelSinglePage || {};

  if (!Array.isArray(relatedHotels) || relatedHotels.length === 0) {
    return (
      <div style={styles.container}>
        <div className="row y-gap-10">
          <div className="col-12">
            <div className="text-14 fw-500">
              {commonDict.noRelatedHotelsFound || "No Related Accommodations Found"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sortedHotels = [...relatedHotels].sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
  const displayedHotels = sortedHotels.slice(0, 15);

  const city = displayedHotels[0]?.city
    ? displayedHotels[0].city.charAt(0).toUpperCase() + displayedHotels[0].city.slice(1)
    : commonDict.unknownCity || 'Unknown City';
  const category = displayedHotels[0]?.category
    ? displayedHotels[0].category.charAt(0).toUpperCase() + displayedHotels[0].category.slice(1)
    : commonDict.unknownCategory || 'Unknown Category';
  const categorySlug = displayedHotels[0]?.categoryslug || 'unknown';
  const countrySlug = displayedHotels[0]?.countryslug || 'unknown';
  const stateSlug = displayedHotels[0]?.stateslug || 'unknown';
  const citySlug = displayedHotels[0]?.cityslug || 'unknown';

  // Use the dictionary for the title, dynamically replacing placeholders
  const titleText = commonDict.topRecommendedHotelsTitle
    ? commonDict.topRecommendedHotelsTitle
        .replace('{category}', category)
        .replace('{city}', city)
    : `Top Recommended ${category} in ${city}`;

  return (
    <div style={styles.container}>
      <div className="row y-gap-10">
        <div className="col-12">
          <h2 style={styles.title}>
            {titleText}
          </h2>
        </div>
      </div>
      <div className="row y-gap-10">
        {displayedHotels.map((hotel) => {
          const hotelSlug = hotel?.hotelslug || 'unknown';
          const hotelTitle = hotel?.title || commonDict.unnamedHotel || 'Unnamed Accommodation';
          const ratings = hotel.ratings ? Number(hotel.ratings).toFixed(1) : 'N/A';
          const reviews = hotel.numberofreviews || 0;

          return (
            <div key={`${hotelSlug}-${hotel.id || ''}`} className="col-xl-4 col-md-6 col-sm-12">
              <div style={styles.hotelCard}>
                <i className="icon-hotel text-20 me-2" />
                <Link
                  href={`/${currentLang}/${categorySlug}/${countrySlug}/${stateSlug}/${citySlug}/${hotelSlug}`} // Use currentLang in the href
                  style={styles.hotelLink}
                  title={hotelTitle} // Full title on hover
                >
                  {hotelTitle}
                </Link>
                <span
                  className="badge bg-primary rounded-pill ms-1"
                  style={{ fontSize: '11px' }}
                >
                  {ratings} / {reviews} {reviews === 1 ? hotelSinglePageDict.review || commonDict.review || 'review' : hotelSinglePageDict.reviews || commonDict.reviews || 'reviews'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}