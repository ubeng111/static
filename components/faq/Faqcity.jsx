// Faqcity.jsx
const Faqcity = ({
  city = "this city",
  category = "accommodations", // Tambahkan category
  hotels = [], // Prop hotels tetap diterima, tapi tidak digunakan untuk rendering list
  // Prop slug tidak lagi relevan jika tidak ada link hotel individual
  // categoryslug,
  // countryslug,
  // stateslug,
  // cityslug
}) => {
  const faqContent = [
    {
      id: 1,
      collapseTarget: "One",
      question: `What kinds of ${category} are available for booking in ${city}?`,
      content: `In ${city}, you'll find an extensive range of ${category}, from high-end luxury establishments in the city center to charming boutique properties in historic neighborhoods, and affordable options conveniently located near public transport.`,
    },
    {
      id: 2,
      collapseTarget: "Two",
      question: `Are there ${category} in ${city} that are particularly good for families?`,
      content: `Yes, many ${category} in ${city} cater specifically to families. These often include amenities like spacious family rooms, children's play areas, and sometimes even special programs or discounts for kids.`,
    },
    {
      id: 3,
      collapseTarget: "Three",
      question: `What are some key attractions located close to ${category} within ${city}?`,
      content: `${category} in ${city} are ideally situated near a variety of popular attractions, whether it's iconic landmarks, vibrant shopping districts, renowned museums, or lively entertainment venues. You'll find plenty to explore just steps away.`,
    },
    {
      id: 4,
      collapseTarget: "Four",
      question: `Do ${category} in ${city} typically come with swimming pools?`,
      content: `Many ${category} in ${city} offer excellent swimming facilities, including indoor and outdoor pools. Some even boast rooftop pools with panoramic views of the cityscape, providing a perfect spot to relax and unwind.`,
    },
    {
      id: 5,
      collapseTarget: "Five",
      question: `Which are considered the best-rated ${category} in ${city} based on guest feedback?`,
      content: `While preferences vary, the best-rated ${category} in ${city} frequently stand out for their exceptional service, luxurious amenities, strategic locations, and outstanding cleanliness. We recommend checking individual property pages for detailed reviews and current ratings to find your perfect match.`, // Ubah konten agar tidak menyiratkan daftar di sini
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
              data-bs-parent="#Faq1"
            >
              <div className="pt-15 pl-60">
                <p className="text-15">{item.content}</p>
                {/* Hapus bagian rendering daftar hotel di sini */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Faqcity;