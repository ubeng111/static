import Link from 'next/link';
import './BookNow.css'; // Asumsi kamu punya file CSS terpisah

export default function BookNow({ hotel, hotelId, dictionary }) { // Menerima dictionary
  const bookNowDict = dictionary?.bookNow || {}; // Akses bagian bookNow dari dictionary

  const baseUrl = 'https://www.agoda.com/partners/partnersearch.aspx';
  const affiliateLink = hotelId 
    ? `${baseUrl}?pcs=1&cid=1935361&hl=en-us&hid=${hotelId}` // hl=en-us (language) mungkin perlu dinamis
    : '/booking'; // Fallback if hotelId is not available

  return (
    <div className="book-now-container">
      <a
        href={affiliateLink}
        className="book-now-button"
        role="button"
        aria-label={bookNowDict.reserveNowButton || "Reserve Now!"} // Gunakan dictionary
        target="_blank"
        rel="noopener noreferrer"
      >
        {bookNowDict.reserveNowButton || "Reserve Now"} {/* Gunakan dictionary */}
      </a>
    </div>
  );
}