// Faqlandmark.jsx
"use client"; // Marks this as a Client Component

const Faqlandmark = ({
  landmark = "this landmark",
  category = "accommodations",
  cityName = "this city",
  hotels = [], // Prop hotels tetap diterima, tapi tidak digunakan untuk rendering list
}) => {
  const faqContent = [
    {
      id: 1,
      collapseTarget: "One",
      question: `What types of ${category} are there near ${landmark} in ${cityName}?`,
      content: `In the vicinity of ${landmark} in ${cityName}, you'll find a wide range of ${category} options, from luxurious boutique properties to comfortable and affordable stays. Whether you're planning a short visit or an extended exploration, there's a perfect ${category} for every preference.`,
    },
    {
      id: 2,
      collapseTarget: "Two",
      question: `Are there family-friendly ${category} options near ${landmark} in ${cityName}?`,
      content: `Absolutely! Many ${category} near ${landmark} in ${cityName} are well-equipped for families, offering amenities like spacious family rooms, kids' clubs, and swimming pools. They provide a comfortable base for exploring the landmark and its surroundings with your loved ones.`,
    },
    {
      id: 3,
      collapseTarget: "Three",
      question: `What attractions are near ${category} close to ${landmark} in ${cityName}?`,
      content: `${category} near ${landmark} in ${cityName} offer unmatched convenience for visiting the landmark itself. Additionally, they are often strategically located near other popular attractions, museums, restaurants, and entertainment options, making your exploration effortless.`,
    },
    {
      id: 4,
      collapseTarget: "Four",
      question: `Are there ${category} with pools near ${landmark} in ${cityName}?`,
      content: `Yes, many ${category} near ${landmark} in ${cityName} feature refreshing swimming pools, ideal for unwinding after a day of sightseeing. Some even boast rooftop pools with stunning views of the landmark or the city skyline.`,
    },
    {
      id: 5,
      collapseTarget: "Five",
      question: `What are the best-rated ${category} options near ${landmark} in ${cityName}?`,
      content: hotels.length > 0
        ? `Based on guest reviews, some of the top-rated ${category} options near ${landmark} in ${cityName} include:`
        : `Currently, we do not have specific data on the best-rated ${category} directly next to ${landmark} in ${cityName}. However, you can browse a variety of highly-rated options in the wider area directly on their respective property pages.`, // Ubah konten agar tidak menyiratkan daftar di sini
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
              <div className="button text-dark-1 text-start">
                {item.question}
              </div>
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

export default Faqlandmark;