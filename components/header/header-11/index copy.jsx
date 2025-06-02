// index.jsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import MainMenu from '../MainMenu';
import CurrencyMenu from '../CurrencyMenu';
import HeaderSearch from '../HeaderSearch';

const Header1 = () => {
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', changeBackground);
    return () => {
      window.removeEventListener('scroll', changeBackground);
    };
  }, []);

  return (
    <header
      className={`header bg-white ${navbar ? 'is-sticky' : ''}`}
      style={{
        borderBottom: '2px solid #1E90FF',
        boxSizing: 'border-box',
        width: '100%',
      }}
    >
      <div className="header__container"> {/* Remove px-10 sm:px-20 here, handle with CSS */}
        <div className="main-header-row">
          {/* Left Section: Logo and MainMenu */}
          <div className="header-left-group">
            <Link href="/" className="header-logo" aria-label="Hoteloza Hotel Logo">
              <i className="fas fa-hotel logo-icon" aria-hidden="true"></i>
              <span className="logo-text">Hoteloza</span>
            </Link>
            {/* MainMenu: Tampilan berbeda di mobile vs desktop */}
            <div className="header-menu">
              <div className="header-menu__content">
                <MainMenu style="text-dark-1" />
              </div>
            </div>
            {/* Tambahkan placeholder untuk hamburger menu jika diperlukan di sini */}
            {/* <div className="hamburger-menu-icon" style={{display: 'none'}}>☰</div> */}
          </div>

          {/* Right Section: Search and Currency */}
          <div className="header-right-group">
            <div className="search-currency-wrapper">
              <HeaderSearch />
              <CurrencyMenu textClass="text-dark-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Hoteloza',
            description: 'Hoteloza - A premium hotel experience.',
            url: 'https://hoteloza.com',
            logo: 'https://hoteloza.com/img/general/logo-dark-2.svg.',
          }),
        }}
      />

      <style jsx>{`
        .header__container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px; /* Default height */
          padding: 0 40px; /* Default padding */
          box-sizing: border-box; /* Pastikan padding dihitung dalam lebar */
        }

        .main-header-row {
          display: flex;
          width: 100%;
          justify-content: space-between;
          align-items: center;
          flex-wrap: nowrap; /* CRITICAL: Prevent the main header row from wrapping */
        }

        .header-left-group, .header-right-group {
          display: flex;
          align-items: center;
          flex-shrink: 0; /* Hindari penyusutan yang tidak diinginkan */
        }

        .header-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0; /* Logo should never shrink */
        }

        .logo-icon {
          font-size: 22px;
          color: #000000;
          margin-right: 8px;
          transition: color 0.3s ease;
        }

        .logo-text {
          font-family: 'Poppins', sans-serif;
          font-size: 26px;
          font-weight: 500;
          color: #000000;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .header-logo:hover .logo-icon,
        .header-logo:hover .logo-text {
          color: #333333;
        }

        /* MainMenu default: Visible on desktop */
        .header-menu {
          margin-left: 20px; /* Default gap between logo and menu */
          flex-shrink: 1; /* Allow menu to shrink if space is tight */
          min-width: 0; /* Penting untuk flex-shrink */
        }

        .search-currency-wrapper {
          display: flex;
          align-items: center;
          flex-wrap: nowrap; /* CRITICAL: Prevent search and currency from wrapping */
          gap: 15px; /* Default gap */
          flex-shrink: 0; /* Tidak menyusut kecuali terpaksa */
        }

        /* --- Media Queries for Responsiveness --- */

        /* Tablet (768px - 1023px) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .header__container {
            padding: 0 20px;
            height: 55px; /* Slightly shorter */
          }
          .header-menu {
            margin-left: 10px; /* Reduce gap */
            font-size: 0.9em; /* Slightly smaller font if needed */
          }
          .logo-icon {
            font-size: 20px;
          }
          .logo-text {
            font-size: 24px;
          }
          .search-currency-wrapper {
            gap: 10px;
          }
        }

        /* Mobile Large (480px - 767px) */
        @media (max-width: 767px) {
          .header__container {
            padding: 0 10px; /* Reduced padding */
            height: 50px; /* Shorter header height */
          }
          .header-menu {
            display: none; /* Hide MainMenu on these mobile screens (hamburger menu should be here) */
          }
          .logo-icon {
            font-size: 18px;
          }
          .logo-text {
            font-size: 22px;
          }
          .search-currency-wrapper {
            gap: 8px; /* Further reduce gap */
          }
        }

        /* Mobile Small (<= 479px) */
        @media (max-width: 479px) {
          .header__container {
            padding: 0 5px; /* Minimal padding */
            height: 48px; /* Even shorter */
          }
          .logo-icon {
            font-size: 16px;
            margin-right: 5px; /* Reduce logo margin */
          }
          .logo-text {
            font-size: 18px; /* Smallest font for logo text */
          }
          /* .header-menu is already display: none */
          .search-currency-wrapper {
            gap: 5px; /* Minimal gap */
          }
        }
      `}</style>
    </header>
  );
};

export default Header1;