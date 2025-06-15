// get-dictionary.js
import 'server-only';

const dictionaries = {
  'us': () => import('./us.json').then((module) => module.default),
  'es': () => import('./es.json').then((module) => module.default),
  'fr': () => import('./fr.json').then((module) => module.default),
  'it': () => import('./it.json').then((module) => module.default),
  'nl': () => import('./nl.json').then((module) => module.default),
  'de': () => import('./de.json').then((module) => module.default),
  'pl': () => import('./pl.json').then((module) => module.default),
  'bg': () => import('./bg.json').then((module) => module.default),
  'th': () => import('./th.json').then((module) => module.default),
  'hk': () => import('./hk.json').then((module) => module.default),
  'ua': () => import('./ua.json').then((module) => module.default),
  'cz': () => import('./cz.json').then((module) => module.default),
  'dk': () => import('./dk.json').then((module) => module.default),
  'no': () => import('./no.json').then((module) => module.default),
  'se': () => import('./se.json').then((module) => module.default),
  'ro': () => import('./ro.json').then((module) => module.default),
  'tr': () => import('./tr.json').then((module) => module.default),
  'br': () => import('./br.json').then((module) => module.default),
  'my': () => import('./my.json').then((module) => module.default),
  'ru': () => import('./ru.json').then((module) => module.default),
  'id': () => import('./id.json').then((module) => module.default),
  'il': () => import('./il.json').then((module) => module.default),
  'kr': () => import('./kr.json').then((module) => module.default),
  'jp': () => import('./jp.json').then((module) => module.default),
  'cn': () => import('./cn.json').then((module) => module.default),
  'in': () => import('./in.json').then((module) => module.default),
  'mx': () => import('./mx.json').then((module) => module.default),
  'sa': () => import('./sa.json').then((module) => module.default),
  'ch': () => import('./ch.json').then((module) => module.default),
  'za': () => import('./za.json').then((module) => module.default),
  'eg': () => import('./eg.json').then((module) => module.default),
};

// --- START: Default dictionary structures for robust error handling ---
// Pastikan semua properti yang diakses di UI Anda memiliki nilai default di sini.

const defaultCommon = {
  loadingSearchResults: "Loading search results...", loadingCityContent: "Loading city content...",
  loadingHotel: "Loading hotel details...", hotelNotFound: "Hotel not found.", errorServer: "A server error occurred",
  preloaderTitle: "Hoteloza..", failedToLoadHotelList: "Failed to load hotel list. Please try again.",
  cityIdRequired: "City ID is required.", callToActionsDescription: "Good ideas don't last long. Book your Hoteloza trip today!",
  errorLoadingData: "An error occurred while loading data. Please try again later.",
  noHotelsFound: "No hotels found for this category.", noRelatedCategoriesFound: "No related categories found.",
  noRelatedCountriesFound: "No related countries found.", noRelatedStatesFound: "No related provinces found.",
  noRelatedCitiesFound: "No related cities found.", noRelatedHotelsFound: "No related hotels found.",
  unknownAddress: "Unknown Address", unknownCity: "Unknown City", unknownRegion: "Unknown Region",
  unknownCountry: "Unknown Country", unnamedHotel: "Unnamed Hotel", reserveNow: "Reserve Now",
  unknownCategory: "Unknown Category", unknownState: "Unknown Province",
  errorLandmarkNotFound: "Error: Landmark not found in URL. Cannot load.", properties: "properties",
  noDestinationsFound: "No destinations available for this region.",
  topRecommendedHotelsTitle: "Top Recommended {category} in {city}",
  findTopRatedStays: "Find top-rated stays with similar perks near your destination",
  unknownLocation: "Unknown Location", failedToLoadHotelData: "Failed to retrieve hotel data",
  errorWithMessage: "Error: {error}", night: "Night"
};

const defaultHeader = {
  luxuryBackgroundImageAlt: "Luxury background image"
};

