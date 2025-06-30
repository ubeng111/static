import Link from 'next/link';
import './BookNow.css'; // Asumsi kamu punya file CSS terpisah

export default function BookNow({ hotel, hotelId }) {
  // Base Agoda affiliate link
  const baseUrl = 'https://www.agoda.com/partners/partnersearch.aspx';
  // Construct the dynamic URL with hotelId
  const affiliateLink = hotelId 
    ? `${baseUrl}?pcs=1&cid=1935361&hl=en-us&hid=${hotelId}`
    : '/booking'; // Fallback if hotelId is not available

  return (
    <div className="book-now-container">
      <a
        href={affiliateLink}
        className="book-now-button"
        role="button"
        aria-label="Reserve Now!"
        target="_blank"
        rel="noopener noreferrer"
      >
        Reserve Now
      </a>
    </div>
  );
}