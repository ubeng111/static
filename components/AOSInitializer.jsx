// components/AOSInitializer.jsx
'use client'; // WAJIB: Ini adalah Client Component

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Pastikan CSS AOS diimpor

const AOSInitializer = ({ children }) => {
  useEffect(() => {
    // Inisialisasi AOS saat komponen di-mount di sisi klien
    AOS.init({
      // Opsi AOS Anda di sini. Sesuaikan sesuai kebutuhan.
      duration: 800, // durasi animasi
      once: true,    // animasi hanya sekali saat di-scroll
      offset: 50,    // memicu animasi 50px sebelum elemen mencapai bagian bawah viewport
      mirror: false, // animasi hanya saat scroll ke bawah
    });
    // Penting: Refresh AOS jika ada perubahan DOM setelah mount awal
    // Misalnya, setelah data dimuat atau komponen lain dirender.
    AOS.refresh();
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat mount

  return <>{children}</>;
};

export default AOSInitializer;