// Copyright.jsx
import React from 'react';

// Menerima 'dictionary' DAN 'currentLang' sebagai prop
const Copyright = ({ dictionary, currentLang }) => {
  // Tentukan base URL untuk link Hoteloza, menggunakan currentLang
  const hotelozaBaseUrl = `https://hoteloza.com/${currentLang || ''}`; // Fallback ke '' jika currentLang tidak ada

  if (!dictionary || !dictionary.footer || !dictionary.footer.hotelozaAllRightsReserved) {
    return (
      <div className="row justify-between items-center y-gap-10">
        <div className="col-auto">
          <div className="d-flex items-center">
            © {new Date().getFullYear()} by
            <a
              href={hotelozaBaseUrl} // Menggunakan URL dinamis
              className="mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hoteloza
            </a>
            All rights reserved.
          </div>
        </div>
        <div className="col-auto" style={{ marginLeft: 'auto' }}></div>
      </div>
    );
  }

  const copyrightText = dictionary.footer.hotelozaAllRightsReserved.replace('{year}', new Date().getFullYear());

  const parts = copyrightText.split('Hoteloza');

  return (
    <div className="row justify-between items-center y-gap-10">
      <div className="col-auto">
        <div className="d-flex items-center">
          {parts[0]}
          <a
            href={hotelozaBaseUrl} // Menggunakan URL dinamis
            className="mx-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hoteloza
          </a>
          {parts[1]}
        </div>
      </div>
      <div className="col-auto" style={{ marginLeft: 'auto' }}></div>
    </div>
  );
};

export default Copyright;