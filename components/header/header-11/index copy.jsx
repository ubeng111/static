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
      <div className="header__container px-20 sm:px-10">
        <div className="row items-center flex-col sm:flex-row">
          {/* Left Section */}
          <div className="col-auto w-full sm:w-auto flex justify-center sm:justify-start">
            {/* Added 'header-left-section' class here */}
            <div className="d-flex items-center flex-wrap header-left-section">
              {/* Logo */}
              <Link href="/" className="header-logo" aria-label="Hoteloza Hotel Logo">
                <i className="fas fa-hotel logo-icon" aria-hidden="true"></i>
                <span className="logo-text">Hoteloza</span>
              </Link>

              {/* Menu */}
              <div className="header-menu" style={{ marginLeft: '100px' }}>
                <div className="header-menu__content">
                  <MainMenu style="text-dark-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: HeaderSearch (Now moved to the left) */}
          <div className="col-auto w-full sm:w-auto flex justify-center sm:justify-end">
            <div className="d-flex items-center flex-wrap">
              <HeaderSearch />
              <div className="row x-gap-1 items-center">
                <div className="col-auto">
                  <div className="w-1 h-20 bg-white-20" />
                </div>
              </div>
            </div>
          </div>

          {/* Center Section: CurrencyMenu (Now moved to the right) */}
          <div className="col-auto w-full sm:w-auto currency-center-wrapper">
            <CurrencyMenu textClass="text-dark-1" />
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

      {/* CSS for Logo Text and Icon */}
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
    color: #333333; /* Dark gray on hover */
  }

  /* Adjust padding and alignment for the left section */
  @media (min-width: 768px) {
    .header-left-section {
      padding-left: 100px;
      display: flex;
      align-items: center;
    }
  }

  /* Adjustments for smaller screens (iPhone SE) */
  @media (max-width: 640px) {
    .logo-icon {
      font-size: 18px;
    }

    .logo-text {
      font-size: 22px;
    }

    .header-left-section {
      padding-left: 0; /* Remove extra padding */
      justify-content: center; /* Center items on smaller screens */
    }

    .currency-center-wrapper {
      display: flex;
      justify-content: center;
      margin-top: 10px;
      margin-bottom: 10px;
    }

    /* Ensure that the search bar and currency menu are aligned correctly */
    .header-search-wrapper,
    .currency-center-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .row.x-gap-1 {
      justify-content: center;
    }

    .header-menu__content {
      margin-left: 0; /* Remove margin for smaller screens */
    }

    /* Additional tweaks for vertical alignment */
    .col-auto {
      flex: 1 1 auto; /* Allow flex to grow and shrink properly */
      display: flex;
      justify-content: center;
    }
  }
`}</style>
    </header>
  );
};

export default Header1;
