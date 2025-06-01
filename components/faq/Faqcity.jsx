const Faqcity = ({ city = "this city", hotels = [] }) => {
  const faqContent = [
    {
      id: 1,
      collapseTarget: "One",
      city: `What types of hotels are available in ${city}?`,
      content: `Explore a variety of hotels in ${city}, ranging from luxury hotels to budget options.`,
    },
    {
      id: 2,
      collapseTarget: "Two",
      city: `Are there hotels suitable for families in ${city}?`,
      content: `Yes, there are plenty of family-friendly hotels in ${city}.`,
    },
    {
      id: 3,
      collapseTarget: "Three",
      city: `What attractions are near hotels in ${city}?`,
      content: `Hotels in ${city} are close to various popular attractions.`,
    },
    {
      id: 4,
      collapseTarget: "Four",
      city: `Are there hotels with pools in ${city}?`,
      content: `Yes, many hotels in ${city} feature pools and other facilities.`,
    },
    {
      id: 5,
      collapseTarget: "Five",
      city: `What are the best-rated hotels in ${city}?`,
      content: `Here are some of the top-rated hotels in ${city}:`,
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