const defaultSearch = {
  searchResultAccommodationIn: "Search result for accommodation in {cityName}",
  searchResultPropertiesIn: "Properties found in",
  selectedCity: "Selected City", unknownLocation: "Unknown Location",
  searchParametersIncomplete: "Search parameters incomplete."
};

const defaultCategoryPage = {
  discoverLuxeStaysIn: "Discover Luxe Stays in", faqsAboutHotels: "Frequently Asked Questions {formattedCategory}",
  categoryDefault: "Category", defaultItemListDescription: "A list of top {formattedCategory} for {currentYear} on Hoteloza."
};

const defaultCountryPage = {
  discoverStaysIn: "Discover Stays in {displayCountry}", faqsAboutCountryHotels: "Frequently Asked Questions Hotels in {displayCountry}",
  countryDefault: "Country", noHotelsFoundForCountry: "No hotels found for this country."
};

const defaultStatePage = {
  discoverStaysInState: "Discover Stays in {formattedState}", faqsAboutStateHotels: "Frequently Asked Questions Hotels in {displayState}",
  stateDefault: "Province", noHotelsFoundForState: "No hotels found for this province."
};

const defaultCityPage = {
  discoverStaysInCity: "Discover Stays in {formattedCity}", faqsAboutCityHotels: "Frequently Asked Questions Hotels in {displayCity}",
  cityDefault: "City", noHotelsFoundForCity: "No hotels found for this city."
};

const defaultHotelSinglePage = {
  aboutThisHotel: "About this Hotel", facilitiesAndServices: "Facilities & Services",
  attractionsNearby: "Attractions Nearby", reviews: "Reviews", faq: "FAQ", locationMap: "Location Map",
  frequentlyAskedQuestions: "Frequently Asked Questions", toggleFrequentlyAskedQuestions: "Toggle Frequently Asked Questions",
  toggleLocationMap: "Toggle Location Map", relatedHotels: "Popular properties similar to",
  toggleFacilities: "Toggle Facilities", toggleLandmarks: "Toggle Nearby Landmarks",
  toggleRelatedHotels: "Toggle Popular properties similar to",
  defaultSchemaDescription: "Book {formattedHotel}, a luxury hotel in {formattedCity} for {currentYear} on Hoteloza.",
  exceptionalReviewText: "Exceptional"
};

const defaultBookNow = {
  reserveNowButton: "Reserve Now"
};

const defaultFacilities = {
  bathroom: "Bathroom", towels: "Towels", bathOrShower: "Bath or Shower", privateBathroom: "Private Bathroom",
  toilet: "Toilet", freeToiletries: "Free toiletries", hairdryer: "Hairdryer", bath: "Bath", bedroom: "Bedroom",
  linen: "Linen", wardrobeOrCloset: "Wardrobe or Closet", receptionServices: "Reception Services",
  invoiceProvided: "Invoice Provided", privateCheckInCheckOut: "Private check-in/check-out",
  luggageStorage: "Luggage Storage", twentyFourHourFrontDesk: "24-hour front desk", mediaTechnology: "Media & Technology",
  flatScreenTV: "Flat-screen TV", satelliteChannels: "Satellite Channels", radio: "Radio", telephone: "Telephone",
  tv: "TV", foodDrink: "Food & Drink", kidMeals: "Kid Meals", specialDietMenusOnRequest: "Special diet menus (on request)",
  breakfastInTheRoom: "Breakfast in the room", cleaningServices: "Cleaning Services", dailyHousekeeping: "Daily Housekeeping",
  dryCleaning: "Dry Cleaning", laundry: "Laundry", safetySecurity: "Safety & Security", fireExtinguishers: "Fire extinguishers",
  cctvInCommonAreas: "CCTV in common areas", smokeAlarms: "Smoke alarms", twentyFourHourSecurity: "24-hour security"
};

const defaultLandmarkList = {
  noNearbyPlacesFound: "No nearby places found within {radius} km.",
  nearbyEssentialAndTouristSpots: "🗺️ Nearby Essential & Tourist Spots"
};

