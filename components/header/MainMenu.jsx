// MainMenu.jsx
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useEffect, useState } from "react"; // Tidak perlu ini lagi karena kita tidak menggunakan window.location.origin secara langsung

const MainMenu = ({ style = "", dictionary }) => {
  const pathname = usePathname();
  const navigationDict = dictionary?.navigation || {};

  // Dapatkan slug bahasa saat ini dari pathname
  // Contoh: '/en/about' -> 'en'
  // Jika tidak ada slug bahasa (misal: '/about' atau '/'), asumsikan defaultLocale jika diperlukan.
  // Namun, karena aplikasi Anda sepertinya selalu menggunakan slug bahasa, ini harus selalu ada.
  const pathSegments = pathname.split('/').filter(Boolean);
  const currentLang = pathSegments[0]; // Ini akan menjadi 'en', 'id', 'gb', dll.

  // Fungsi helper untuk membangun href yang benar dengan slug bahasa
  const buildLocalizedHref = (path) => {
    // Jika path adalah '/', itu adalah halaman utama untuk bahasa tersebut
    if (path === '/') {
      return `/${currentLang}`;
    }
    // Untuk path lainnya, gabungkan slug bahasa dengan path
    return `/${currentLang}${path}`;
  };

  // Logika untuk menentukan apakah link saat ini aktif
  // Kita perlu membandingkan seluruh pathname dengan href yang akan dibuat
  const isCurrentHome = pathname === `/${currentLang}` || pathname === '/'; // Menangani kasus root (jika ada)
  const isCurrentAbout = pathname === `/${currentLang}/about`;
  const isCurrentContact = pathname === `/${currentLang}/contact`;

  return (
    <nav className="menu js-navList">
      <ul className={`menu__nav ${style} -is-active`}>
        <li className={isCurrentHome ? "current" : ""}>
          {/* Untuk link home, arahkan ke slug bahasa saja */}
          <Link href={buildLocalizedHref('/')}>
            {navigationDict.home || "Home"}
          </Link>
        </li>
        <li className={isCurrentAbout ? "current" : ""}>
          {/* Untuk link about, gabungkan slug bahasa */}
          <Link href={buildLocalizedHref('/about')}>
            {navigationDict.about || "About Us"}
          </Link>
        </li>
        <li className={isCurrentContact ? "current" : ""}>
          {/* Untuk link contact, gabungkan slug bahasa */}
          <Link href={buildLocalizedHref('/contact')}>
            {navigationDict.contact || "Contact"}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainMenu;