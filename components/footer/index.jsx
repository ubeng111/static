// components/footer/index.jsx
import Copyright from "./Copyright";


const Footer = () => {
  // currentLang dan dictionary tidak lagi dibutuhkan di sini karena sudah tidak multi-bahasa
  // const langPrefix = currentLang ? `/${currentLang}` : ''; // Hapus ini

  const categories = {
    "Popular Stays": [
      { name: "Hotel", url: `/hotel` },
      { name: "Villa", url: `/villa` },
      { name: "Resort", url: `/resort` },
      { name: "Apartment", url: `/apartment` },
      { name: "Guest House", url: `/guest-house` },
    ],
    "Unique Stays": [
      { name: "Capsule Hotel", url: `/capsule-hotel` },
      { name: "Yurt", url: `/yurt` },
      { name: "Treehouse", url: `/treehouse` },
      { name: "Tent", url: `/tent` },
      { name: "Dome House", url: `/dome-house` },
    ],
    "Traditional Stays": [
      { name: "Ryokan", url: `/ryokan` },
      { name: "Machiya", url: `/machiya` },
      { name: "Country House", url: `/country-house` },
      { name: "Haveli", url: `/haveli` },
      { name: "Riad", url: `/riad` },
    ],
    "Adventure Stays": [
      { name: "Farm Stay", url: `/farm-stay` },
      { name: "Cabin", url: `/cabin` },
      { name: "Chalet", url: `/chalet` },
      { name: "Boat", url: `/boat` },
      { name: "Houseboat", url: `/houseboat` },
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
                    {/* Menggunakan <a> tag karena ini di footer dan tidak selalu memicu route Next.js */}
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
          {/* PASTIKAN Meneruskan currentLang ke Copyright */}
          {/* Karena multi-bahasa dihapus, dictionary dan currentLang tidak perlu diteruskan lagi */}
          <Copyright />
        </div>
      </div>
    </footer>
  );
};

export default Footer;