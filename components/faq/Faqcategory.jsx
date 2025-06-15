"use client"; // Marks this as a Client Component

// components/faq/Faqcategory.jsx

const FaqCategory = ({
  category = "your next adventure",
  items = [],
  currentLang,      // Diteruskan dari ClientPage (mungkin tidak perlu jika dictionary sudah ada)
  categoryslug,     // Diteruskan dari ClientPage (mungkin tidak perlu)
  dictionary        // Tambahkan prop dictionary
}) => {
  const faqCategoryContent = dictionary?.faqContent?.category || {};

  const getLocalizedText = (key, interpolations = {}) => {
    let text = faqCategoryContent[key];
    if (!text) return `Missing translation for ${key}`;

    for (const [placeholder, value] of Object.entries(interpolations)) {
      text = text.replace(new RegExp(`{${placeholder}}`, 'g'), value);
    }
    return text;
  };

  const faqContent = [
    {
      id: 1,
      collapseTarget: "CategoryOne",
      question: getLocalizedText('offeringsQuestion', { category }),
      answer: getLocalizedText('offeringsAnswer', { category }),
    },
    {
      id: 2,
      collapseTarget: "CategoryTwo",
      question: getLocalizedText('familyFriendlyQuestion', { category }),
      answer: getLocalizedText('familyFriendlyAnswer', { category }),
    },
    {
      id: 3,
      collapseTarget: "CategoryThree",
      question: getLocalizedText('mainAttractionsQuestion', { category }),
      answer: getLocalizedText('mainAttractionsAnswer', { category }),
    },
    {
      id: 4,
      collapseTarget: "CategoryFour",
      question: getLocalizedText('luxuryAmenitiesQuestion', { category }),
      answer: getLocalizedText('luxuryAmenitiesAnswer', { category }),
    },
    {
      id: 5,
      collapseTarget: "CategoryFive",
      question: getLocalizedText('topRatedQuestion', { category }),
      answer: getLocalizedText('topRatedAnswer', { category }),
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
              <div className="button text-dark-1 text-start">{item.question}</div>
            </div>
            <div
              className="accordion-collapse collapse"
              id={item.collapseTarget}
              data-bs-parent="#FaqCategory"
            >
              <div className="pt-15 pl-60">
                <p className="text-15">{item.answer}</p>
                {/* Display list of items if available and this is the "best-rated" question */}
                {item.id === 5 && items.length > 0 && (
                  <ul>
                    {items.map((catItem, index) => ( // Use index as key here as we are no longer relying on slug for unique link
                      <li key={catItem.slug || index}> {/* Use catItem.slug if it's guaranteed unique, otherwise fallback to index */}
                        {catItem.name} {/* Display just the name, no link */}
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

export default FaqCategory;