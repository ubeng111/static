import Link from "next/link";

const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const TopBreadCrumb88 = ({ hotel }) => {
  if (!hotel) {
    return <div>No hotel data available.</div>;
  }

  const categorySlug = hotel?.categoryslug || "unknown";
  const countrySlug = hotel?.countryslug || "unknown";
  const stateSlug = hotel?.stateslug || "unknown";
  const citySlug = hotel?.cityslug || "unknown";

  return (
    <section className="py-10 d-flex items-center bg-white">
      <div className="container">
        <div className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <nav aria-label="breadcrumb">
              <div className="row x-gap-10 y-gap-5 items-center text-14 text-dark-1">
                {/* Home */}
                <div className="col-auto">
                  <Link href="/" className="text-blue-1">
                    Home
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>

                {/* Category */}
                <div className="col-auto">
                  <Link href={`/category/${categorySlug}`} className="text-blue-1">
                    {capitalizeFirstLetter(hotel?.category) || "Unknown Category"}
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>

                {/* Country */}
                <div className="col-auto">
                  <Link href={`/country/${countrySlug}`} className="text-blue-1">
                    {capitalizeFirstLetter(hotel?.country) || "Unknown Country"}
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>

                {/* State */}
                <div className="col-auto">
                  <Link href={`/state/${stateSlug}`} className="text-blue-1">
                    {capitalizeFirstLetter(hotel?.state) || "Unknown State"}
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>

                {/* City */}
                <div className="col-auto">
                  <Link href={`/city/${citySlug}`} className="text-blue-1">
                    {capitalizeFirstLetter(hotel?.city) || "Unknown City"}
                  </Link>
                </div>
                <div className="col-auto">&gt;</div>

                {/* Hotel Title (current page) */}
                <div className="col-auto">
                  {capitalizeFirstLetter(hotel?.title) || "Untitled Hotel"}
                </div>
              </div>
            </nav>
          </div>

          <div className="col-auto"></div>
        </div>
      </div>
      <style jsx>{`
        .text-blue-1 {
          color: #0055D4; /* Light blue to match typical UI conventions */
        }
        .text-dark-1 {
          color: #333333; /* Unchanged for non-link text */
        }
      `}</style>
    </section>
  );
};

export default TopBreadCrumb88;