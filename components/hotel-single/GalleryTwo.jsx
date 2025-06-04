// components/hotel-single/GalleryTwo.jsx
import Image from 'next/image';

const GalleryTwo = ({ hotel }) => {
  const address = (() => {
    if (hotel?.location && hotel?.city && hotel.location.toLowerCase() !== hotel.city.toLowerCase()) {
      return `${hotel.location}`;
    }
    return hotel?.location || 'Location not available';
  })();

  return (
    <section className="pt-10 sm:pt-20 md:pt-40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="row justify-between items-end">
          <div className="col-auto">
            <div className="row x-gap-10 sm:x-gap-20 items-center">
              <div className="col-auto">
                <h1 className="text-24 sm:text-28 md:text-30 fw-600">{hotel?.title}</h1>
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

        <div className="galleryGrid -type-1 pt-20 sm:pt-30 px-0">
          {hotel?.img && (
            <div className="galleryGrid__item">
              <Image
                width={600}
                height={500}
                src={hotel.img}
                alt={`Hotel Image ${hotel?.title}`}
                className="rounded-4"
                loading="eager"
                priority={true}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              />
            </div>
          )}

          {hotel?.slideimg?.slice(0, 4).map((image, index) => (
            <div className="galleryGrid__item" key={index}>
              <Image
                width={450}
                height={375}
                src={image}
                alt={`Slide Image ${index + 1}`}
                className="rounded-4"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {hotel?.overview && (
          <div className="pt-20 sm:pt-30 md:pt-40 px-0">
            <h2 className="text-20 sm:text-22 fw-500 border-top-light mb-10 sm:mb-20">
              Overview {hotel?.title}
            </h2>
            {(() => {
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
            })()}
          </div>
        )}
      </div>
    </section>
  );
};

export default GalleryTwo;