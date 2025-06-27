// MainMenu.jsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"; // Import useEffect dan useState

const MainMenu = ({ style = "", dictionary }) => {
  const pathname = usePathname();
  const navigationDict = dictionary?.navigation || {};

  // State untuk menyimpan base URL
  const [baseUrl, setBaseUrl] = useState('');

  // Dapatkan base URL setelah komponen di-mount di sisi klien
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  // Logika untuk menentukan apakah link saat ini aktif
  const isCurrentHome = pathname === '/';
  const isCurrentAbout = pathname === `/about`;
  const isCurrentContact = pathname === `/contact`;

  // Jangan render menu jika baseUrl belum tersedia (saat SSR)
  if (!baseUrl) {
    return null;
  }

  return (
    <nav className="menu js-navList">
      <ul className={`menu__nav ${style} -is-active`}>
        <li className={isCurrentHome ? "current" : ""}>
          <Link href={`${baseUrl}/`}>
            {navigationDict.home || "Home"}
          </Link>
        </li>
        <li className={isCurrentAbout ? "current" : ""}>
          <Link href={`${baseUrl}/about`}>
            {navigationDict.about || "About Us"}
          </Link>
        </li>
        <li className={isCurrentContact ? "current" : ""}>
          <Link href={`${baseUrl}/contact`}>
            {navigationDict.contact || "Contact"}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainMenu;