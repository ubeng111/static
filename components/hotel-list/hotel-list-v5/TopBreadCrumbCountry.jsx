import Link from "next/link";

const capitalizeFirstLetter = (str) => {
  if (!str) return "";
  return str
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const TopBreadCrumbCountry = ({ categoryslug, countryslug }) => {
  return (
    <section className="py-10 d-flex items-center bg-light-2">
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
                <Link href={`/${categoryslug}`} className="text-blue-1">
                  {capitalizeFirstLetter(categoryslug) || "Unknown Category"}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                {capitalizeFirstLetter(countryslug) || "Unknown Country"}
              </div>
            </div>
          </div>

          {/* The following div containing the "All [Category] in [Country]" link has been removed. */}
          {/*
          <div className="col-auto">
            <Link
              href={`/${categoryslug}/${countryslug}`}
              className="text-14 text-blue-1 underline"
            >
              All {capitalizeFirstLetter(categoryslug) || "Hotels"} in{" "}
              {capitalizeFirstLetter(countryslug) || "Unknown Country"}
            </Link>
          </div>
          */}
        </div>
      </div>
    </section>
  );
};

export default TopBreadCrumbCountry;