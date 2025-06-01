const Faq = ({ title = "this property" }) => {
  const faqContent = [
    {
      id: 1,
      collapseTarget: "One",
      title: `What facilities are included at ${title}?`,
      content: `Facilities at ${title} include free Wi-Fi, a swimming pool, parking, and more. Contact the property for a full list of amenities.`,
    },
    {
      id: 2,
      collapseTarget: "Two",
      title: `Is breakfast included at ${title}?`,
      content: `Yes, breakfast is included with your stay at ${title}.`,
    },
    {
      id: 3,
      collapseTarget: "Three",
      title: `What are the check-in and check-out times at ${title}?`,
      content: `Check-in time is from 2 PM, and check-out is by 12 PM at ${title}.`,
    },
    {
      id: 4,
      collapseTarget: "Four",
      title: `Are pets allowed at ${title}?`,
      content: `Pets are not allowed at ${title}.`,
    },
    {
      id: 5,
      collapseTarget: "Five",
      title: `Is there a parking facility at ${title}?`,
      content: `Yes, parking is available for guests at ${title}.`,
    },
    {
      id: 6,
      collapseTarget: "Six",
      title: `Is smoking allowed at ${title}?`,
      content: `No, smoking is prohibited in all areas of ${title}.`,
    },
    {
      id: 7,
      collapseTarget: "Seven",
      title: `Does ${title} offer airport transportation?`,
      content: `Yes, airport transportation can be arranged at ${title} for an additional fee.`,
    },
    {
      id: 8,
      collapseTarget: "Eight",
      title: `What is the cancellation policy at ${title}?`,
      content: `Cancellations can be made up to 24 hours before check-in without a charge.`,
    },
    {
      id: 9,
      collapseTarget: "Nine",
      title: `Does ${title} have meeting facilities?`,
      content: `Yes, ${title} has fully equipped meeting rooms available for booking.`,
    },
    {
      id: 10,
      collapseTarget: "Ten",
      title: `What attractions are near ${title}?`,
      content: `Popular attractions near ${title} include [list of attractions].`,
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
