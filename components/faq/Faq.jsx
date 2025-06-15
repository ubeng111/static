"use client"; // Marks this as a Client Component

const Faq = ({ title = "this property", dictionary }) => {
  // Pastikan dictionary dan sub-path tersedia
  const faqHotelContent = dictionary?.faqContent?.hotel || {};

  const getLocalizedText = (key, interpolations = {}) => {
    let text = faqHotelContent[key];
    if (!text) return `Missing translation for ${key}`; // Fallback if translation is missing

    for (const [placeholder, value] of Object.entries(interpolations)) {
      text = text.replace(new RegExp(`{${placeholder}}`, 'g'), value);
    }
    return text;
  };

  const faqContent = [
    {
      id: 1,
      collapseTarget: "One",
      title: getLocalizedText('facilitiesQuestion', { title }),
      content: getLocalizedText('facilitiesAnswer', { title }),
    },
    {
      id: 2,
      collapseTarget: "Two",
      title: getLocalizedText('breakfastQuestion', { title }),
      content: getLocalizedText('breakfastAnswer', { title }),
    },
    {
      id: 3,
      collapseTarget: "Three",
      title: getLocalizedText('checkInCheckOutQuestion', { title }),
      content: getLocalizedText('checkInCheckOutAnswer', { title }),
    },
    {
      id: 4,
      collapseTarget: "Four",
      title: getLocalizedText('petsAllowedQuestion', { title }),
      content: getLocalizedText('petsAllowedAnswer', { title }),
    },
    {
      id: 5,
      collapseTarget: "Five",
      title: getLocalizedText('parkingFacilityQuestion', { title }),
      content: getLocalizedText('parkingFacilityAnswer', { title }),
    },
    {
      id: 6,
      collapseTarget: "Six",
      title: getLocalizedText('smokingAllowedQuestion', { title }),
      content: getLocalizedText('smokingAllowedAnswer', { title }),
    },
    {
      id: 7,
      collapseTarget: "Seven",
      title: getLocalizedText('airportTransportationQuestion', { title }),
      content: getLocalizedText('airportTransportationAnswer', { title }),
    },
    {
      id: 8,
      collapseTarget: "Eight",
      title: getLocalizedText('cancellationPolicyQuestion', { title }),
      content: getLocalizedText('cancellationPolicyAnswer', { title }),
    },
    {
      id: 9,
      collapseTarget: "Nine",
      title: getLocalizedText('meetingFacilitiesQuestion', { title }),
      content: getLocalizedText('meetingFacilitiesAnswer', { title }),
    },
    {
      id: 10,
      collapseTarget: "Ten",
      title: getLocalizedText('attractionsNearQuestion', { title }),
      content: getLocalizedText('attractionsNearAnswer', { title }),
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
              <div className="button text-dark-1 text-start">{item.title}</div>
            </div>
            <div
              className="accordion-collapse collapse"
              id={item.collapseTarget}
              data-bs-parent="#Faq1"
            >
              <div className="pt-15 pl-60">
                <p className="text-15">{item.content}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Faq;