const defaultMapComponent = {
  mapTitle: "🗺️ Map {title}"
};

const defaultRelatedCategories = {
  countriesIn: "🏨 Countries in {formattedCategory}"
};

const defaultRelatedCities = {
  noRelatedCitiesFound: "No related cities found",
  bestRelatedCitiesIn: "🏨 Best Related Cities in {formattedState}"
};

const defaultRelatedCountries = {
  noRelatedStatesFound: "No related provinces found",
  statesIn: "🏨 Provinces in {formattedCountry}"
};

const defaultRelatedStates = {
  noRelatedCitiesFound: "No related cities found",
  citiesIn: "🏨 Cities in {formattedState}"
};

const defaultCity = {
  city: "City",
  faq: "FAQ"
};

const defaultMainFilterSearchBox = {
  destinationPlaceholder: "What is your destination?", checkInPlaceholder: "Check-in Date", checkOutPlaceholder: "Check-out Date",
  adultsLabel: "Adults", childrenLabel: "Children", roomsLabel: "Rooms", searchButton: "Search"
};

const defaultFooter = {
  popularStays: "Popular Stays", hotel: "Hotel", villa: "Villa", resort: "Resort", apartment: "Apartment",
  guestHouse: "Guest house", uniqueStays: "Unique Stays", capsuleHotel: "Capsule hotel", yurt: "Yurt",
  treehouse: "Treehouse", tent: "Tent", domeHouse: "Dome house", traditionalStays: "Traditional Stays",
  ryokan: "Ryokan", machiya: "Machiya", countryHouse: "Country house", haveli: "Haveli", riad: "Riad",
  heritageHotel: "Heritage hotel", adventureStays: "Adventure Stays", farmStay: "Farm stay", cabin: "Cabin",
  chalet: "Chalet", boat: "Boat", houseboat: "Houseboat",
  hotelozaFooterText: "Hoteloza is a leading platform for easy and seamless hotel bookings. We simplify your search for the perfect accommodation, offering a diverse selection of stays, from cozy hotels to luxurious resorts. Enjoy the convenience of booking, exclusive deals, and personalised services tailored to your travel needs. Book with Hoteloza and make unforgettable journeys a reality.",
  hotelozaAllRightsReserved: "© {year} Hoteloza. All rights reserved."
};

