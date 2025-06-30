const Faqcountry = ({
  country = "this country",
  category = "accommodations", // Tambahkan category juga untuk FAQ yang lebih dinamis
  hotels = [] // Prop hotels tetap diterima, tapi tidak digunakan untuk rendering list
}) => {
  const faqContent = [
    {
      id: 1,
      collapseTarget: "One",
      question: `What kinds of ${category} can I expect to find across ${country}?`,
      content: `From bustling city ${category} to serene countryside retreats, ${country} offers a diverse selection of ${category}. You can find everything from opulent luxury properties to charming mid-range options and convenient budget accommodations to suit any travel style and budget.`,
    },
    {
      id: 2,
      collapseTarget: "Two",
      question: `Does ${country} offer many ${category} that are suitable for families?`,
      content: `Yes, ${country} is very welcoming to families, with numerous ${category} providing special amenities like interconnected rooms, kid-friendly dining options, and recreational facilities such as playgrounds and dedicated family pools.`,
    },
    {
      id: 3,
      collapseTarget: "Three",
      question: `What popular tourist attractions are generally close to ${category} in ${country}?`,
      content: `Many ${category} in ${country} are strategically located near major tourist attractions, including historical landmarks, vibrant cultural districts, and natural wonders. This makes it easy for guests to explore the country's highlights during their stay.`,
    },
    {
      id: 4,
      collapseTarget: "Four",
      question: `Are ${category} with swimming pools a common feature in ${country}?`,
      content: `Swimming pools are a common and highly desired amenity in ${category} across ${country}. You'll find a wide range of ${category} offering refreshing pools, from standard outdoor pools to luxurious rooftop infinity pools with stunning views.`,
    },
    {
      id: 5,
      collapseTarget: "Five",
      question: `Which ${category} in ${country} are consistently rated as the best by guests?`,
      content: `While specific top-rated ${category} in ${country} can vary, properties consistently receiving high praise are typically those offering exceptional service, unique cultural experiences, and prime locations that allow easy access to attractions. We recommend consulting recent guest reviews for the most current recommendations directly on their respective property pages.`, // Ubah konten agar tidak menyiratkan daftar di sini
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

export default Faqcountry;