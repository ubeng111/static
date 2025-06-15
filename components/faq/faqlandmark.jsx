"use client"; // Marks this as a Client Component

const Faqlandmark = ({ landmark = "this landmark", hotels = [], dictionary }) => { // Tambahkan prop dictionary
  const faqLandmarkContent = dictionary?.faqContent?.landmark || {};

  const getLocalizedText = (key, interpolations = {}) => {
    let text = faqLandmarkContent[key];
    if (!text) return `Missing translation for ${key}`;

    for (const [placeholder, value] of Object.entries(interpolations)) {
      text = text.replace(new RegExp(`{${placeholder}}`, 'g'), value);
    }
    return text;
  };

  const faqContent = [
    {
      id: 1,
      collapseTarget: "One",
      landmark: getLocalizedText('typesOfHotelsQuestion', { landmark }),
      content: getLocalizedText('typesOfHotelsAnswer', { landmark }),
    },
    {
      id: 2,
      collapseTarget: "Two",
      landmark: getLocalizedText('familyFriendlyHotelsQuestion', { landmark }),
      content: getLocalizedText('familyFriendlyHotelsAnswer', { landmark }),
    },
    {
      id: 3,
      collapseTarget: "Three",
      landmark: getLocalizedText('attractionsNearHotelsQuestion', { landmark }),
      content: getLocalizedText('attractionsNearHotelsAnswer', { landmark }),
    },
    {
      id: 4,
      collapseTarget: "Four",
      landmark: getLocalizedText('hotelsWithPoolsQuestion', { landmark }),
      content: getLocalizedText('hotelsWithPoolsAnswer', { landmark }),
    },
    {
      id: 5,
      collapseTarget: "Five",
      landmark: getLocalizedText('bestRatedHotelsQuestion', { landmark }),
      // Konten untuk FAQ ini akan bervariasi berdasarkan apakah ada data hotel
      content: hotels.length > 0
        ? getLocalizedText('bestRatedHotelsAnswerWithData', { landmark })
        : getLocalizedText('bestRatedHotelsAnswerDefault', { landmark }),
    },
  ];

  return (
    <>
      {faqContent.map((item) => (
        <div className="col-12" key={item.id}>
          <div className="accordion__item px-20 py-20 border-light rounded-4">
            <div
              className="accordion__button d-flex items-center"
              data-bs-toggle="collapse"
              data-bs-target={`#${item.collapseTarget}`}
            >
              <div className="accordion__icon size-40 flex-center bg-light-2 rounded-full mr-20">
                <i className="icon-plus" />
                <i className="icon-minus" />
              </div>
              <div className="button text-dark-1 text-start">
                {item.landmark}
              </div>
            </div>
            <div
              className="accordion-collapse collapse"
              id={item.collapseTarget}
              data-bs-parent="#Faq1"
            >
              <div className="pt-15 pl-60">
                <p className="text-15">{item.content}</p>
                {/* Tampilkan daftar hotel jika ada dan ini adalah FAQ untuk hotel terbaik */}
                {item.id === 5 && hotels.length > 0 && (
                  <ul>
                    {hotels.map((hotel) => (
                      <li key={hotel.hotelId}>
                        <a
                          href={hotel.landingURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-1"
                        >
                          {hotel.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Faqlandmark;