"use client"; // Marks this as a Client Component

// components/faq/Faqcategory.jsx

const FaqCategory = ({
  category = "your next adventure",
  items = [], // Prop items tetap diterima, tapi tidak digunakan untuk rendering list
}) => {
  const faqContent = [
    {
      id: 1,
      collapseTarget: "CategoryOne",
      question: `What types of ${category} offerings are available?`,
      answer: `Our ${category} collection ranges from luxurious, high-end experiences to smart, budget-friendly options. You'll find everything from boutique stays and charming guesthouses to sprawling resorts and innovative capsule hotels, designed to fit various travel styles and needs.`,
    },
    {
      id: 2,
      collapseTarget: "CategoryTwo",
      question: `Are there family-friendly options within the ${category} selection?`,
      answer: `Absolutely! Many of our ${category} accommodations are highly recommended for families, featuring amenities like kids' clubs, spacious family suites, dedicated play areas, and sometimes even supervised activities to make your family moments more memorable and comfortable.`,
    },
    {
      id: 3,
      collapseTarget: "CategoryThree",
      question: `What are the main attractions or popular destinations near these ${category} offerings?`,
      answer: `Our ${category} properties are often strategically located near iconic tourist attractions, bustling entertainment hubs, and must-try culinary delights. Depending on the specific property, you could be steps away from historical landmarks, vibrant shopping districts, or serene natural parks.`,
    },
    {
      id: 4,
      collapseTarget: "CategoryFour",
      question: `Do ${category} options provide luxurious amenities or special features?`,
      answer: `Indeed! Many of our premium ${category} offerings come equipped with five-star amenities such as private infinity pools, holistic spa services, state-of-the-art fitness centers, and personalized butler services. Indulge in an unforgettable experience designed for ultimate comfort and luxury.`,
    },
    {
      id: 5,
      collapseTarget: "CategoryFive",
      question: `Which are the top-rated ${category} options with the best customer reviews?`,
      answer: `Looking for the absolute best? Our platform highlights top-rated ${category} options frequently praised by our community. These properties consistently receive excellent reviews for their service, facilities, and overall guest satisfaction. We recommend checking individual property pages for detailed reviews and current ratings to find your perfect match.`, // Ubah konten agar tidak menyiratkan daftar di sini
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
                {/* Hapus bagian rendering daftar item/hotel di sini */}
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default FaqCategory;