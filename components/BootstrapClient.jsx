// components/BootstrapClient.jsx
"use client"; // Ini adalah Directive penting untuk komponen sisi klien

import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // Memuat JavaScript Bootstrap hanya setelah komponen di-mount di klien
    // Ini memastikan DOM sudah ada dan siap
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []); // Array dependensi kosong agar hanya berjalan sekali saat mount

  return null; // Komponen ini tidak me-render elemen DOM apapun
}