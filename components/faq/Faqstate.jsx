const Faqstate = ({
  state = "this state",
  category = "accommodations", // Tambahkan category juga untuk FAQ yang lebih dinamis
  hotels = [] // Prop hotels tetap diterima, tapi tidak digunakan untuk rendering list
}) => {
  const faqContent = [
    {
      id: 1,
      collapseTarget: "One",
      question: `What variety of ${category} can I find in ${state}?`,
      content: `In ${state}, you'll discover a rich array of accommodation options, from luxurious five-star resorts boasting incredible amenities to charming boutique ${category} and comfortable, budget-friendly stays perfect for any traveler.`,
    },
    {
      id: 2,
      collapseTarget: "Two",
      question: `Are there family-friendly ${category} options in ${state}?`,
      content: `Absolutely! ${state} is home to numerous family-friendly ${category} that offer spacious rooms, kids' activities, swimming pools, and other amenities designed to ensure a comfortable and enjoyable stay for families of all sizes.`,
    },
    {
      id: 3,
      collapseTarget: "Three",
      question: `What major attractions are conveniently located near ${category} in ${state}?`,
      content: `${category} throughout ${state} are often situated near popular attractions, including historical sites, vibrant cultural centers, natural parks, and entertainment venues. You'll find it easy to explore the best of the state from your accommodation.`,
    },
    {
      id: 4,
      collapseTarget: "Four",
      question: `Do ${category} in ${state} typically feature swimming pools?`,
      content: `Many ${category} in ${state} offer fantastic swimming pools, ranging from indoor heated pools perfect for any season to expansive outdoor pools with sun decks, providing a great way to relax after a day of exploring.`,
    },
    {
      id: 5,
      collapseTarget: "Five",
      question: `Which are the highest-rated ${category} in ${state} according to guest reviews?`,
      content: `Based on extensive guest feedback, some of the top-rated ${category} in ${state} are known for their exceptional service, prime locations, and outstanding facilities. We recommend checking specific property listings for their latest reviews and ratings directly on their respective property pages.`, // Ubah konten agar tidak menyiratkan daftar di sini
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

export default Faqstate;