const defaultMetadata = {
  homePageTitle: "Hoteloza - Find Your Dream Hotel", homePageDescription: "Find the best hotels and accommodation for your next trip. Book now with Hoteloza!",
  searchResultPageTitle: "Hotels in {cityName} - Hoteloza Search Results", searchResultPageDescription: "Search and book hotels in {cityName}. Compare prices and facilities for your best stay.",
  cityPageTitle: "Hotels in {cityName} - Discover {cityName} with Hoteloza", cityPageDescription: "Discover the best hotels in {cityName} and find the best deals for your unforgettable trip with Hoteloza.",
  categoryNotFoundTitle: "Category Not Found | Hoteloza", categoryNotFoundDescription: "The category you are looking for was not found on Hoteloza.",
  categoryPageTitleTemplate: "Best {formattedCategory} Discounts {currentYear} - Save Big at Hoteloza!", categoryPageDescriptionTemplate: "Discover the best {formattedCategory} in {currentYear} with Hoteloza. Enjoy exclusive discounts, great prices, and top-notch facilities. Book now for an unforgettable stay!",
  categoryOgTitleTemplate: "Top {formattedCategory} Deals {currentYear} | Hoteloza", categoryOgDescriptionTemplate: "Explore top {formattedCategory} for {currentYear} on Hoteloza. Book now for exclusive deals and premium facilities!",
  categoryWebPageNameTemplate: "Top {formattedCategory} Deals {currentYear}", categoryWebPageDescriptionTemplate: "Discover top {formattedCategory} for {currentYear} on Hoteloza with exclusive deals and premium facilities.",
  countryNotFoundTitle: "Page Not Found | Hoteloza", countryNotFoundDescription: "The category, country, or province you are looking for was not found on Hoteloza.",
  countryPageTitleTemplate: "Cheap {formattedCategory} in {formattedCountry} {currentYear} - Don't Miss Out! | Hoteloza", countryPageDescriptionTemplate: "Get the best {formattedCategory} in {formattedCountry} for {currentYear} on Hoteloza. Enjoy exclusive deals, affordable prices, and top facilities. Limited offers – book your stay today!",
  countryOgTitleTemplate: "Best {formattedCategory} in {formattedCountry} {currentYear} | Hoteloza", countryOgDescriptionTemplate: "Find the best {formattedCategory} in {formattedCountry} for {currentYear} on Hoteloza. Book now for top hotels and exclusive deals!",
  stateNotFoundTitle: "Page Not Found | Hoteloza", stateNotFoundDescription: "The category, country, or province you are looking for was not found on Hoteloza.",
  statePageTitleTemplate: "Cheap {formattedCategory} in {formattedState}, {formattedCountry} {currentYear} - Book Now! | Hoteloza", statePageDescriptionTemplate: "Find the best {formattedCategory} in {formattedState}, {formattedCountry} for {currentYear} on Hoteloza. Exclusive deals, great prices, and top-notch facilities. Book your unforgettable stay!",
  stateOgTitleTemplate: "Best {formattedCategory} in {formattedState}, {formattedCountry} {currentYear} | Hoteloza", stateOgDescriptionTemplate: "Discover top {formattedCategory} in {formattedState}, {formattedCountry} for {currentYear} on Hoteloza. Book now for exclusive deals and premium facilities!",
  cityNotFoundTitle: "Page Not Found | Hoteloza", cityNotFoundDescription: "The category, country, province, or city you are looking for was not found on Hoteloza.",
  cityPageTitleTemplate: "Cheap {formattedCategory} in {formattedCity}, {formattedState}, {formattedCountry} {currentYear} - Big Discounts! | Hoteloza", cityPageDescriptionTemplate: "Find the best {formattedCategory} in {formattedCity}, {formattedState}, {formattedCountry} for {currentYear} on Hoteloza. Exclusive discounts, top facilities, and unbeatable prices. Book your dream stay now!",
  cityOgTitleTemplate: "Best {formattedCategory} in {formattedCity}, {formattedState}, {formattedCountry} {currentYear} | Hoteloza", cityOgDescriptionTemplate: "Discover top {formattedCategory} in {formattedCity}, {formattedState}, {formattedCountry} for {currentYear} on Hoteloza. Book now for exclusive deals and premium facilities!",
  hotelNotFoundTitle: "Hotel Not Found | Hoteloza", hotelNotFoundDescription: "The hotel you are looking for could not be found.",
  hotelPageTitleTemplate: "{hotelTitle} - Book Now on Hoteloza!", hotelPageDescriptionTemplate: "Book your stay at {hotelTitle} in {city}, {state}, {country}. Find the best deals, facilities, and reviews for an unforgettable experience with Hoteloza.",
  hotelOgTitleTemplate: "{hotelTitle} | Hoteloza", hotelOgDescriptionTemplate: "Find the best deals at {hotelTitle} with Hoteloza."
};

const defaultLandmarkPage = {
  topHotelsNear: "Cheap {category} Near {landmarkName}", landmarkPageTitleTemplate: "Cheap {category} Near {landmarkName}",
  description: "{category} {landmarkName} offers the best accommodation in {cityName}, with great deals and amenities like free WiFi.",
  loadingHotel: "Loading hotel...", errorLoadingHotel: "Error: {error}", hotelNotFound: "Hotel not found.",
  serverErrorFetchingData: "Server error fetching hotel data."
};

const defaultNavigation = {
  home: "Home", about: "About Us", contact: "Contact"
};

