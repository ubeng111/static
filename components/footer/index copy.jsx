// components/footer/index.jsx
import Copyright from "./Copyright"; // Mengimpor komponen Copyright

const Footer = ({ dictionary, currentLang }) => { // Footer sudah menerima dictionary dan currentLang sebagai prop
  // Pastikan currentLang memiliki nilai default jika tidak ada, misalnya 'en'
  const langPrefix = currentLang ? `/${currentLang}` : '';

  const categories = {
    [dictionary.footer.popularStays]: [
      { name: dictionary.footer.hotel, url: `${langPrefix}/hotel` },
      { name: dictionary.footer.villa, url: `${langPrefix}/villa` },
      { name: dictionary.footer.resort, url: `${langPrefix}/resort` },
      { name: dictionary.footer.apartment, url: `${langPrefix}/apartment` },
      { name: dictionary.footer.guestHouse, url: `${langPrefix}/guest-house` },
    ],
    [dictionary.footer.uniqueStays]: [
      { name: dictionary.footer.capsuleHotel, url: `${langPrefix}/capsule-hotel` },
      { name: dictionary.footer.yurt, url: `${langPrefix}/yurt` },
      { name: dictionary.footer.treehouse, url: `${langPrefix}/treehouse` },
      { name: dictionary.footer.tent, url: `${langPrefix}/tent` },
      { name: dictionary.footer.domeHouse, url: `${langPrefix}/dome-house` },
    ],
    [dictionary.footer.traditionalStays]: [
      { name: dictionary.footer.ryokan, url: `${langPrefix}/ryokan` },
      { name: dictionary.footer.machiya, url: `${langPrefix}/machiya` },
      { name: dictionary.footer.countryHouse, url: `${langPrefix}/country-house` },
      { name: dictionary.footer.haveli, url: `${langPrefix}/haveli` },
      { name: dictionary.footer.riad, url: `${langPrefix}/riad` },
    ],
    [dictionary.footer.adventureStays]: [
      { name: dictionary.footer.farmStay, url: `${langPrefix}/farm-stay` },
      { name: dictionary.footer.cabin, url: `${langPrefix}/cabin` },
      { name: dictionary.footer.chalet, url: `${langPrefix}/chalet` },
      { name: dictionary.footer.boat, url: `${langPrefix}/boat` },
      { name: dictionary.footer.houseboat, url: `${langPrefix}/houseboat` },
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
                  fontSize: "16px", // Set font size to 16px here
                }}
              >
                {title}
              </h3>
              <ul className="list-unstyled">
                {links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link.url} // Menggunakan URL relatif dengan prefiks bahasa
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
          <Copyright dictionary={dictionary} /> {/* Meneruskan dictionary sebagai prop */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;