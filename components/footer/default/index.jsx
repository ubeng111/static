import Copyright from "./Copyright";

const Footer = () => {
  const categories = {
    "Popular Stays": [
      { name: "Hotel", url: "https://hoteloza.com/hotel" },
      { name: "Villa", url: "https://hoteloza.com/villa" },
      { name: "Resort", url: "https://hoteloza.com/resort" },
      { name: "Apartment", url: "https://hoteloza.com/apartment" },
      { name: "Guest House", url: "https://hoteloza.com/guest-house" },
    ],
    "Unique Stays": [
      { name: "Capsule Hotel", url: "https://hoteloza.com/capsule-hotel" },
      { name: "Yurt", url: "https://hoteloza.com/yurt" },
      { name: "Treehouse", url: "https://hoteloza.com/treehouse" },
      { name: "Tent", url: "https://hoteloza.com/tent" },
      { name: "Dome House", url: "https://hoteloza.com/dome-house" },
    ],
    "Traditional Stays": [
      { name: "Ryokan", url: "https://hoteloza.com/ryokan" },
      { name: "Machiya", url: "https://hoteloza.com/machiya" },
      { name: "Country House", url: "https://hoteloza.com/country-house" },
      { name: "Haveli", url: "https://hoteloza.com/haveli" },
      { name: "Riad", url: "https://hoteloza.com/riad" },
    ],
    "Nature & Adventure": [
      { name: "Farm Stay", url: "https://hoteloza.com/farm-stay" },
      { name: "Cabin", url: "https://hoteloza.com/cabin" },
      { name: "Chalet", url: "https://hoteloza.com/chalet" },
      { name: "Boat", url: "https://hoteloza.com/boat" },
      { name: "Houseboat", url: "https://hoteloza.com/houseboat" },
    ],
  };

  return (
    <footer className="footer py-5 bg-dark-2 text-white">
      <div className="container">
        <div className="row">
          {Object.entries(categories).map(([title, links], index) => (
            <div className="col-6 col-md-3 mb-4" key={index}>
              <h3
  className="fw-bold mb-3 text-white"
  style={{
    borderBottom: "2px solid white",
    paddingBottom: "0.3rem",
    fontSize: "16px",
  }}
>
  {title}
</h3>
              <ul className="list-unstyled">
                {links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url}
                      className="text-white d-block py-1 small"
                      style={{ textDecoration: "none" }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="border-top pt-3"
          style={{ borderColor: "rgba(255,255,255,0.2)" }}
        >
          <Copyright />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
