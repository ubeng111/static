import Link from "next/link";

const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const TopBreadCrumbCity = ({ hotel, categoryslug, countryslug, stateslug, cityslug }) => {
  if (!hotel && (!categoryslug || !countryslug || !stateslug || !cityslug)) {
    return <div>No breadcrumb data available.</div>;
  }

  const category = hotel?.category || categoryslug || "unknown";
  const country = hotel?.country || countryslug || "unknown";
  const state = hotel?.state || stateslug || "unknown";
  const city = hotel?.city || cityslug || "unknown";
  const baseUrl = `/${category}/${country}/${state}/${city}`;

  return (
    <section className="py-10 d-flex items-center bg-white">
      <div className="container">
        <div className="row y-gap-10 items-center justify-between">
          <div className="col-auto">
            <div className="row x-gap-10 y-gap-5 items-center text-14 text-light-1">
              <div className="col-auto">
                <Link href="/" className="text-blue-1">
                  Home
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                <Link href={`/${category}`} className="text-blue-1">
                  {capitalizeFirstLetter(category)}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                <Link href={`/${category}/${country}`} className="text-blue-1">
                  {capitalizeFirstLetter(country)}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                <Link href={`/${category}/${country}/${state}`} className="text-blue-1">
                  {capitalizeFirstLetter(state)}
                </Link>
              </div>
              <div className="col-auto">
                {capitalizeFirstLetter(city)}
              </div>
            </div>
          </div>

          {/* This is the div that contains the "All [Category] in [City]" link. It has been removed. */}
          {/*
          <div className="col-auto">
            <Link href={baseUrl} className="text-14 text-blue-1 underline">
              All {capitalizeFirstLetter(category) || "Hotels"} in{" "}
              {capitalizeFirstLetter(city)}
            </Link>
          </div>
          */}
        </div>
      </div>
    </section>
  );
};

export default TopBreadCrumbCity;