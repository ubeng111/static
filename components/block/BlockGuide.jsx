// components/block/BlockGuide.jsx
// Pastikan tidak ada import 'server-only' atau getdictionary di sini

const BlockGuide = ({ blockGuide }) => { // Menerima prop blockGuide
  // Memastikan blockGuide adalah objek yang valid sebelum diakses
  const safeBlockGuide = blockGuide || {};

  const blockContent = [
    {
      id: 1,
      icon: "/img/featureIcons/1/1.svg",
      title: safeBlockGuide.bestPriceGuarantee, // Mengambil dari prop blockGuide
      text: safeBlockGuide.bestPriceGuaranteeText, // Mengambil dari prop blockGuide
      delayAnim: "100",
    },
    {
      id: 2,
      icon: "/img/featureIcons/1/2.svg",
      title: safeBlockGuide.easyQuickBooking, // Mengambil dari prop blockGuide
      text: safeBlockGuide.easyQuickBookingText, // Mengambil dari prop blockGuide
      delayAnim: "200",
    },
    {
      id: 3,
      icon: "/img/featureIcons/1/3.svg",
      title: safeBlockGuide.customerSupport, // Mengambil dari prop blockGuide
      text: safeBlockGuide.customerSupportText, // Mengambil dari prop blockGuide
      delayAnim: "300",
    },
  ];

  return (
    <>
      {blockContent.map((item) => (
        <div
          className="col-lg-3 col-sm-6"
          data-aos="fade"
          data-aos-delay={item.delayAnim}
          key={item.id}
        >
          <div className="featureIcon -type-1 ">
            <div className="d-flex justify-center">
              <img src={item.icon} alt="image" className="js-lazy" />
            </div>
            <div className="text-center mt-30">
              <h2 className="text-18 fw-500">{item.title}</h2>
              <p className="text-15 mt-10">{item.text}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default BlockGuide;
