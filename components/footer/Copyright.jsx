// Copyright.jsx
import React from 'react'; // React diperlukan untuk JSX

const Copyright = ({ dictionary }) => { // Menerima 'dictionary' sebagai prop
  // Pastikan dictionary dan path ke string terjemahan ada
  if (!dictionary || !dictionary.footer || !dictionary.footer.hotelozaAllRightsReserved) {
    // Sebagai fallback atau penanganan error jika dictionary tidak tersedia
    // Karena ini Server Component, Anda bisa memutuskan untuk tidak merender apa-apa
    // atau merender fallback statis jika ada masalah dengan kamus.
    return (
      <div className="row justify-between items-center y-gap-10">
        <div className="col-auto">
          <div className="d-flex items-center">
            © {new Date().getFullYear()} by
            <a
              href="https://hoteloza.com"
              className="mx-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hoteloza
            </a>
            All rights reserved. {/* Fallback default */}
          </div>
        </div>
        <div className="col-auto" style={{ marginLeft: 'auto' }}></div>
      </div>
    );
  }

  // Mengambil teks hak cipta dari kamus dan mengganti placeholder {year}
  const copyrightText = dictionary.footer.hotelozaAllRightsReserved.replace('{year}', new Date().getFullYear());

  // Memisahkan teks untuk menampilkan "Hoteloza" sebagai tautan
  const parts = copyrightText.split('Hoteloza');

  return (
    <div className="row justify-between items-center y-gap-10">
      <div className="col-auto">
        <div className="d-flex items-center">
          {parts[0]} {/* Bagian sebelum "Hoteloza" */}
          <a
            href="https://hoteloza.com"
            className="mx-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hoteloza
          </a>
          {parts[1]} {/* Bagian setelah "Hoteloza" */}
        </div>
      </div>
      {/* End .col */}

      <div className="col-auto" style={{ marginLeft: 'auto' }}>
        {/* The div below was removed as it contained the links for Privacy, Terms, and Site Map */}
      </div>
      {/* End .col */}
    </div>
  );
};

export default Copyright;