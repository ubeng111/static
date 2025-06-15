"use client"; // Marks this as a Client Component

const Faqcountry = ({ country = "this country", hotels = [], dictionary }) => { // Tambahkan prop dictionary
  const faqCountryContent = dictionary?.faqContent?.country || {};

  const getLocalizedText = (key, interpolations = {}) => {
    let text = faqCountryContent[key];
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
      country: getLocalizedText('typesOfHotelsQuestion', { country }),
      content: getLocalizedText('typesOfHotelsAnswer', { country }),
    },
    {
      id: 2,
      collapseTarget: "Two",
      country: getLocalizedText('familyFriendlyHotelsQuestion', { country }),
      content: getLocalizedText('familyFriendlyHotelsAnswer', { country }),
    },
    {
      id: 3,
      collapseTarget: "Three",
      country: getLocalizedText('attractionsNearHotelsQuestion', { country }),
      content: getLocalizedText('attractionsNearHotelsAnswer', { country }),
    },
    {
      id: 4,
      collapseTarget: "Four",
      country: getLocalizedText('hotelsWithPoolsQuestion', { country }),
      content: getLocalizedText('hotelsWithPoolsAnswer', { country }),
    },
    {
      id: 5,
      collapseTarget: "Five",
      country: getLocalizedText('bestRatedHotelsQuestion', { country }),
      content: getLocalizedText('bestRatedHotelsAnswer', { country }),
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
              <div className="button text-dark-1 text-start">{item.country}</div>
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

export default Faqcountry;