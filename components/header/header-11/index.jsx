'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import MainMenu from '../MainMenu';
import CurrencyMenu from '../CurrencyMenu';
import HeaderSearch from '../HeaderSearch';
import Head from 'next/head'; // Import Head for preloading fonts

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
    <>
      <Head>
        {/* Preload Poppins font to prevent FOUT/FOIT and associated layout shifts */}
        {/* Adjust the href if your font file path is different (e.g., /fonts/Poppins-Bold.woff2) */}
        <link rel="preload" href="/fonts/Poppins-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Poppins-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Add more preloads if you use other weights/styles of Poppins */}
      </Head>
      <header
        className={`header bg-dark-3 ${navbar ? 'is-sticky' : ''}`}
        style={{
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        <div className="header__container">
          <div className="main-header-row">
            {/* Left Section: Logo and MainMenu */}
            <div className="header-left-group">
              <Link href="/" className="header-logo" aria-label="Hoteloza Hotel Logo">
                <i className="fas fa-hotel logo-icon" aria-hidden="true"></i>
                <span className="logo-text">Hoteloza</span>
              </Link>
              <div className="header-menu">
                <div className="header-menu__content">
                  <MainMenu style="text-white" />
                </div>
              </div>
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
            height: 60px; /* Fixed height for stability */
            padding: 0 40px;
            box-sizing: border-box;
          }

          .main-header-row {
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            flex-wrap: nowrap;
          }

          .header-left-group, .header-right-group {
            display: flex;
            align-items: center;
            flex-shrink: 0;
          }

          .header-logo {
            display: flex;
            align-items: center;
            text-decoration: none;
            flex-shrink: 0;
          }

          .logo-icon {
            font-size: 22px;
            color: #FFFFFF;
            margin-right: 8px;
            transition: color 0.3s ease;
          }

          .logo-text {
            font-family: 'Poppins', sans-serif;
            font-size: 26px;
            font-weight: 700; /* Bold text */
            color: #FFFFFF;
            text-decoration: none;
            transition: color 0.3s ease;
            border: 2px solid #FFFFFF; /* White border around text */
            border-radius: 4px; /* Slight rounding for aesthetics */
            padding: 2px 6px; /* Padding to ensure text fits well within border */
            /* Add font-display: swap to your global CSS or font import */
            /* Example for global CSS: @font-face { font-family: 'Poppins'; font-display: swap; src: url(...); } */
          }

          .header-logo:hover .logo-icon,
          .header-logo:hover .logo-text {
            color: #CCCCCC;
          }

          .header-menu {
            margin-left: 20px;
            flex-shrink: 1;
            min-width: 0;
          }

          .search-currency-wrapper {
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            gap: 15px;
            flex-shrink: 0;
          }

          /* --- Media Queries for Responsiveness --- */

          @media (min-width: 768px) and (max-width: 1023px) {
            .header__container {
              padding: 0 20px;
              height: 55px; /* Fixed height for stability */
            }
            .header-menu {
              margin-left: 10px;
              font-size: 0.9em;
            }
            .logo-icon {
              font-size: 20px;
            }
            .logo-text {
              font-size: 24px;
              font-weight: 700; /* Maintain bold */
              border: 2px solid #FFFFFF; /* Maintain white border */
              border-radius: 4px;
              padding: 2px 5px;
            }
            .search-currency-wrapper {
              gap: 10px;
            }
          }

          @media (max-width: 767px) {
            .header__container {
              padding: 0 10px;
              height: 50px; /* Fixed height for stability */
            }
            .header-menu {
              display: none;
            }
            .logo-icon {
              font-size: 18px;
            }
            .logo-text {
              font-size: 22px;
              font-weight: 700; /* Maintain bold */
              border: 2px solid #FFFFFF; /* Maintain white border */
              border-radius: 4px;
              padding: 2px 5px;
            }
            .search-currency-wrapper {
              gap: 8px;
            }
          }

          @media (max-width: 479px) {
            .header__container {
              padding: 0 5px;
              height: 48px; /* Fixed height for stability */
            }
            .logo-icon {
              font-size: 16px;
              margin-right: 5px;
            }
            .logo-text {
              font-size: 18px;
              font-weight: 700; /* Maintain bold */
              border: 2px solid #FFFFFF; /* Maintain white border */
              border-radius: 4px;
              padding: 2px 4px;
            }
            .search-currency-wrapper {
              gap: 5px;
            }
          }
        `}</style>
      </header>
    </>
  );
};

export default Header1;