// components/index.jsx (Header1)
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import MainMenu from '../MainMenu';
import CurrencyMenu from '../CurrencyMenu';
import HeaderSearch from '../HeaderSearch';
import Head from 'next/head'; 
import LanguageMenu from '../LanguageMenu';

const Header1 = ({ dictionary, currentLang }) => {
  const [navbar, setNavbar] = useState(false);

  const headerDict = dictionary?.header || {};
  const commonDict = dictionary?.common || {};

  const changeBackground = () => {
    if (typeof window !== 'undefined' && window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', changeBackground);
      return () => {
        window.removeEventListener('scroll', changeBackground);
      };
    }
  }, []);

  return (
    <>
      <Head>
        {/* Existing preloads for fonts */}
        <link rel="preload" href="/fonts/Poppins-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Poppins-Bold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/media/icomoon.178677f7.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/media/slick.653a4cbb.woff" as="font" type="font/woff" crossOrigin="anonymous" />
        
        {/* Existing preconnect for agoda.net */}
        <link rel="preconnect" href="https://pix3.agoda.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pix3.agoda.net" />

        {/* BARIS INI DITAMBAHKAN UNTUK FLAGCDN.COM */}
        <link rel="preconnect" href="https://flagcdn.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://flagcdn.com" />
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
            <div className="header-left-group">
              {/* Pastikan hanya JSX valid di sini. Ikon hotel sudah dikembalikan berdasarkan file yang Anda unggah. */}
              <Link href={`/`} className="header-logo" aria-label="Hoteloza Hotel Logo">
                <i className="fas fa-hotel logo-icon" aria-hidden="true"></i>
                <span className="logo-text">Hoteloza</span>
              </Link>
              <div className="header-menu">
                <div className="header-menu__content">
                  <MainMenu style="text-white" dictionary={dictionary} currentLang={currentLang} />
                </div>
              </div>
            </div>

            <div className="header-right-group">
              <div className="search-currency-wrapper">
                <HeaderSearch dictionary={dictionary} currentLang={currentLang} />
                <CurrencyMenu textClass="text-dark-1" dictionary={dictionary} currentLang={currentLang} />
                <LanguageMenu />
              </div>
            </div>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Hoteloza',
              description: commonDict.callToActionsDescription || 'Hoteloza - A premium hotel experience.',
              url: `https://hoteloza.com/${currentLang}`,
              logo: 'https://hoteloza.com/img/general/logo-dark-2.svg.',
            }),
          }}
        />

        {/* --- MULAI BLOK <style jsx> --- */}
        {/* Pastikan TIDAK ADA KARAKTER APAPUN, termasuk spasi atau komentar JSX, di antara <style jsx>{ dan ` (tanda backtick) */}
        <style jsx>{`
          .header__container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 60px;
            padding: 0 40px;
            box-sizing: border-box;
            transition: height 0.3s ease;
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
            color: #FFFFFF;
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
            font-weight: 700;
            color: #FFFFFF;
            text-decoration: none;
            transition: color 0.3s ease;
            border: 2px solid #FFFFFF;
            border-radius: 4px;
            padding: 2px 6px;
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

          @media (min-width: 768px) and (max-width: 1023px) {
            .header__container {
              padding: 0 20px;
              height: 55px;
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
              font-weight: 700;
              border: 2px solid #FFFFFF;
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
              height: 60px;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              padding-top: 0;
              padding-bottom: 0;
            }
            .main-header-row {
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
              gap: 5px;
            }
            .header-left-group {
              width: auto;
              justify-content: flex-start;
              margin-bottom: 0;
            }
            .header-right-group {
              width: auto;
              justify-content: flex-end;
              margin-bottom: 0;
              flex-grow: 1;
            }
            .header-menu {
              display: none;
            }
            .logo-icon {
              font-size: 18px;
            }
            .logo-text {
              font-size: 22px;
              font-weight: 700;
              border: 2px solid #FFFFFF;
              border-radius: 4px;
              padding: 2px 5px;
            }
            .search-currency-wrapper {
              gap: 5px;
              flex-direction: row;
              flex-wrap: nowrap;
              justify-content: flex-end;
              width: auto;
            }
          }

          @media (max-width: 479px) {
            .header__container {
              padding: 0 5px;
            }
            .logo-icon {
              font-size: 16px;
              margin-right: 5px;
            }
            .logo-text {
              font-size: 18px;
              font-weight: 700;
              border: 2px solid #FFFFFF;
              border-radius: 4px;
              padding: 2px 4px;
            }
            .search-currency-wrapper {
              gap: 5px;
              flex-direction: row;
              flex-wrap: nowrap;
            }
          }
        `}</style>
        {/* --- AKHIR BLOK <style jsx> --- */}
      </header>
    </>
  );
};

export default Header1;