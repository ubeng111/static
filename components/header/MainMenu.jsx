// components/MainMenu.jsx
'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
// i18nConfig dan defaultLocale tidak lagi dibutuhkan di sini
// karena kita mengambil currentLang dari prop
// import { i18nConfig, defaultLocale } from '@/config/i18n'; 

const MainMenu = ({ style = "", dictionary, currentLang }) => { 
  const pathname = usePathname();
  const navigationDict = dictionary?.navigation || {};

  // Gunakan `currentLang` yang diterima dari prop
  const activeLocale = currentLang;

  // Logika untuk menentukan apakah link saat ini aktif
  const normalizedPathname = pathname.startsWith('/') ? pathname.substring(1) : pathname;

  const isCurrentHome = normalizedPathname === activeLocale || normalizedPathname === ''; 
  const isCurrentAbout = normalizedPathname === `${activeLocale}/about`;
  const isCurrentContact = normalizedPathname === `${activeLocale}/contact`;

  return (
    <nav className="menu js-navList">
      <ul className={`menu__nav ${style} -is-active`}>
        <li className={isCurrentHome ? "current" : ""}>
          <Link href={`/${activeLocale}`}>
            {navigationDict.home || "Home"}
          </Link>
        </li>
        <li className={isCurrentAbout ? "current" : ""}>
          <Link href={`/${activeLocale}/about`}>
            {navigationDict.about || "About Us"}
          </Link>
        </li>
        <li className={isCurrentContact ? "current" : ""}>
          <Link href={`/${activeLocale}/contact`}>
            {navigationDict.contact || "Contact"}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainMenu;