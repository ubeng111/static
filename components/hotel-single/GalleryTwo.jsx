'use client';

// import Image from 'next/image'; // Hapus import next/image

const GalleryTwo = ({ hotel }) => {
  const address = (() => {
    if (
      hotel?.location &&
      hotel?.city &&
      hotel.location.toLowerCase() !== hotel.city.toLowerCase()
    ) {
      return `${hotel.location}`;
    }
    return hotel?.location || 'Location not available';
  })();

  const renderOverview = () => {
    if (!hotel?.overview) {
      // Render skeleton/placeholder if overview is not available
      return (
        <div className="y-gap-10 sm:y-gap-20 animate-pulse">
          {/* Placeholder untuk 3 paragraf, simulasikan tinggi rata-rata */}
          <div className="h-4 bg-gray-200 rounded w-full mb-2" style={{height: '1em', lineHeight: '1em'}}></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" style={{height: '1em', lineHeight: '1em'}}></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2" style={{height: '1em', lineHeight: '1em'}}></div>
          <div className="h-4 bg-gray-200 rounded w-3/4" style={{height: '1em', lineHeight: '1em'}}></div> {/* Mungkin baris keempat */}
        </div>
      );
    }

    const sentences = hotel.overview.split('.').filter(Boolean);
    const partLength = Math.ceil(sentences.length / 3);
    const part1 = sentences.slice(0, partLength).join('. ') + '.';
    const part2 = sentences.slice(partLength, partLength * 2).join('. ') + '.';
    const part3 = sentences.slice(partLength * 2).join('. ') + '.';
    return (
      <div className="y-gap-10 sm:y-gap-20">
        <p className="text-15 sm:text-17 text-light-1 leading-6 sm:leading-7">{part1}</p>
        <p className="text-15 sm:text-17 text-light-1 leading-6 sm:leading-7">{part2}</p>
        <p className="text-15 sm:text-17 text-light-1 leading-6 sm:leading-7">{part3}</p>
      </div>
    );
  };

  const mainImageUrl = (hotel.img?.replace('http://', 'https://')) || '/images/placeholder.jpg';
  const slideImages = hotel?.slideimg?.slice(0, 4).map(img => (img?.replace('http://', 'https://')) || '/images/placeholder.jpg') || [];

  return (
    <section className="pt-10 sm:pt-20 md:pt-40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hotel Details */}
        <div className="row justify-between items-end">
          <div className="col-auto">
            <div className="row x-gap-10 sm:x-gap-20 items-center">
              <div className="col-auto">
                <h1 className="text-24 sm:text-28 md:text-30 fw-600 line-clamp-1">
                  {hotel?.title}
                </h1>
              </div>
              <div className="col-auto">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="icon-star text-10 text-yellow-1" />
                ))}
              </div>
            </div>
            <div className="row x-gap-10 sm:x-gap-20 y-gap-10 sm:y-gap-20 items-center pt-10 sm:pt-15">
              <div className="col-auto">
                <div className="d-flex items-center text-14 sm:text-15 text-light-1">
                  <i className="icon-location-2 text-14 sm:text-16 mr-5" />
                  {address}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="galleryGrid -type-1 pt-20 sm:pt-30 px-0">
          {mainImageUrl && (
            <div className="galleryGrid__item">
              <img // Menggunakan tag <img> standar
                src={mainImageUrl}
                alt={`Hotel Image ${hotel?.title || 'Unknown'}`}
                width={600} // Tetapkan width
                height={500} // Tetapkan height
                className="rounded-4"
                loading="eager" // Gunakan eager loading untuk gambar LCP
                fetchPriority="high" // Memberi tahu browser untuk memprioritaskan pengambilan
              />
            </div>
          )}

          {slideImages.map((imageSrc, index) => (
            <div className="galleryGrid__item" key={index}>
              <img // Menggunakan tag <img> standar
                src={imageSrc}
                alt={`${hotel?.title || 'Hotel'} - Gallery image ${index + 1}`}
                title={`${hotel?.title || 'Hotel'} - View ${index + 1}`}
                width={450} // Tetapkan width
                height={375} // Tetapkan height
                className="rounded-4"
                loading="lazy" // Tetap lazy loading untuk gambar non-LCP
              />
            </div>
          ))}
        </div>

        {/* Overview Section */}
        <div className="pt-20 sm:pt-30 md:pt-40 px-0 mt-20 sm:mt-40">
          <h2 className="text-20 sm:text-22 fw-500 border-top-light mb-10 sm:mb-20">
            Overview {hotel?.title}
          </h2>
          {renderOverview()}
        </div>
      </div>
    </section>
  );
};

export default GalleryTwo;