const defaultHomepage = {
  dreamDestinations: "Dream Destinations", unforgettableSpots: "Unforgettable spots you’ll want to explore again and again",
  whatOurGuestsTrulyLoveAboutUs: "What Our Guests Truly Love About Us",
  experienceTheMagic: "Experience the magic that keeps millions coming back. At Hoteloza, we’re dedicated to making every stay unforgettable, with ease, care, and exceptional service.",
  hotelozaHeroTitle: "Find, Book, and Relax with Hoteloza", hotelozaHeroSubtitle: "Explore thousands of hotels worldwide with Hoteloza",
  delightedGuests: "Delighted Guests", guestSatisfactionScore: "Guest Satisfaction Score", happyPeople: "Happy People",
  overallRating: "Overall rating"
};

const defaultAbout = {
  lookingForJoy: "Looking for Joy?", trustedTripCompanion: "Your Trusted Trip Companion", whyChooseUs: "Why Choose Us",
  popularDestinationsOffer: "These popular destinations have a lot to offer", overheardFromTravelers: "Overheard From Travellers",
  aboutHotelozaTitle: "About Hoteloza", aboutHotelozaSubtitle: "Discover a world of comfort and elegance",
  aboutHotelozaParagraph1: "Hoteloza is your sanctuary of luxury, offering unparalleled hospitality in the heart of vibrant destinations. Our hotels blend modern elegance with timeless comfort, ensuring every stay is a memorable experience.",
  aboutHotelozaParagraph2: "Immerse yourself in our world-class amenities, from serene spas to exquisite dining, and explore nearby attractions that make every visit unforgettable. Whether for business or leisure, Hoteloza is your home away from home."
};

const defaultBlockGuide = {
  bestPriceGuarantee: "Best Price Guarantee", bestPriceGuaranteeText: "Find your perfect stay at the best possible price – guaranteed. No hidden fees, just real savings every time you book.",
  easyQuickBooking: "Easy & Quick Booking", easyQuickBookingText: "Book your dream hotel in just a few clicks. Fast, simple, and hassle-free – your next getaway starts here.",
  customerSupport: "24/7 Customer Support", customerSupportText: "Need help? Our support team is available around the clock to assist you – wherever and whenever you need it."
};

const defaultContactPage = {
  heroTitle: "Contact Us", heroSubtitle: "We are here to help and answer any questions you may have.",
  getInTouchTitle: "Get in Touch", getInTouchDescription: "Feel free to reach out to us with any questions or concerns. Our team is always ready to assist you.",
  addressLabel: "Address", addressValue: "123 Hoteloza Street, Suite 456, City, Country",
  emailLabel: "Email", emailValue: "info@hoteloza.com", workingHoursLabel: "Working Hours",
  workingHoursValue: "Monday - Friday: 9:00 AM - 5:00 PM (Local Time)"
};

const defaultCallToActions = {
  subscribeHere: "Subscribe Here", yourEmail: "Your Email", subscribeButton: "Subscribe"
};

const defaultTestimonials = {
  sarahMQuote: "Hoteloza is a game-changer! I've found the best hotel deals here consistently. It's truly the best hotel affiliate website globally.",
  sarahMName: "Sarah M.", sarahMDesignation: "Travel Enthusiast",
  data: [], data2: [], data3: []
};

const defaultFaqContent = {
  hotel: {}, category: {}, city: {}, country: {}, landmark: {}, state: {}
};

// --- END: Default dictionary structures ---


