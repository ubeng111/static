const Faq = ({ title = "this property" }) => {
  const faqContent = [
    {
      id: 1,
      collapseTarget: "One",
      title: `What unique facilities does ${title} offer?`,
      content: `${title} boasts unique amenities such as a rooftop infinity pool, a gourmet restaurant with a Michelin-starred chef, and a 24-hour concierge service. Additionally, complimentary high-speed Wi-Fi is available throughout the property.`,
    },
    {
      id: 2,
      collapseTarget: "Two",
      title: `Is breakfast included with my reservation at ${title}?`,
      content: `Yes, a sumptuous breakfast buffet featuring local and international delicacies is included with every stay at ${title}. Vegan and gluten-free options are also available upon request.`,
    },
    {
      id: 3,
      collapseTarget: "Three",
      title: `What are the standard check-in and check-out times for ${title}?`,
      content: `Standard check-in at ${title} is from 3:00 PM, and check-out is by 11:00 AM. Early check-in and late check-out may be arranged based on availability for an additional fee.`,
    },
    {
      id: 4,
      collapseTarget: "Four",
      title: `Does ${title} have a pet-friendly policy?`,
      content: `While we love animals, ${title} regretfully does not allow pets, with the exception of service animals. Please contact us in advance if you require assistance with service animal accommodations.`,
    },
    {
      id: 5,
      collapseTarget: "Five",
      title: `Are parking facilities available at ${title}?`,
      content: `Yes, ${title} offers secure on-site parking for guests, including valet service. Charges may apply. Please inquire at the front desk upon arrival for details.`,
    },
    {
      id: 6,
      collapseTarget: "Six",
      title: `Is smoking permitted anywhere within ${title} premises?`,
      content: `For the comfort and safety of all guests, ${title} is a non-smoking property. Smoking is strictly prohibited in all indoor areas, including guest rooms and balconies. Designated outdoor smoking areas are available.`,
    },
    {
      id: 7,
      collapseTarget: "Seven",
      title: `Can ${title} arrange airport transportation services?`,
      content: `Indeed, ${title} provides convenient airport transfer services to and from major airports. This service is available for an additional charge, and we recommend booking in advance through our concierge.`,
    },
    {
      id: 8,
      collapseTarget: "Eight",
      title: `What is the cancellation policy for bookings at ${title}?`,
      content: `Our flexible cancellation policy allows free cancellation up to 48 hours before your scheduled check-in. Cancellations made within 48 hours will incur a charge equivalent to one night's stay. Group bookings may have different policies.`,
    },
    {
      id: 9,
      collapseTarget: "Nine",
      title: `Are there meeting or event facilities at ${title}?`,
      content: `Yes, ${title} features state-of-the-art meeting rooms and versatile event spaces, perfect for business conferences, workshops, and social gatherings. Our dedicated events team is available to assist with planning and execution.`,
    },
    {
      id: 10,
      collapseTarget: "Ten",
      title: `What popular attractions are located near ${title}?`,
      content: `Situated in a prime location, ${title} is just minutes away from major attractions such as the Historic City Center, the Grand Museum, and the vibrant Riverside Market. Our concierge can provide maps and recommendations for local sightseeing.`,
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