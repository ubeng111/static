'use client';
import { useState, useEffect, useMemo } from 'react';

export default function LanguageSwitcher({ currentLang, onChange }) {
  // Daftar lengkap 35 bahasa dengan kode dan nama
  const allLanguages = [
    { code: 'de', name: 'Deutsch (German)' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español (Spanish)' },
    { code: 'ar', name: 'العربية (Arabic)', rtl: true },
    { code: 'bg', name: 'Български (Bulgarian)' },
    { code: 'ms', name: 'Bahasa Melayu (Malay)' },
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'cs', name: 'Čeština (Czech)' },
    { code: 'da', name: 'Dansk (Danish)' },
    { code: 'de-at', name: 'Deutsch (Österreich - Austrian German)' },
    { code: 'en-gb', name: 'English (UK)' },
    { code: 'en-in', name: 'English (India)' },
    { code: 'en-ca', name: 'English (Canada)' },
    { code: 'en-nz', name: 'English (New Zealand)' },
    { code: 'es-mx', name: 'Español (México - Mexican Spanish)' },
    { code: 'fr', name: 'Français (French)' },
    { code: 'el', name: 'Ελληνικά (Greek)' },
    { code: 'he', name: 'עברית (Hebrew)', rtl: true },
    { code: 'it', name: 'Italiano (Italian)' },
    { code: 'ja', name: '日本語 (Japanese)' },
    { code: 'ko', name: '한국어 (Korean)' },
    { code: 'hu', name: 'Magyar (Hungarian)' },
    { code: 'nl', name: 'Nederlands (Dutch)' },
    { code: 'no', name: 'Norsk (Norwegian)' },
    { code: 'pl', name: 'Polski (Polish)' },
    { code: 'pt', name: 'Português (Portuguese)' },
    { code: 'pt-br', name: 'Português (Brasil - Brazilian Portuguese)' },
    { code: 'ro', name: 'Română (Romanian)' },
    { code: 'ru', name: 'Русский (Russian)' },
    { code: 'sv', name: 'Svenska (Swedish)' },
    { code: 'tr', name: 'Türkçe (Turkish)' },
    { code: 'uk', name: 'Українська (Ukrainian)' },
    { code: 'vi', name: 'Tiếng Việt (Vietnamese)' },
    { code: 'th', name: 'ไทย (Thai)' },
    { code: 'id', name: 'Bahasa Indonesia (Indonesian)' },
    { code: 'fr-ca', name: 'Français (Canada - Canadian French)' },
    { code: 'en-au', name: 'English (Australia)' }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter bahasa berdasarkan pencarian
  const filteredLanguages = useMemo(() => {
    return allLanguages.filter(lang => 
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lang.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Dapatkan nama bahasa yang sedang aktif
  const currentLanguageName = allLanguages.find(lang => lang.code === currentLang)?.name || 'English';

  useEffect(() => {
    // Tutup dropdown saat klik di luar
    const handleClickOutside = (e) => {
      if (!e.target.closest('.language-switcher-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="language-switcher-container" style={{ position: 'relative', width: '250px' }}>
      {/* Tombol utama */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '10px 15px',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        <span>{currentLanguageName}</span>
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          ▼
        </span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          marginTop: '5px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {/* Pencarian */}
          <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <input
              type="text"
              placeholder="Cari bahasa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                outline: 'none'
              }}
              autoFocus
            />
          </div>

          {/* Daftar bahasa */}
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <div
                  key={lang.code}
                  onClick={() => {
                    onChange(lang.code);
                    setIsOpen(false);
                  }}
                  style={{
                    padding: '10px 15px',
                    cursor: 'pointer',
                    backgroundColor: currentLang === lang.code ? '#f0f0f0' : 'transparent',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid #f5f5f5',
                    direction: lang.rtl ? 'rtl' : 'ltr'
                  }}
                >
                  <span>{lang.name}</span>
                  <span style={{ 
                    color: '#666', 
                    fontSize: '12px',
                    direction: 'ltr' // Kode bahasa selalu LTR
                  }}>
                    {lang.code}
                  </span>
                </div>
              ))
            ) : (
              <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
                Bahasa tidak ditemukan
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .language-switcher-container button:hover {
          background-color: #e9ecef;
        }
        .language-switcher-container div div:hover {
          background-color: #f8f9fa !important;
        }
        input:focus {
          border-color: #0077ff !important;
          box-shadow: 0 0 0 2px rgba(0, 119, 255, 0.2);
        }
      `}</style>
    </div>
  );
}