export const getdictionary = async (locale) => {
  let dict = {}; // Initialize dict as an empty object

  try {
    // Determine which dictionary loader to use, fallback to 'us' if not found
    const dictLoader = dictionaries[locale] || dictionaries['us'];
    dict = await dictLoader();

    // Ensure dict is a valid object after loading
    if (typeof dict !== 'object' || dict === null) {
      console.warn(`[getDictionary] Loaded dictionary for locale '${locale}' is not a valid object. Initializing with empty object.`);
      dict = {};
    }

  } catch (error) {
    console.error(`[getDictionary] Error loading dictionary for locale ${locale}:`, error);
    // If there's an error loading any dictionary, return a completely default structure
    // This prevents any subsequent TypeError.
    return {
      common: defaultCommon,
      header: defaultHeader,
      search: defaultSearch,
      categoryPage: defaultCategoryPage,
      countryPage: defaultCountryPage,
      statePage: defaultStatePage,
      cityPage: defaultCityPage,
      hotelSinglePage: defaultHotelSinglePage,
      bookNow: defaultBookNow,
      facilities: defaultFacilities,
      landmarkList: defaultLandmarkList,
      mapComponent: defaultMapComponent,
      relatedCategories: defaultRelatedCategories,
      relatedCities: defaultRelatedCities,
      relatedCountries: defaultRelatedCountries,
      relatedStates: defaultRelatedStates,
      city: defaultCity,
      mainFilterSearchBox: defaultMainFilterSearchBox,
      footer: defaultFooter, // Ensure footer is always present
      metadata: defaultMetadata,
      landmarkPage: defaultLandmarkPage,
      navigation: defaultNavigation,
      homepage: defaultHomepage,
      about: defaultAbout,
      blockGuide: defaultBlockGuide,
      contactPage: defaultContactPage,
      callToActions: defaultCallToActions,
      testimonials: defaultTestimonials,
      faqContent: defaultFaqContent,
    };
  }

  // --- START: Merge loaded dictionary with defaults to ensure all expected properties exist ---
  // This helps if a JSON file is missing some properties but the file itself loaded fine.
  dict.common = { ...defaultCommon, ...dict.common };
  dict.header = { ...defaultHeader, ...dict.header };
  dict.search = { ...defaultSearch, ...dict.search };
  dict.categoryPage = { ...defaultCategoryPage, ...dict.categoryPage };
  dict.countryPage = { ...defaultCountryPage, ...dict.countryPage };
  dict.statePage = { ...defaultStatePage, ...dict.statePage };
  dict.cityPage = { ...defaultCityPage, ...dict.cityPage };
  dict.hotelSinglePage = { ...defaultHotelSinglePage, ...dict.hotelSinglePage };
  dict.bookNow = { ...defaultBookNow, ...dict.bookNow };
  dict.facilities = { ...defaultFacilities, ...dict.facilities };
  dict.landmarkList = { ...defaultLandmarkList, ...dict.landmarkList };
  dict.mapComponent = { ...defaultMapComponent, ...dict.mapComponent };
  dict.relatedCategories = { ...defaultRelatedCategories, ...dict.relatedCategories };
  dict.relatedCities = { ...defaultRelatedCities, ...dict.relatedCities };
  dict.relatedCountries = { ...defaultRelatedCountries, ...dict.relatedCountries };
  dict.relatedStates = { ...defaultRelatedStates, ...dict.relatedStates };
  dict.city = { ...defaultCity, ...dict.city };
  dict.mainFilterSearchBox = { ...defaultMainFilterSearchBox, ...dict.mainFilterSearchBox };
  dict.footer = { ...defaultFooter, ...dict.footer }; // KRUSIAL untuk error 'footer'
  dict.metadata = { ...defaultMetadata, ...dict.metadata };
  dict.landmarkPage = { ...defaultLandmarkPage, ...dict.landmarkPage };
  dict.navigation = { ...defaultNavigation, ...dict.navigation };
  dict.homepage = { ...defaultHomepage, ...dict.homepage };
  dict.about = { ...defaultAbout, ...dict.about };
  dict.blockGuide = { ...defaultBlockGuide, ...dict.blockGuide };
  dict.contactPage = { ...defaultContactPage, ...dict.contactPage };
  dict.callToActions = { ...defaultCallToActions, ...dict.callToActions };
  dict.testimonials = { ...defaultTestimonials, ...dict.testimonials };
  dict.faqContent = { ...defaultFaqContent, ...dict.faqContent };
  // --- END: Merge loaded dictionary with defaults ---

  return dict;
};