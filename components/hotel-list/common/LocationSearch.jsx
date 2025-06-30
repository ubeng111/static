'use client'; // Ini menandakan komponen ini adalah Client Component di Next.js

import { useState, useEffect, useRef } from 'react';

const LocationSearch = ({ onCitySelect }) => {
  // State untuk nilai input pencarian
  const [searchValue, setSearchValue] = useState('');
  // State untuk menyimpan daftar kota yang ditemukan dari API
  const [cities, setCities] = useState([]);
  // State untuk item yang dipilih (setelah diklik)
  const [selectedItem, setSelectedItem] = useState(null);
  // State untuk mengontrol visibilitas dropdown
  const [isOpen, setIsOpen] = useState(false);

  // Refs untuk mengakses elemen DOM
  const inputRef = useRef(null); // Ref untuk elemen input
  const dropdownRef = useRef(null); // Ref untuk elemen dropdown
  const isFetching = useRef(false); // Ref untuk mencegah multiple fetch saat loading

  // Effect untuk melakukan pencarian kota (debounced)
  useEffect(() => {
    // Jika nilai pencarian kurang dari 2 karakter atau sudah ada item yang dipilih,
    // kosongkan daftar kota dan hentikan proses
    if (searchValue.length < 2 || selectedItem) {
      setCities([]);
      return;
    }

    // Fungsi async untuk mengambil data kota dari API
    const fetchCities = async () => {
      // Jika sedang dalam proses fetching, jangan lakukan fetch lagi
      if (isFetching.current) return;
      isFetching.current = true; // Set status fetching menjadi true

      try {
        // Panggil API `/api/city-id` dengan parameter kota
        const response = await fetch(`/api/city-id?city=${encodeURIComponent(searchValue)}`);
        const data = await response.json(); // Parse respons JSON
        // Set daftar kota berdasarkan respons API
        setCities(response.ok ? data.cities : []);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]); // Kosongkan daftar kota jika ada error
      } finally {
        isFetching.current = false; // Set status fetching menjadi false setelah selesai
      }
    };

    // Debounce agar fetch tidak terlalu sering dipanggil saat mengetik
    const debounce = setTimeout(fetchCities, 300);
    // Cleanup function: batalkan timeout jika komponen unmount atau searchValue berubah
    return () => clearTimeout(debounce);
  }, [searchValue, selectedItem]); // Dependencies: jalankan effect saat searchValue atau selectedItem berubah

  // Handler saat salah satu opsi kota diklik
  const handleOptionClick = (item) => {
    setSearchValue(item.city); // Isi input dengan nama kota yang dipilih
    setSelectedItem({ city: item.city, city_id: item.city_id }); // Simpan item yang dipilih
    setCities([]); // Kosongkan daftar kota
    setIsOpen(false); // Tutup dropdown
    // Panggil callback onCitySelect jika ada
    if (onCitySelect) onCitySelect({ city: item.city, city_id: item.city_id });
    inputRef.current.blur(); // Hilangkan fokus dari input
  };

  // Handler saat nilai input berubah
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value); // Update nilai pencarian
    setIsOpen(true); // Buka dropdown
    // Jika nilai kurang dari 2 karakter, reset selectedItem dan kosongkan daftar kota
    if (value.length < 2) {
      setSelectedItem(null);
      setCities([]);
      if (onCitySelect) onCitySelect(null); // Reset selection di parent
    }
  };

  // Effect untuk menangani klik di luar area dropdown/input
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Jika klik terjadi di luar dropdown dan input, tutup dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    // Tambahkan event listener saat komponen mount
    document.addEventListener('mousedown', handleClickOutside);
    // Cleanup function: hapus event listener saat komponen unmount
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Dependency kosong: jalankan sekali saat mount

  return (
    <div className="searchMenu-loc search-field">
      <label>Location</label>
      <input
        ref={inputRef}
        autoComplete="off"
        type="search"
        placeholder="Where are you going?"
        value={searchValue}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)} // Buka dropdown saat input difokuskan
        className="h-32 px-6 py-2" // Contoh styling dengan Tailwind CSS
      />
      {/* Tampilkan dropdown jika terbuka dan ada minimal 2 karakter atau ada kota yang ditemukan */}
      {isOpen && (searchValue.length >= 2 || cities.length > 0) && (
        <div className="dropdown -is-active" ref={dropdownRef}>
          {/* Tampilkan pesan "City not found" jika tidak ada kota dan pencarian > 2 karakter */}
          {cities.length === 0 && searchValue.length >= 2 && !selectedItem ? (
            <div className="dropdown-item">City not found</div>
          ) : (
            // Render daftar kota yang ditemukan
            cities.map((item) => (
              <div
                key={item.city_id}
                className={`dropdown-item ${selectedItem?.city_id === item.city_id ? 'active' : ''}`}
                onClick={() => handleOptionClick(item)}
              >
                <i className="icon-location-2 text-12 mr-4" /> {/* Contoh ikon */}
                {item.city}{item.country ? `, ${item.country}` : ''}
              </div>
            ))
          )}
        </div>
      )}

      {/* Styling lokal menggunakan styled-jsx */}
      <style jsx>{`
        .searchMenu-loc {
          position: relative; /* Penting untuk positioning absolute anak-anaknya */
        }
        .dropdown {
          position: absolute;
          top: calc(100% + 5px); /* Menempatkan dropdown 5px di bawah input */
          left: 0;
          right: 0; /* Membuat lebar dropdown sama dengan input */
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          z-index: 10; /* Pastikan dropdown di atas elemen lain */
          max-height: 150px; /* Batasi tinggi maksimum */
          overflow-y: auto; /* Aktifkan scroll vertikal jika konten melebihi max-height */
          padding: 5px 0;
        }

        .dropdown-item {
          padding: 8px 12px;
          cursor: pointer;
          font-size: 14px;
          color: #333;
          display: flex;
          align-items: center;
        }

        .dropdown-item.active,
        .dropdown-item:hover {
          background-color: #f0f0f0;
        }

        /* Styling untuk scrollbar (hanya di browser WebKit seperti Chrome/Safari) */
        .dropdown::-webkit-scrollbar {
          width: 8px;
        }

        .dropdown::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 4px;
        }

        .dropdown::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default LocationSearch;