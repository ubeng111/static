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
      }}
    >
      <div className="header__container px-10 sm:px-20">
        <div className="row items-center flex-row flex-wrap">
          {/* Left Section: Logo and Menu */}
          <div className="col-auto flex justify-center sm:justify-start">
            <div className="d-flex items-center flex-wrap header-left-section">
              <Link href="/" className="header-logo" aria-label="Hoteloza Hotel Logo">
                <i className="fas fa-hotel logo-icon" aria-hidden="true"></i>
                <span className="logo-text">Hoteloza</span>
              </Link>
              <div className="header-menu" style={{ marginLeft: '20px' }}>
                <div className="header-menu__content">
                  <MainMenu style="text-dark-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Search and Currency */}
          <div className="col-auto flex justify-center sm:justify-end">
            <div className="d-flex items-center flex-row gap-5">
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
        .header-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
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

        @media (max-width: 375px) {
          .header__container {
            padding: 0 8px;
          }
          .header-left-section {
            padding-left: 0;
            justify-content: flex-start;
          }
          .header-menu {
            margin-left: 10px;
          }
          .col-auto {
            flex: 0 0 auto;
          }
          .d-flex.items-center.flex-row {
            gap: 5px;
            max-width: 200px;
          }
          .header-logo {
            flex-shrink: 0;
          }
          .logo-icon {
            font-size: 18px;
          }
          .logo-text {
            font-size: 22px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header1;