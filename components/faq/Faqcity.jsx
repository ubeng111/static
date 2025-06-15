"use client"; // Marks this as a Client Component

const Faqcity = ({ city = "this city", hotels = [], dictionary }) => { // Tambahkan prop dictionary
  const faqCityContent = dictionary?.faqContent?.city || {};

  const getLocalizedText = (key, interpolations = {}) => {
    let text = faqCityContent[key];
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
      city: getLocalizedText('typesOfHotelsQuestion', { city }),
      content: getLocalizedText('typesOfHotelsAnswer', { city }),
    },
    {
      id: 2,
      collapseTarget: "Two",
      city: getLocalizedText('familyFriendlyHotelsQuestion', { city }),
      content: getLocalizedText('familyFriendlyHotelsAnswer', { city }),
    },
    {
      id: 3,
      collapseTarget: "Three",
      city: getLocalizedText('attractionsNearHotelsQuestion', { city }),
      content: getLocalizedText('attractionsNearHotelsAnswer', { city }),
    },
    {
      id: 4,
      collapseTarget: "Four",
      city: getLocalizedText('hotelsWithPoolsQuestion', { city }),
      content: getLocalizedText('hotelsWithPoolsAnswer', { city }),
    },
    {
      id: 5,
      collapseTarget: "Five",
      city: getLocalizedText('bestRatedHotelsQuestion', { city }),
      content: getLocalizedText('bestRatedHotelsAnswer', { city }),
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
              <div className="button text-dark-1 text-start">{item.city}</div>
            </div>
            <div
              className="accordion-collapse collapse"
              id={item.collapseTarget}
              data-bs-parent="#Faq1"
            >
              <div className="pt-15 pl-60">
                <p className="text-15">{item.content}</p>
                {/* Tampilkan daftar hotel jika ada */}
                {item.id === 5 && hotels.length > 0 && (
                  <ul>
                    {hotels.map((hotel) => (
                      <li key={hotel.slug}>
                        <a
                          href={`http://localhost:3000/property/${hotel.slug}`}
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

export default Faqcity;