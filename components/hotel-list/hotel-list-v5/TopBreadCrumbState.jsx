import Link from 'next/link';

const capitalizeFirstLetter = (str) => {
  if (!str) return 'Unknown';
  return str
    .replace(/-/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const TopBreadCrumbState = ({ breadcrumbData, stateslug, countryslug }) => {
  // Destructure with fallback values
  const {
    country = countryslug ? capitalizeFirstLetter(countryslug) : 'Unknown',
    state = capitalizeFirstLetter(stateslug),
    countryslug: breadcrumbCountrySlug = countryslug || 'unknown',
    stateslug: breadcrumbStateSlug = stateslug,
  } = breadcrumbData || {};

  // Log warning for debugging
  if (!breadcrumbData?.country || !breadcrumbData?.state || !breadcrumbData?.countryslug || !breadcrumbData?.stateslug) {
    console.warn('Breadcrumb data incomplete, using fallbacks:', { country, state, breadcrumbCountrySlug, breadcrumbStateSlug });
  }

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
                <Link href={`/country/${breadcrumbCountrySlug}`} className="text-blue-1">
                  {country}
                </Link>
              </div>
              <div className="col-auto">&gt;</div>
              <div className="col-auto">
                {state}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopBreadCrumbState;