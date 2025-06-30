// utils/contentTemplates.js

const contentTemplates = {
  // === Deskripsi Umum untuk Sebuah KATEGORI (misal: "Hotel", "Villa") ===
  // Dirancang untuk halaman kategori root (e.g., /hotel, /villa)
  getCategoryPageDescription: (categoryName = "accommodations") => {
    let descriptionSegments = []; // Will store objects with { subHeader, content }

    switch (categoryName.toLowerCase()) {
      case "hotel":
        descriptionSegments = [
          {
            subHeader: `Seamless Comfort and Elegant Stays`,
            content: `Step into a world of seamless comfort and refined elegance with Hoteloza's exquisite selection of Hotels. From the vibrant pulse of a bustling city center to the tranquil embrace of a serene coastal escape, our hotels are more than just places to stay – they are gateways to unforgettable experiences, meticulously curated for your ultimate relaxation and discovery. We understand that your choice of accommodation sets the tone for your entire journey, and we are committed to providing options that cater to every desire, ensuring a truly remarkable stay.`
          },
          {
            subHeader: `World-Class Amenities and Services`,
            content: `Imagine waking up to the soft rustle of premium linens, the aroma of freshly brewed coffee delivered to your room, and the promise of a day filled with exploration. Our hotels offer everything from world-class dining experiences where culinary artistry takes center stage, featuring menus crafted by renowned chefs and ambiance designed for memorable evenings. Beyond the plate, you can indulge in rejuvenating spa facilities designed to melt away your stresses with holistic treatments, or push your limits at state-of-the-art fitness centers. Whether you seek vibrant nightlife just steps from your lobby, a quiet retreat with impeccable room service, or a business hub with seamless connectivity, every desire is anticipated and expertly fulfilled.`
          },
          {
            subHeader: `Exceptional Quality and Guest Satisfaction`,
            content: `Hoteloza prides itself on offering hotels that boast top-tier amenities and services. Expect round-the-clock concierge assistance ready to fulfill any request, from booking theater tickets to arranging private tours. Many properties feature sparkling swimming pools, often with stunning cityscapes or ocean views, perfect for a refreshing dip or leisurely sunbathing. Reliable high-speed Wi-Fi is standard, ensuring you stay connected whether for work or leisure. We meticulously feature properties known for their exceptional guest satisfaction, consistently reflected in their high ratings and glowing reviews, assuring you of a quality experience.`
          },
          {
            subHeader: `Diverse Styles for Every Traveler`,
            content: `Our extensive catalog of hotels spans every conceivable style and budget. For those seeking opulence, we offer luxury hotels with personalized butler services, exclusive club lounges, and sophisticated design. Business travelers will find properties equipped with comprehensive meeting facilities, executive floors, and convenient access to commercial districts. Families can delight in hotels with dedicated kids' clubs, child-friendly pools, and spacious connecting rooms, ensuring comfort for everyone. We also highlight boutique hotels that offer unique design, local character, and an intimate atmosphere, perfect for a truly immersive cultural experience.`
          },
          {
            subHeader: `Why Book Your Hotel with Hoteloza?`,
            content: `With Hoteloza, your perfect hotel stay is just a few clicks away. We simplify your search with intuitive filters that allow you to narrow down options by amenities, star ratings, and location. Our transparent pricing ensures you see the true cost upfront, and we offer exclusive deals and packages you won't find anywhere else, guaranteeing the best value. Our dedicated support team is always on hand, 24/7, to assist with any queries or ensure your booking experience is as flawless as your stay. Discover why millions of travelers trust Hoteloza to find their ideal home away from home, making every journey memorable and stress-free.`
          },
          {
            subHeader: `Your Unforgettable Hotel Experience Awaits`,
            content: `Ready to find your next unforgettable hotel experience? Explore Hoteloza's extensive collection today and unlock the door to comfort, convenience, and captivating journeys. Your perfect stay, crafted to exceed every expectation, awaits.`
          },
        ];
        break;
      case "villa":
        descriptionSegments = [
          {
            subHeader: `Your Private Paradise`,
            content: `Unlock the doors to your private paradise with Hoteloza's stunning collection of Villas. Designed for those who crave space, privacy, and personalized luxury, our villas offer an unparalleled retreat, perfect for intimate family gatherings, grand celebrations with friends, or a serene romantic escape amidst breathtaking landscapes. Each villa is a sanctuary, offering a unique blend of sophisticated design, ultimate comfort, and secluded tranquility, ensuring a truly exclusive getaway.`
          },
          {
            subHeader: `Unparalleled Indulgence and Freedom`,
            content: `Picture yourself lounging by your private infinity pool, the sun warming your skin, a gentle breeze rustling through lush tropical gardens. Inside, expansive living areas invite relaxation, adorned with bespoke furnishings and local art, while gourmet kitchens set the stage for culinary adventures, perhaps with a private chef at your service crafting exquisite meals. From sunrise yoga on your private terrace overlooking rolling hills to bespoke excursions arranged just for you, every moment is crafted for pure indulgence and unparalleled freedom, allowing you to set your own pace for relaxation and discovery.`
          },
          {
            subHeader: `Generous Layouts and High-End Finishes`,
            content: `Our villas stand apart with their generous layouts, often featuring multiple bedrooms with en-suite bathrooms, private gardens, and secluded outdoor spaces. Expect high-end finishes, sophisticated architectural design, and modern conveniences seamlessly integrated into your secluded haven. Many offer stunning views of oceans, mountains, vineyards, or pristine natural reserves, providing a picturesque backdrop to your escape. Dedicated staff, including housekeepers, gardeners, and often a villa manager, ensure every need is met with discreet efficiency, guaranteeing a truly pampered experience.`
          },
          {
            subHeader: `Unmatched Flexibility for Your Stay`,
            content: `The flexibility of a villa stay is unmatched. You have the freedom to dine whenever you please, host private events, or simply enjoy undisturbed peace. Our portfolio includes beachfront villas perfect for sun-seekers, hillside retreats offering panoramic vistas, and secluded countryside estates ideal for a quiet family reunion. We also feature villas with unique architectural styles, from minimalist contemporary designs to charming traditional structures, each offering a distinct ambiance. Many properties provide additional services like in-villa spa treatments, private cooking classes, and organized local tours, enhancing your personalized luxury experience.`
          },
          {
            subHeader: `Why Choose Hoteloza for Your Villa?`,
            content: `Hoteloza provides exclusive access to a meticulously curated portfolio of villas, handpicked for their exceptional quality, prime locations, and unique character. We offer comprehensive details, high-resolution images, and virtual tours to give you a true sense of your chosen retreat. Our transparent pricing and secure booking process ensure peace of mind, while our dedicated concierge team can assist with every detail, from pre-stocking your pantry to organizing bespoke excursions and transportation, ensuring a flawless and memorable vacation from start to finish. Discover why discerning travelers choose Hoteloza for their ultimate private escape.`
          },
          {
            subHeader: `Your Ultimate Private Escape`,
            content: `Yearning for a private escape where every detail is tailored to you, and luxury knows no bounds? Explore Hoteloza's collection of exquisite villas and transform your vacation dreams into a luxurious reality. Your private sanctuary, designed for unforgettable moments, awaits.`
          },
        ];
        break;
      case "resort":
        descriptionSegments = [
          {
            subHeader: `Boundless Leisure and Comprehensive Luxury`,
            content: `Dive into a world of boundless leisure and comprehensive luxury at Hoteloza's magnificent Resorts. Designed as self-contained havens, our resorts offer an all-encompassing vacation experience, blending world-class amenities, diverse dining, and endless activities, all set against backdrops of stunning natural beauty. From sprawling beachfront properties to secluded mountain retreats, every resort in our collection is crafted to provide a truly immersive and effortless holiday.`
          },
          {
            subHeader: `A Symphony of Relaxation and Adventure`,
            content: `Imagine days filled with exhilarating water sports like snorkeling, kayaking, or paddleboarding in crystal-clear waters, or challenging yourself on championship golf courses surrounded by breathtaking scenery. For relaxation, indulge in blissful hours unwinding at a luxurious spa, where expert therapists melt away your stresses with an array of treatments. Evenings come alive with gourmet dining across multiple specialty restaurants, vibrant live entertainment, and leisurely strolls along pristine beaches under a starlit sky. Kids' clubs and dedicated activity programs keep younger guests enchanted, ensuring peace of mind and boundless fun for adults. It's a symphony of relaxation, adventure, and culinary delight, all within easy reach of your luxurious accommodation.`
          },
          {
            subHeader: `Expansive Grounds and Meticulous Facilities`,
            content: `Our resorts are distinguished by their expansive grounds and meticulously maintained facilities. Expect multiple swimming pools, often including impressive infinity pools with panoramic views, dedicated children's pools with splash parks, and tranquil adult-only areas. A variety of restaurants and bars cater to every palate, from casual poolside snacks to fine-dining experiences. Many offer all-inclusive packages for a truly worry-free vacation, encompassing meals, drinks, and activities, ensuring every desire is met without an extra thought or hidden cost. Beyond the tangible, our resorts pride themselves on exceptional service, with attentive staff committed to making your stay seamless and memorable.`
          },
          {
            subHeader: `Variety and Convenience for Every Traveler`,
            content: `The beauty of a resort stay lies in its convenience and variety. You can spend your entire vacation within the property, enjoying a full spectrum of experiences, or use it as a luxurious base for exploring nearby attractions. Our selection includes eco-resorts committed to sustainability, family resorts with extensive childcare facilities, and romantic adult-only resorts perfect for honeymoons or anniversaries. We feature properties in exotic beach destinations, lush tropical forests, and serene mountain settings, each offering unique activities such as guided nature walks, cultural workshops, and local excursions. Whether your ideal vacation involves non-stop adventure or ultimate relaxation, our resorts are designed to exceed your expectations.`
          },
          {
            subHeader: `Why Book Your Resort with Hoteloza?`,
            content: `Hoteloza offers an unparalleled selection of top-tier resorts, each vetted for their commitment to guest satisfaction, exceptional quality, and diverse offerings. Our platform provides comprehensive details on amenities, activity schedules, dining options, and package inclusions, empowering you to choose the resort that perfectly aligns with your vacation aspirations. Benefit from competitive rates, exclusive deals, and a seamless booking process, making your dream getaway effortlessly achievable. Our dedicated customer support team is always available to assist you, ensuring every aspect of your resort vacation is perfectly planned and executed.`
          },
          {
            subHeader: `Your All-Inclusive Escape Starts Here`,
            content: `Ready to surrender to complete relaxation, indulge in gourmet delights, and embrace endless fun? Explore Hoteloza's collection of world-class resorts and embark on a vacation where every moment is a celebration of leisure and luxury. Your all-inclusive escape, designed for ultimate enjoyment, starts here.`
          },
        ];
        break;
      case "apartment":
        descriptionSegments = [
          {
            subHeader: `Experience Authentic Local Life`,
            content: `Experience the authentic rhythm of local life with Hoteloza's diverse selection of Apartments. Offering more than just a place to sleep, our apartments provide the space, flexibility, and comforts of home, making them ideal for longer stays, family trips, or those who simply wish to live like a local and fully immerse themselves in the destination's unique culture.`
          },
          {
            subHeader: `Freedom and Immersion`,
            content: `Picture mornings sipping freshly brewed coffee on your private balcony overlooking a bustling piazza, or evenings creating your own culinary masterpieces in a fully equipped kitchen with ingredients sourced from a nearby local market. Enjoy separate living areas for relaxation, comfortable bedrooms for peaceful sleep, and the freedom to set your own schedule, truly immersing yourself in the destination's unique charm without the constraints of a traditional hotel. This flexibility allows for a more personalized and often more budget-friendly travel experience, especially for extended visits.`
          },
          {
            subHeader: `More Space, More Amenities`,
            content: `Our apartments stand out with their generous layouts, providing significantly more space than a standard hotel room. They often feature multiple bedrooms, ideal for families or groups, along with essential amenities like fully equipped kitchens, modern laundry facilities, and reliable high-speed internet. This unique blend of privacy and convenience allows you to settle in, unpack properly, and experience the destination at your own pace. Many properties offer a genuine residential feel, located in vibrant neighborhoods where you can truly blend in with daily life, rather than just passing through as a tourist.`
          },
          {
            subHeader: `Diverse Choices for Every Need`,
            content: `Hoteloza's portfolio of apartments spans a wide spectrum, from chic urban studios perfect for solo travelers or couples, to sprawling family residences ideal for larger groups. We feature properties with stunning city views, apartments nestled in historic districts, and contemporary units in modern complexes. Beyond the basic amenities, many apartments offer additional services such as regular housekeeping, concierge assistance, and access to building facilities like gyms or communal lounges. This provides a balance between independent living and hotel-like convenience. We also highlight apartments that are particularly well-suited for remote workers, offering dedicated workspaces and strong internet connections.`
          },
          {
            subHeader: `Why Book Your Apartment with Hoteloza?`,
            content: `Hoteloza provides a handpicked selection of quality apartments, each carefully vetted for their comfort, location, and guest satisfaction. Our detailed listings offer clear information on facilities, precise location details, and authentic guest reviews, ensuring complete transparency before you book. We simplify your search with intuitive filters, allowing you to narrow down options based on your specific needs, such as number of bedrooms, kitchen appliances, or desired neighborhood. Our secure booking process and dedicated customer support team ensure peace of mind, knowing you've found a comfortable, authentic, and cost-effective base for your travels. Discover why discerning travelers choose Hoteloza for their independent and immersive journeys.`
          },
          {
            subHeader: `Your Independent and Immersive Journey`,
            content: `Ready to embrace local living and enjoy the freedom of a home away from home? Explore Hoteloza's wide range of apartments and unlock a deeper, more personalized travel experience. Your comfortable, independent stay, designed for true immersion, awaits.`
          },
        ];
        break;
      case "guest house":
        descriptionSegments = [
          {
            subHeader: `Genuine Warmth and Local Charm`,
            content: `Discover genuine warmth and local charm with Hoteloza's curated collection of Guesthouses. These intimate accommodations offer a heartfelt alternative to larger hotels, providing personalized service, a cozy atmosphere, and often, invaluable insights and recommendations from local hosts who are eager to share the best of their home and culture.`
          },
          {
            subHeader: `Personalized Stays and Cultural Exchange`,
            content: `Imagine starting your day with a homemade breakfast, perhaps sharing stories and travel tips with your hosts or fellow travelers, before venturing out to explore. Return to a tranquil haven that feels more like visiting a friend's home than a commercial lodging, where every detail contributes to a sense of belonging. These stays often feature unique, charming decor, reflecting the true spirit of the region, ensuring every moment feels personal and authentic. You'll find yourself not just observing, but truly participating in the local way of life, with opportunities for spontaneous cultural exchanges.`
          },
          {
            subHeader: `Intimate Scale and Unique Character`,
            content: `Guesthouses distinguish themselves through their intimate scale, unique character, and the profound personal touch provided by their owners or caretakers. Expect comfortable, often uniquely decorated rooms that might feature local crafts or traditional designs, communal areas that foster connection and conversation, and a deep sense of local hospitality. Unlike impersonal large hotels, guesthouses offer a more personal connection, making you feel welcomed and cared for. Many provide valuable local insights, recommending hidden gems, authentic eateries, and experiences off the beaten path that truly enrich your journey.`
          },
          {
            subHeader: `Diverse Options for Authentic Exploration`,
            content: `Hoteloza's portfolio of guesthouses spans a wide variety, from quaint countryside cottages to charming urban townhouses. We feature guesthouses that might offer cooking classes showcasing local cuisine, traditional craft workshops, or guided tours led by the hosts themselves. This provides an opportunity for a truly immersive and educational travel experience. Guesthouses are typically more budget-friendly than hotels while still offering essential amenities like clean rooms, private bathrooms (though some may be shared), and Wi-Fi. They are particularly popular among solo travelers, couples, and those seeking authenticity and a strong connection with the local community.`
          },
          {
            subHeader: `Why Book Your Guesthouse with Hoteloza?`,
            content: `Hoteloza handpicks guesthouses known for their exceptional hospitality, genuine local experiences, and high guest satisfaction. Our platform provides detailed descriptions and authentic guest reviews, allowing you to choose a guesthouse that resonates with your desire for a personal, cozy, and culturally rich stay. We highlight the unique aspects of each property, from its architectural style to the special services offered by its hosts. Our secure booking process and dedicated customer support ensure a smooth experience, making it easy to connect with these charming properties and secure your memorable visit.`
          },
          {
            subHeader: `Your Intimate and Enriching Escape`,
            content: `Yearning for a travel experience filled with authentic charm, personal touches, and true local immersion? Explore Hoteloza's collection of delightful guesthouses and open the door to genuine hospitality and profound local discoveries. Your intimate and enriching escape begins here.`
          },
        ];
        break;
      case "capsule hotel":
        descriptionSegments = [
          {
            subHeader: `Efficiency Meets Modern Comfort`,
            content: `Step into the innovative world of Capsule Hotels with Hoteloza, where efficiency meets modern comfort in prime urban landscapes. Perfect for the solo explorer, digital nomad, or budget-conscious traveler, these unique accommodations offer a futuristic and incredibly convenient base for navigating bustling cities, providing a smart solution for maximizing your urban adventure.`
          },
          {
            subHeader: `Smart Design for Optimal Rest`,
            content: `Experience the novelty of your own compact, private pod, ingeniously designed to maximize space and efficiency. Each capsule typically comes equipped with essential amenities like personal lighting controls, power outlets for your devices, a small flat-screen TV, and sometimes even a personal fan. After a day of intense sightseeing, business meetings, or vibrant urban exploration, retreat to your quiet, personal capsule for a surprisingly comfortable and uninterrupted rest, recharging efficiently for the next adventure. The ingenious design makes the most of every inch, offering a unique blend of privacy and communal convenience.`
          },
          {
            subHeader: `Unbeatable Urban Locations`,
            content: `Capsule hotels are defined by their ingenious use of space, providing secure, individual sleeping compartments stacked in rows within a larger facility. They often feature shared, immaculate bathroom facilities that are regularly cleaned, spacious common lounge areas ideal for relaxation, work, or socializing, and secure lockers for storing your luggage and valuables. Their key appeal lies not only in their affordability but also in their unbeatable locations, often situated just steps away from major transport hubs, iconic landmarks, and bustling entertainment districts, ensuring you're always at the heart of the action with minimal commute time.`
          },
          {
            subHeader: `Beyond the Pod: Community and Convenience`,
            content: `While the sleeping space is compact, the communal areas in many capsule hotels are often quite modern and spacious, including cafes, co-working spaces, and laundry facilities. This setup fosters a unique social environment, allowing travelers to connect with like-minded individuals from around the globe. Despite their minimalist nature, a surprising level of comfort is provided through high-quality mattresses, fresh linens, and effective soundproofing in many capsules. They are a prime example of innovative urban living, offering a practical and intriguing alternative to traditional hotel rooms, especially in high-density cities where space is at a premium. They are particularly favored by those looking to experience a city without overspending on accommodation, or simply seeking a novel travel experience.`
          },
          {
            subHeader: `Why Book Your Capsule Hotel with Hoteloza?`,
            content: `Hoteloza offers a carefully selected range of capsule hotels, prioritizing cleanliness, safety, strategic location, and positive guest experiences. Our detailed listings provide clear insights into what to expect from each property, including capsule size, amenities, and communal facilities, ensuring there are no surprises. We make it easy to book this modern marvel, offering competitive rates for a smart and unique urban stay. Our platform simplifies the selection process, allowing you to quickly find an efficient and exciting base for your city explorations. Trust Hoteloza to guide you to the best in compact, convenient accommodation.`
          },
          {
            subHeader: `Your Cutting-Edge Urban Adventure`,
            content: `Ready for a cutting-edge urban adventure that's both efficient and unforgettable? Explore Hoteloza's collection of ingenious capsule hotels and experience the future of smart travel. Your compact comfort, perfectly positioned for discovery, awaits.`
          },
        ];
        break;
      case "yurt":
        descriptionSegments = [
          {
            subHeader: `Glamping in Breathtaking Nature`,
            content: `Embrace the spirit of adventure and the allure of the wild with Hoteloza's enchanting collection of Yurts. These unique, circular dwellings offer a glamping experience like no other, blending the timeless tradition of nomadic shelters with the comforts and luxuries of modern accommodation, all set in truly breathtaking natural landscapes that invite profound connection.`
          },
          {
            subHeader: `Immersive Tranquility and Starlit Nights`,
            content: `Imagine waking inside a beautifully crafted, spacious tent-like structure, sunlight streaming through its central dome (or "tüynük"), illuminating cozy furnishings and unique decor. Step outside to immerse yourself in untouched nature – perhaps the whisper of the wind through forest leaves, the distant call of wildlife, or the gentle babble of a nearby stream. Evenings promise vast, starlit skies, free from light pollution, and the comforting warmth of a crackling wood-burning stove within your yurt, creating moments of pure tranquility and profound connection with the natural world. It’s an opportunity to truly disconnect and rejuvenate.`
          },
          {
            subHeader: `Rustic Charm Meets Unexpected Luxury`,
            content: `Our yurts are far from basic camping; they represent the epitome of glamping. They typically feature comfortable beds with plush bedding, often include heating or cooling systems for year-round comfort, and some even boast private en-suite bathrooms for added convenience. Each yurt offers a unique blend of rustic charm and unexpected luxury, providing an intimate, immersive nature experience without sacrificing convenience or style. The circular design often creates a cozy and harmonious interior, fostering a sense of peace and warmth, distinct from any traditional lodging.`
          },
          {
            subHeader: `Scenic Locations and Outdoor Activities`,
            content: `The locations of our yurts are carefully chosen for their scenic beauty and the unique outdoor activities they offer. You might find yurts nestled in serene forests, perched on mountainsides with panoramic views, or situated near tranquil lakes ideal for kayaking or fishing. Many properties offer additional amenities such as communal fire pits for evening gatherings, outdoor seating areas, and access to hiking or biking trails directly from your doorstep. Some even provide gourmet meal delivery services or opportunities to participate in local ecological programs, enriching your stay with meaningful experiences. They are perfect for eco-tourism, romantic getaways, or family adventures seeking something beyond the ordinary.`
          },
          {
            subHeader: `Why Book Your Yurt with Hoteloza?`,
            content: `Hoteloza handpicks yurts that offer exceptional quality, stunning locations, and a truly memorable glamping adventure. Our detailed listings provide comprehensive insights into the specific amenities, the surrounding natural environment, and the unique activities available, ensuring you choose the perfect escape that aligns with your vision. We simplify your booking process, offering secure transactions and dedicated customer support, making it easy to find your unique circular haven and embark on an unforgettable outdoor journey with complete peace of mind.`
          },
          {
            subHeader: `Your Distinctive Nature Escape`,
            content: `Yearning for a distinctive escape that harmonizes comfort with the wild, under a blanket of stars? Explore Hoteloza's collection of extraordinary yurts and redefine your connection with nature. Your glamping adventure, filled with unique moments and serene beauty, begins now.`
          },
        ];
        break;
      case "treehouse":
        descriptionSegments = [
          {
            subHeader: `Magical Elevated Sanctuaries`,
            content: `Fulfill your wildest childhood dreams with Hoteloza's magical collection of Treehouses. Perched high among the canopies, these elevated sanctuaries offer an unparalleled sense of whimsy, seclusion, and breathtaking views, inviting you to connect with nature from a truly unique and enchanting perspective, far removed from the everyday hustle.`
          },
          {
            subHeader: `Wake Up to Nature's Embrace`,
            content: `Picture yourself waking to the gentle sway of the trees, the melodious chirping of birds, and sunlight filtering softly through the leaves into your cozy, elevated abode. Spend your days exploring winding forest trails below, discovering local flora and fauna, or simply unwinding on your private balcony or deck, observing local wildlife in their natural habitat. Evenings are transformed into starlit spectacles, far from city lights, offering moments of pure enchantment, peaceful reflection, and perhaps the comforting sounds of the forest coming alive after dusk. It’s an experience that awakens the inner child and rejuvenates the soul.`
          },
          {
            subHeader: `Innovative Design and Unique Comfort`,
            content: `Our treehouses are ingeniously designed, ranging from rustic, handcrafted cabins with simple charm to sophisticated architectural marvels equipped with every luxury. Many feature comfortable beds, private en-suite bathrooms, small kitchenettes for light meals, and charming balconies or expansive decks that extend your living space into the treetops. They provide an intimate connection with the natural environment while offering surprising levels of comfort, privacy, and architectural innovation, making them ideal for romantic getaways, adventurous solo travelers, or unique family escapes seeking an extraordinary stay.`
          },
          {
            subHeader: `Beyond the Branches: Activities and Sustainability`,
            content: `The locations of our treehouses are as diverse as their designs, found in lush forests, overlooking serene lakes, or nestled within private woodlands. Beyond the unique lodging itself, many properties offer additional activities such as guided nature walks, zip-lining experiences, birdwatching tours, or even private yoga sessions among the branches. Some provide opportunities for stargazing, campfires, or outdoor dining at elevation. These unique stays often emphasize sustainability and minimal environmental impact, allowing guests to enjoy nature responsibly. They are particularly sought after by those looking for a truly memorable anniversary, a surprise romantic gesture, or simply an unforgettable escape from the ordinary.`
          },
          {
            subHeader: `Why Book Your Treehouse with Hoteloza?`,
            content: `Hoteloza curates a special selection of treehouses, chosen for their unique design, stunning locations, their commitment to providing a magical experience, and often, their sustainable practices. Our platform offers comprehensive details, high-quality images, and authentic guest reviews, helping you select the perfect arboreal retreat that resonates with your adventurous spirit. We streamline the booking process, ensuring your elevated escape is as seamless as it is magical, with secure transactions and dedicated support to assist you every step of the way.`
          },
          {
            subHeader: `Your Elevated Escape Awaits`,
            content: `Ready to climb into an extraordinary adventure and sleep among the stars, surrounded by nature's embrace? Explore Hoteloza's collection of enchanting treehouses and discover a truly unique way to experience the world. Your elevated escape, designed for dreams and wonder, awaits.`
          },
        ];
        break;
      case "tent":
        descriptionSegments = [
          {
            subHeader: `Redefine Your Outdoor Experience`,
            content: `Redefine your outdoor experience with Hoteloza's luxurious collection of Tents, specializing in the growing world of glamping. Forget traditional roughing it; these accommodations blend the thrill of connecting with nature with the indulgence of high-end comfort and sophisticated amenities, setting a new standard for adventurous yet utterly comfortable travel.`
          },
          {
            subHeader: `Immersive Wilderness, Unmatched Comfort`,
            content: `Imagine stepping into a spacious, beautifully furnished canvas tent, complete with a real bed, plush linens, stylish furniture, and often, en-suite bathroom facilities, complete with hot showers. Days can be spent exploring pristine wilderness, engaging in outdoor activities, or simply unwinding with a book amidst breathtaking scenery, followed by evenings enjoying gourmet meals cooked over an open fire or served by dedicated staff. The rustle of leaves, the scent of pine, and the vast starlit sky become your nightly companions, creating an immersive yet comfortable wilderness experience that truly rejuvenates the soul.`
          },
          {
            subHeader: `Thoughtful Design and Unexpected Amenities`,
            content: `Our glamping tents stand out with their thoughtful design and unexpected amenities, elevating the traditional camping concept to a luxurious art form. Many feature proper flooring, climate control (heating or cooling), private seating areas, and even outdoor showers or bathtubs for a truly unique experience. They offer the perfect balance of adventure and luxury, allowing you to access remote, incredibly beautiful locations without sacrificing comfort, privacy, or style. This means you can wake up to stunning sunrises in remote valleys or fall asleep to the sounds of nature, all from the comfort of a five-star environment.`
          },
          {
            subHeader: `Diverse Settings for Luxurious Camping`,
            content: `Hoteloza's portfolio of glamping tents encompasses a wide variety of styles and settings. You'll find safari-style tents in wildlife reserves, bell tents in serene forests, geodesic domes on mountainsides, and luxurious tipis by tranquil lakes. Many properties offer additional on-site activities such as guided nature walks, wildlife viewing safaris, yoga sessions, or culinary workshops using local ingredients. They often prioritize sustainable practices, allowing you to enjoy nature responsibly. Glamping is perfect for romantic getaways, adventurous families, or anyone looking to reconnect with the outdoors in unparalleled comfort, offering unique photographic opportunities and unforgettable memories.`
          },
          {
            subHeader: `Why Book Your Glamping Tent with Hoteloza?`,
            content: `Hoteloza handpicks glamping tents that offer exceptional quality, unique locations, memorable experiences, and a commitment to guest satisfaction. Our platform provides detailed insights into each property's amenities, environmental focus, surrounding activities, and genuine guest reviews, ensuring you find the perfect blend of wild and wonderful. We simplify your booking process with secure transactions and dedicated customer support, making your upscale camping adventure effortless and reliable. Trust Hoteloza to guide you to extraordinary outdoor escapes that redefine luxury.`
          },
          {
            subHeader: `Your Sophisticated Wilderness Adventure`,
            content: `Yearning for a remarkable outdoor escape that doesn't compromise on comfort or style? Explore Hoteloza's collection of luxurious tents and discover the art of glamping. Your sophisticated wilderness adventure, filled with unique moments under the open sky, begins now.`
          },
        ];
        break;
      case "dome house":
        descriptionSegments = [
          {
            subHeader: `Future of Glamping and Immersive Retreats`,
            content: `Step into the future of glamping and immersive retreats with Hoteloza's captivating collection of Dome Houses. These architecturally stunning geodesic structures offer panoramic views and a unique connection to your surroundings, providing an extraordinary and unforgettable experience unlike any other, blending innovative design with the serene beauty of the outdoors.`
          },
          {
            subHeader: `Panoramic Views and Climate-Controlled Comfort`,
            content: `Picture yourself gazing at a breathtaking sunset, a vast, starlit night sky, or a dramatic natural landscape from the unparalleled comfort of your bed, through the expansive transparent panels of your dome. Inside, you'll find a spacious, climate-controlled sanctuary with all modern amenities, thoughtfully designed to maximize both comfort and your visual connection to nature. These unique homes are crafted to blend seamlessly with their natural environment, offering a profound sense of openness while maintaining complete privacy, creating an intimate dialogue between indoor luxury and outdoor majesty.`
          },
          {
            subHeader: `Innovative Design, Luxurious Amenities`,
            content: `Dome houses are characterized by their innovative spherical design, which not MFC-14-1-240-5-2-1.json only provides a striking aesthetic but also maximizes interior space and natural light, creating an airy and inviting atmosphere. Many feature comfortable furnishings, private en-suite bathrooms, small kitchenettes for light meals, and often include amenities like outdoor decks or hot tubs for al fresco relaxation. Their key appeal lies in the immersive views and unique aesthetic, offering a blend of minimalist luxury, cutting-edge design, and deep connection with nature, making them perfect for stargazing, unique photoshoots, and uninterrupted tranquility.`
          },
          {
            subHeader: `Breathtaking Locations and Unique Experiences`,
            content: `Hoteloza's portfolio of dome houses spans a variety of breathtaking locations – from secluded forest clearings and serene mountainsides to tranquil lakeside settings and even arid desert landscapes. Beyond the unique lodging, many properties offer additional experiences such as guided nature walks, yoga sessions, stargazing events, or access to private trails. These stays often prioritize sustainable practices and minimal environmental impact, allowing guests to enjoy nature responsibly. They are particularly sought after by those looking for a romantic escape, a unique family adventure, or simply an extraordinary getaway that offers both innovation and natural beauty, providing a truly Instagram-worthy experience.`
          },
          {
            subHeader: `Why Book Your Dome House with Hoteloza?`,
            content: `Hoteloza curates a special selection of dome houses, chosen for their unique design, stunning locations, their commitment to providing an unforgettable experience, and high guest satisfaction. Our detailed listings help you understand the specific features, amenities, and surrounding environment of each property, ensuring you pick the perfect futuristic retreat that aligns with your vision. We streamline the booking process, offering secure transactions and dedicated customer support, making it easy to secure your extraordinary stay and embark on a journey of discovery and wonder.`
          },
          {
            subHeader: `Your Panoramic Escape`,
            content: `Ready for an architectural adventure with unparalleled views and an immersive connection to nature? Explore Hoteloza's collection of enchanting dome houses and experience glamping redefined. Your unique panoramic escape, promising innovation and serene beauty, awaits.`
          },
        ];
        break;
      case "ryokan":
        descriptionSegments = [
          {
            subHeader: `Immerse in Japanese Tradition`,
            content: `Step back in time and immerse yourself in the profound tranquility of Japanese tradition with Hoteloza's exquisite selection of Ryokans. More than just an inn, a ryokan stay is a journey into Japan's soul, offering unparalleled omotenashi (wholehearted hospitality), timeless aesthetics, and a deep connection to local culture that will leave a lasting impression.`
          },
          {
            subHeader: `Serene Rituals and Gastronomic Delights`,
            content: `Imagine the serene ritual of changing into a comfortable yukata, the traditional Japanese robe, and then savoring a multi-course kaiseki dinner meticulously prepared with seasonal local ingredients, presented as edible art. Unwind completely in a natural hot spring (onsen) bath, perhaps outdoors under the stars or in a private setting, feeling the mineral-rich waters soothe your body and mind. Sleep peacefully on traditional futon bedding laid out on soft tatami mats, waking to the gentle light of a perfectly manicured Japanese garden. Every detail, from the minimalist design to the attentive, gracious service, is designed to evoke harmony, peace, and a profound appreciation for Japanese customs.`
          },
          {
            subHeader: `Authentic Havens with Traditional Charm`,
            content: `Our ryokans are authentic havens, characterized by traditional Japanese architecture, sliding paper screens (shoji), tranquil Zen gardens, and often, access to private or communal onsen baths. They offer a unique cultural immersion, adhering to centuries-old traditions. Expect structured meal times that are an experience in themselves, ceremonial tea preparations, and a focus on personalized, discreet service that anticipates your needs. This provides a profound contrast to Western-style hotels, prioritizing authentic Japanese comfort, etiquette, and a deep dive into the country's rich heritage.`
          },
          {
            subHeader: `Explore Japan's Beauty and Culture`,
            content: `Hoteloza's portfolio of ryokans includes properties ranging from humble, family-run inns nestled in charming villages to luxurious, exclusive establishments in scenic areas. Many are located near significant historical sites, natural parks, or hot spring towns, allowing for easy exploration of Japan's beauty. Guests can often participate in cultural activities like calligraphy, flower arranging, or traditional music performances. Understanding basic onsen etiquette and appreciating the quiet reverence of these spaces enhances the experience. Ryokans are essential for anyone seeking a truly authentic and deeply immersive Japanese lodging experience, offering a unique perspective on Japanese hospitality and way of life that cannot be replicated elsewhere. They promise a tranquil retreat for the mind, body, and spirit.`
          },
          {
            subHeader: `Why Book Your Ryokan with Hoteloza?`,
            content: `Hoteloza carefully curates ryokans that uphold the highest standards of Japanese tradition, guest experience, and authenticity. Our platform provides detailed insights into their unique offerings, from specific meal types and onsen facilities to local etiquette and cultural activities available, empowering you to choose a ryokan that perfectly aligns with your desire for cultural immersion. We ensure a seamless and secure booking process, allowing you to confidently secure your authentic Japanese cultural journey with ease. Our commitment is to connect you with the very best of Japan's traditional hospitality.`
          },
          {
            subHeader: `Your Authentic Japanese Escape`,
            content: `Yearning for a journey into the heart of Japanese tradition, where every detail is a poetic expression of hospitality? Explore Hoteloza's selection of exquisite ryokans and prepare for an experience of unparalleled peace, profound cultural depth, and timeless beauty. Your authentic Japanese escape begins here.`
          },
        ];
        break;
      case "machiya":
        descriptionSegments = [
          {
            subHeader: `Uncover Japan's Traditional Past`,
            content: `Uncover the intimate charm of Japan's traditional past with Hoteloza's exclusive collection of Machiyas. Predominantly found in historic cities like Kyoto, these beautifully restored wooden townhouses offer a unique opportunity to live like a local, blending historical architecture with modern comforts for an authentic and deeply personal Japanese residential experience.`
          },
          {
            subHeader: `Live Like a Local in Your Private Sanctuary`,
            content: `Imagine stepping through a traditional noren curtain into your private sanctuary, a narrow facade opening into a spacious interior. You'll find elegant tatami mat rooms, intricate sliding paper screens (shoji or fusuma), and often, a serene tsubo-niwa (small inner garden) that brings nature indoors. Cook local ingredients sourced from nearby markets in your fully equipped modern kitchen, or simply relax in the quiet ambiance, a stark contrast to the bustling city streets outside. It's a chance to truly experience the city's soul from within its traditional walls, offering a sense of history and calm that larger accommodations cannot provide.`
          },
          {
            subHeader: `Meticulously Restored Architectural Gems`,
            content: `Machiyas are characterized by their unique architectural layout: a long, narrow structure often spanning two floors, built around a central courtyard or garden. Our meticulously restored machiyas seamlessly integrate contemporary amenities like modern bathrooms, efficient air conditioning, and reliable Wi-Fi, while rigorously preserving their historical integrity and traditional aesthetics. They offer significantly more space and privacy than standard hotel rooms, making them ideal for families, groups of friends, or couples seeking a deeply cultural, independent, and residential stay. Many feature traditional wooden beams, exquisite craftsmanship, and carefully preserved details that tell stories of bygone eras.`
          },
          {
            subHeader: `Immersive Exploration from Your Doorstep`,
            content: `Hoteloza's portfolio of machiyas includes a range of styles, from simple, charming dwellings to luxurious, high-end properties. They are often located within walking distance of famous temples, historical sites, traditional craft shops, and authentic local eateries, allowing for easy and immersive exploration. Staying in a machiya offers a unique perspective on Japanese urban living, allowing you to participate in the daily rhythm of a traditional neighborhood. Some machiyas also provide additional services such as guided cultural tours, private tea ceremonies, or cooking classes that teach local recipes, further enhancing your cultural immersion. They are particularly sought after by travelers who value authenticity, privacy, and a desire to connect deeply with the local heritage.`
          },
          {
            subHeader: `Why Book Your Machiya with Hoteloza?`,
            content: `Hoteloza handpicks machiyas renowned for their meticulous restoration, authentic character, prime locations within charming districts, and exceptional guest experiences. Our detailed listings provide comprehensive historical context, specific features, high-quality images, and authentic guest reviews, ensuring you select a machiya that perfectly embodies your vision of traditional Japanese living. We streamline the booking process, offering secure transactions and dedicated customer support, making it easy to book this unique cultural immersion and secure your unforgettable traditional home in Japan.`
          },
          {
            subHeader: `Your Unforgettable Traditional Home`,
            content: `Ready to inhabit a piece of Japan's living history and experience its ancient capitals from a truly authentic perspective? Explore Hoteloza's collection of enchanting machiyas and unlock an intimate, unique experience of Japan. Your traditional home, waiting to tell its story, awaits.`
          },
        ];
        break;
      case "country house":
        descriptionSegments = [
          {
            subHeader: `Serene Countryside Living`,
            content: `Escape the urban bustle and embrace serene countryside living with Hoteloza's charming collection of Country Houses. Nestled amidst picturesque landscapes, these properties offer a tranquil retreat, perfect for reconnecting with nature, enjoying peaceful solitude, or gathering loved ones in an idyllic setting far from the demands of city life.`
          },
          {
            subHeader: `Relaxation and Rural Charm`,
            content: `Imagine waking to the gentle chorus of birdsong, enjoying a leisurely breakfast with fresh local produce, and spending your days exploring rolling hills, lush vineyards, secluded woodlands, or meandering rivers. Evenings might involve cozying up by a crackling fireplace with a good book, engaging in heartfelt conversations, or enjoying a delicious meal prepared from local ingredients, perhaps sourced from nearby farms. It's an escape where time slows down, allowing for deep relaxation, rejuvenation, and an opportunity to truly savor the beauty and tranquility of rural life.`
          },
          {
            subHeader: `Rustic Elegance and Ample Space`,
            content: `Our country houses range from rustic farmhouses brimming with authentic charm to elegant estates boasting sprawling gardens, private orchards, or even small vineyards. They typically feature spacious living areas, charmingly decorated bedrooms that offer peaceful sleep, and often include amenities like fully equipped kitchens, outdoor dining spaces, and direct access to walking trails or cycling routes. These properties offer unparalleled peace, privacy, and a deep connection to the natural environment, making them ideal for family reunions, large group getaways, a quiet romantic escape, or a refreshing solo retreat. Many retain original architectural features, adding to their unique character and historical appeal.`
          },
          {
            subHeader: `Immersive Rural Experiences`,
            content: `Hoteloza's portfolio of country houses is diverse, located in various scenic regions around the world, from the rolling hills of Tuscany to the tranquil valleys of Provence or the rustic beauty of the British countryside. Beyond simple relaxation, many properties offer additional experiences such as wine tasting, cooking classes focused on regional cuisine, guided nature walks, or opportunities to engage with local farming activities. This allows guests to immerse themselves more deeply in the rural lifestyle. Country houses are perfect for those seeking a slower pace of travel, a break from technology, and a chance to truly unwind and enjoy the simple pleasures of life amidst beautiful natural surroundings. They provide a sense of timeless elegance and genuine tranquility.`
          },
          {
            subHeader: `Why Book Your Country House with Hoteloza?`,
            content: `Hoteloza curates a selection of country houses known for their unique character, stunning natural surroundings, exceptional comfort, and commitment to providing a peaceful escape. Our detailed listings highlight specific amenities, local attractions, nearby activities, and authentic guest reviews, ensuring you find the perfect countryside haven that aligns with your vision of relaxation. We streamline the booking process, offering secure transactions and dedicated customer support, making it simple to secure your idyllic rural retreat and begin your journey into tranquility.`
          },
          {
            subHeader: `Your Serene Rural Retreat`,
            content: `Yearning for a peaceful escape into the heart of the countryside, where rustic charm meets refined comfort? Explore Hoteloza's collection of charming country houses and rediscover the simple joys of nature and profound tranquility. Your serene retreat, promising rejuvenation and unforgettable moments, awaits.`
          },
        ];
        break;
      case "haveli":
        descriptionSegments = [
          {
            subHeader: `Step into India's Opulent Past`,
            content: `Step into the opulent past of India with Hoteloza's magnificent collection of Havelis. These exquisitely restored traditional mansions offer a regal experience, transporting you to an era of grandeur and intricate artistry, all while seamlessly blending historical authenticity with modern comforts for an unforgettable stay.`
          },
          {
            subHeader: `Regal Ambiance and Personalized Service`,
            content: `Imagine wandering through grand courtyards adorned with ornate frescoes, admiring intricate jharokha (balcony) carvings that whisper tales of bygone eras, and dining in lavish halls that once hosted maharajas and queens. Experience personalized service that mirrors ancient Indian hospitality, perhaps enjoying a traditional music performance under the stars in a serene inner courtyard, or indulging in an authentic Rajasthani thali prepared by local chefs. Every corner tells a story, immersing you in India's rich heritage and providing a profound sense of connection to its vibrant history.`
          },
          {
            subHeader: `Unique Historical Architecture`,
            content: `Our havelis are characterized by their unique historical architecture, often featuring multiple courtyards, detailed stonework, vibrant wall paintings, and antique furnishings that evoke a sense of timeless elegance. While preserving their heritage, they seamlessly integrate modern amenities like efficient air conditioning, reliable Wi-Fi, and luxurious en-suite bathrooms. Many offer authentic Indian culinary experiences, traditional dance performances, cultural workshops (e.g., block printing, turban tying), and guided historical tours, providing an immersive stay unlike any other. The intricate craftsmanship and attention to detail in these properties are truly mesmerizing.`
          },
          {
            subHeader: `Explore Rich Indian Heritage`,
            content: `Hoteloza's portfolio of havelis spans various historic regions of India, including Rajasthan's desert cities like Jaipur, Jodhpur, and Udaipur, known for their royal past. We feature properties that once belonged to noble families, now transformed into boutique hotels or heritage guesthouses, each with its own unique story and character. Staying in a haveli offers an unparalleled opportunity to experience India's cultural richness from an insider's perspective, often within walking distance of bustling bazaars, ancient forts, and magnificent palaces. They are perfect for history enthusiasts, cultural explorers, and those seeking a luxurious and profoundly authentic Indian experience, promising a journey that engages all your senses.`
          },
          {
            subHeader: `Why Book Your Haveli with Hoteloza?`,
            content: `Hoteloza meticulously selects havelis known for their historical significance, meticulous restoration, exceptional guest experiences, and commitment to preserving Indian heritage. Our platform provides comprehensive details on their unique features, cultural offerings, historical background, and authentic guest reviews, ensuring you choose a property that truly reflects India's royal legacy and aligns with your travel aspirations. We make it easy to book this unparalleled journey into heritage, with secure transactions and dedicated customer support to assist you every step of the way.`
          },
          {
            subHeader: `Your Royal Stay Awaits`,
            content: `Ready to experience the majestic charm of India's past and immerse yourself in an era of unparalleled grandeur? Explore Hoteloza's collection of magnificent havelis and embark on a regal adventure filled with history, art, and profound hospitality. Your royal stay, a living piece of history, awaits.`
          },
        ];
        break;
      case "riad":
        descriptionSegments = [
          {
            subHeader: `Discover a Hidden Moroccan Oasis`,
            content: `Discover a hidden oasis of tranquility within the vibrant medinas of Morocco with Hoteloza's enchanting collection of Riads. These traditional Moroccan houses, built around serene interior courtyards, offer a peaceful escape from the bustling souks, inviting you into a world of exquisite beauty, authentic hospitality, and profound relaxation.`
          },
          {
            subHeader: `Sensory Journey and Rooftop Views`,
            content: `Picture yourself relaxing by a refreshing plunge pool in a sun-drenched courtyard, the air scented with jasmine and mint, with the gentle murmur of a fountain as your soundtrack. Climb to the rooftop terrace for panoramic views of the city, listening to the melodic call to prayer echoing from nearby mosques as the sun sets. Enjoy traditional Moroccan mint tea, savor home-cooked tagines prepared with local spices, and unwind in intricately designed rooms adorned with vibrant tiles (zellij), hand-carved wood, and plush fabrics. It's an intimate immersion into Moroccan culture and hospitality, offering a unique sensory journey.`
          },
          {
            subHeader: `Inward-Facing Architecture, Modern Comforts`,
            content: `Riads are defined by their inward-facing architecture, creating a private sanctuary from the outside world. Our selected riads seamlessly blend historical charm and traditional Moroccan craftsmanship with modern comforts like efficient air conditioning, reliable Wi-Fi, and luxurious bathrooms. They offer highly personalized service, often including delicious breakfast served daily in the courtyard, traditional cooking classes, and invaluable assistance with navigating the labyrinthine medina, making your Moroccan experience truly authentic and hassle-free. The exquisite craftsmanship found in every corner, from mosaic floors to cedarwood ceilings, is a true highlight.`
          },
          {
            subHeader: `Explore Vibrant Medinas`,
            content: `Hoteloza's portfolio of riads is predominantly found in historic cities like Marrakech, Fes, and Essaouira, each offering a unique cultural tapestry. Many riads are located within walking distance of major historical sites, bustling souks (markets), and local attractions, allowing for easy and immersive exploration. Staying in a riad offers a profoundly authentic perspective on Moroccan urban living, a stark contrast to large, international hotels. They are perfect for couples seeking a romantic getaway, cultural explorers, and anyone looking for an intimate and peaceful retreat that offers a deep connection to Moroccan art, history, and daily life. The tranquility inside a riad, despite being in the heart of a vibrant city, is truly remarkable.`
          },
          {
            subHeader: `Why Book Your Riad with Hoteloza?`,
            content: `Hoteloza handpicks riads known for their authentic character, exquisite design, exceptional guest experiences, and prime locations within the medinas. Our detailed listings provide comprehensive insights into their unique features, architectural beauty, cultural offerings, and genuine guest reviews, ensuring you choose the perfect Moroccan sanctuary that aligns with your travel aspirations. We make booking your intimate oasis simple and secure, with dedicated customer support ready to assist you in planning every detail of your enchanting Moroccan escape.`
          },
          {
            subHeader: `Your Enchanting Moroccan Escape`,
            content: `Yearning for a magical escape into the heart of Moroccan tradition and profound tranquility? Explore Hoteloza's collection of enchanting riads and unlock an authentic, unforgettable experience. Your serene Moroccan retreat, promising beauty and cultural immersion, awaits.`
          },
        ];
        break;
      case "farm stay":
        descriptionSegments = [
          {
            subHeader: `Connect with the Land and Rural Life`,
            content: `Connect with the land and embrace the simple joys of rural life with Hoteloza's charming collection of Farm Stays. These unique accommodations offer an immersive experience, inviting you to step away from the urban rush and discover the tranquility, authenticity, and rejuvenating rhythms of countryside living.`
          },
          {
            subHeader: `Authentic Farm Experiences`,
            content: `Imagine waking to the gentle sounds of farm animals, the crisp scent of fresh air, and the promise of a day rooted in nature. Enjoy a hearty breakfast with fresh, locally sourced produce, perhaps even eggs collected moments before. Spend your days participating in farm activities like milking cows, collecting eggs, tending to gardens, or simply exploring orchards and vast fields. Or, unwind in the peaceful embrace of picturesque landscapes, enjoying a slower pace of life, reconnecting with nature, and learning about sustainable living. Evenings might involve stargazing far from city lights or sharing stories around a bonfire.`
          },
          {
            subHeader: `Rustic Charm and Modern Comforts`,
            content: `Our farm stays range from cozy cottages on working farms to beautifully renovated barns with modern amenities, or even charming lodges nestled within agricultural estates. They offer a unique blend of rustic charm and comfortable lodging, providing unparalleled opportunities for hands-on experiences, direct interaction with farm animals, and often, delicious farm-to-table dining where meals are prepared with ingredients harvested on-site. These properties offer a profound sense of peace and a chance to experience rural culture firsthand, making them ideal for families, educational trips, and anyone seeking a wholesome, authentic countryside retreat.`
          },
          {
            subHeader: `Diverse Locations and Activities`,
            content: `Hoteloza's portfolio of farm stays is diverse, located in various scenic agricultural regions globally. Beyond the core farm experience, many properties offer additional activities such as cooking classes featuring regional recipes, guided nature walks through local trails, fishing in nearby streams, or opportunities to engage with local farming activities. This allows guests to immerse themselves more deeply in the rural lifestyle. Farm stays are perfect for travelers who appreciate sustainable tourism, desire a tranquil escape, or wish to provide a unique educational experience for children. Farm stays offer a refreshing change of pace, fostering a deeper appreciation for nature, food origins, and traditional rural life. It's an ideal choice for those looking for an interactive and enriching vacation away from the typical tourist crowds.`
          },
          {
            subHeader: `Why Book Your Farm Stay with Hoteloza?`,
            content: `Hoteloza curates a selection of farm stays known for their genuine hospitality, engaging activities, beautiful natural settings, and commitment to guest satisfaction. Our detailed listings highlight specific farm activities offered, types of accommodations, nearby attractions, and authentic guest reviews, ensuring you find the perfect countryside escape that aligns with your vision. We streamline the booking process, offering secure transactions and dedicated customer support, making it simple to secure your enriching rural adventure and begin your journey into tranquility and discovery.`
          },
          {
            subHeader: `Your Authentic Rural Adventure`,
            content: `Ready to experience the charming simplicity of farm life and reconnect with nature in a profound way? Explore Hoteloza's collection of delightful farm stays and embark on a unique, wholesome adventure. Your rural escape, promising authenticity and rejuvenation, begins here.`
          },
        ];
        break;
      case "cabin":
        descriptionSegments = [
          {
            subHeader: `Escape to the Wilderness`,
            content: `Escape to the serene embrace of the wilderness with Hoteloza's captivating collection of Cabins. Perfect for nature lovers, adventurers, or those simply seeking profound solitude, our cabins offer a rustic yet comfortable retreat nestled amidst dense forests, majestic mountainsides, or by tranquil lakes, promising an intimate connection with the untouched natural world.`
          },
          {
            subHeader: `Immerse in Nature's Quiet Grandeur`,
            content: `Picture yourself waking to the crisp scent of pine in the air, the gentle sounds of rustling leaves or a distant river, and sunlight filtering through towering trees. Days can be spent hiking winding trails to breathtaking vistas, fishing in pristine waters, observing local wildlife, or simply unwinding on a private porch with a good book, completely disconnected from digital distractions. Evenings come alive with the comforting warmth of a crackling fireplace or wood-burning stove, vast starlit skies free from light pollution, and the profound peace of being truly immersed in nature's quiet grandeur. It’s an opportunity to rejuvenate your spirit and clear your mind.`
          },
          {
            subHeader: `Rustic Charm and Essential Comfort`,
            content: `Our cabins range from charming, compact hideaways perfect for couples to spacious lodges ideal for family gatherings, all designed to blend seamlessly with their natural surroundings. They typically feature cozy, often wooden interiors, private bathrooms, and basic kitchen facilities, offering a unique blend of rustic charm and essential modern comfort. Cabins provide unparalleled privacy and an immersive connection to the natural environment, making them ideal for romantic getaways, adventurous solo retreats, or family vacations focused on outdoor activities. Many boast stunning views and direct access to hiking, biking, or water sports.`
          },
          {
            subHeader: `Secluded Locations and Outdoor Pursuits`,
            content: `Hoteloza's portfolio of cabins spans diverse natural landscapes, from the serene wilderness of national parks to secluded private lands. Beyond the cabin itself, many properties offer additional amenities such as communal fire pits for evening gatherings, outdoor grilling areas, and access to private beaches or fishing docks. Some provide guided outdoor excursions, like wildlife photography tours or guided hikes, enriching your wilderness experience. Cabins are perfect for those seeking a genuine escape from urban noise, a chance to reconnect with loved ones in nature, or a base for exploring outdoor pursuits. They embody a sense of tranquility, adventure, and simple living, providing a refreshing change of pace for any traveler.`
          },
          {
            subHeader: `Why Book Your Cabin with Hoteloza?`,
            content: `Hoteloza handpicks cabins known for their stunning secluded locations, comfortable amenities, and unwavering commitment to providing an authentic wilderness experience. Our detailed listings highlight specific features, proximity to outdoor activities, and genuine guest reviews, ensuring you find the perfect rustic sanctuary that aligns with your vision of a natural escape. We streamline the booking process, offering secure transactions and dedicated customer support, making it easy to secure your tranquil retreat and embark on an unforgettable outdoor adventure with complete peace of mind.`
          },
          {
            subHeader: `Your Perfect Wilderness Hideaway`,
            content: `Yearning for a serene retreat into nature's embrace, where peace and adventure intertwine? Explore Hoteloza's collection of charming cabins and discover your perfect wilderness hideaway. Your secluded adventure, promising rejuvenation and profound natural beauty, awaits.`
          },
        ];
        break;
      case "chalet":
        descriptionSegments = [
          {
            subHeader: `Quintessential Mountain Escape`,
            content: `Experience the quintessential mountain escape with Hoteloza's luxurious collection of Chalets. These enchanting alpine-style homes offer unparalleled warmth, comfort, and often breathtaking panoramic views of majestic peaks or lush valleys, making them the perfect base for an unforgettable ski trip or a serene summer hiking adventure.`
          },
          {
            subHeader: `Alpine Adventures and Luxurious Relaxation`,
            content: `Imagine waking to crisp mountain air, the sunlight glinting off snow-capped peaks outside your window, and the scent of pine. Spend your days conquering world-class ski slopes, traversing scenic hiking trails that lead to hidden waterfalls, or simply unwinding on a spacious balcony, soaking in the awe-inspiring vistas. Evenings gather loved ones around a crackling fireplace, sharing stories and warmth, or enjoying a delicious meal prepared in a gourmet kitchen. Chalets offer a perfect blend of active adventure and luxurious relaxation, an idyllic setting for creating cherished memories.`
          },
          {
            subHeader: `Traditional Charm and Refined Comfort`,
            content: `Our chalets are characterized by their traditional wooden architecture, exposed beams, and spacious, inviting interiors. They typically feature multiple bedrooms with comfortable bedding, large living areas ideal for socializing, and often include amenities like private saunas, hot tubs, or even indoor swimming pools for ultimate relaxation after a day outdoors. These properties are ideal for large families or groups, providing ample space, privacy, and a cozy atmosphere that is both rustic and refined. Their prime locations often offer direct ski-in/ski-out access or proximity to popular hiking routes, maximizing your mountain experience and minimizing travel time.`
          },
          {
            subHeader: `Diverse Mountain Regions and Activities`,
            content: `Hoteloza's portfolio of chalets spans various renowned mountain regions globally, from the Swiss Alps and French Dolomites to the Rocky Mountains and the Japanese Alps. Beyond the core winter sports, many chalets offer access to summer activities like mountain biking, rock climbing, paragliding, and white-water rafting. Some properties provide additional services such as private chefs, daily housekeeping, or equipment rental directly on-site for ultimate convenience. Chalets embody a sense of timeless charm and adventure, offering a private sanctuary amidst the grandeur of nature. They are perfect for active holidays, peaceful retreats, or celebrations with friends and family in a picturesque, invigorating setting.`
          },
          {
            subHeader: `Why Book Your Chalet with Hoteloza?`,
            content: `Hoteloza curates a selection of chalets renowned for their stunning locations, luxurious amenities, exceptional guest experiences, and high standards of comfort. Our detailed listings provide comprehensive insights into specific features, nearby activities, ski access, and authentic guest reviews, ensuring you find the perfect alpine sanctuary that aligns with your dream mountain getaway. We streamline the booking process, offering secure transactions and dedicated customer support, making it simple to secure your extraordinary chalet and elevate your next alpine escape with complete peace of mind.`
          },
          {
            subHeader: `Your Perfect Mountain Home Awaits`,
            content: `Ready for an exhilarating mountain adventure combined with luxurious comfort and breathtaking views? Explore Hoteloza's collection of exquisite chalets and elevate your next alpine escape. Your perfect mountain home, designed for unforgettable moments amidst nature's grandeur, awaits.`
          },
        ];
        break;
      case "boat":
        descriptionSegments = [
          {
            subHeader: `Unique Floating Sanctuaries`,
            content: `Embark on a truly unique and memorable adventure with Hoteloza's extraordinary collection of Boat accommodations. From sleek yachts gliding across azure waters to charming riverboats nestled in picturesque canals, these floating sanctuaries offer a distinctive perspective of your destination, promising freedom, unparalleled views, and an unforgettable journey on the water.`
          },
          {
            subHeader: `Wake Up to Water's Serenity`,
            content: `Imagine waking to the gentle lapping of waves against the hull, the salty tang of the sea air, or the serene calm of a tranquil river. Spend your days exploring hidden coves accessible only by water, diving into crystal-clear depths for snorkeling, or simply relaxing on deck as the world glides by. Evenings offer mesmerizing sunsets painted across the horizon, the unique experience of dining under a vast, open sky, and the comforting sway of your floating home. It’s an immersive experience that redefines how you connect with a destination, offering a sense of liberation and discovery.`
          },
          {
            subHeader: `Compact Comfort and Unparalleled Access`,
            content: `Our boat accommodations are ingeniously designed for comfort and adventure, offering compact yet functional living spaces, often with small galleys (kitchens), cozy sleeping quarters, and private decks for sunbathing or al fresco dining. They provide unparalleled access to coastal beauty, serene waterways, and a sense of liberation that traditional land-based accommodations cannot match. Options range from stationary vessels for a unique hotel-like experience in a prime waterfront location to those available for short cruises or charters, adding an element of dynamic exploration to your stay. Many feature modern navigation and safety equipment, ensuring a worry-free experience.`
          },
          {
            subHeader: `Diverse Aquatic Environments`,
            content: `Hoteloza's portfolio of boat accommodations spans various stunning aquatic environments – from luxury yachts in the Mediterranean, historic barges on European canals, to charming riverboats in exotic locales. Beyond the unique lodging, many properties offer additional services such as guided cruises, water sports equipment rental, fishing excursions, or even on-board catering. They are perfect for adventurous travelers, maritime enthusiasts, or anyone seeking an unconventional lodging experience that offers both excitement and tranquility. A boat stay can transform a simple vacation into an expedition, allowing you to discover your destination from an entirely new vantage point and create truly unique memories.`
          },
          {
            subHeader: `Why Book Your Boat Stay with Hoteloza?`,
            content: `Hoteloza curates a special selection of boat accommodations, chosen for their unique charm, safety standards, the unforgettable experiences they offer, and high guest satisfaction. Our detailed listings provide specific information on amenities, mooring locations, cruising options (if applicable), and any necessary licensing or crew details, ensuring you find the perfect floating retreat that aligns with your adventurous spirit. We streamline the booking process, offering secure transactions and dedicated customer support, making it simple to secure your extraordinary nautical adventure and embark on a truly distinctive journey with complete peace of mind.`
          },
          {
            subHeader: `Set Sail on Your Next Adventure`,
            content: `Yearning for an unconventional escape where the journey is as captivating as the destination? Explore Hoteloza's collection of unique boat accommodations and set sail on your next great adventure. Your floating sanctuary, promising freedom and unparalleled beauty, awaits.`
          },
        ];
        break;
      case "houseboat":
        descriptionSegments = [
          {
            subHeader: `Uniquely Tranquil Waterside Escape`,
            content: `Discover a uniquely tranquil escape with Hoteloza's charming collection of Houseboats. Offering a serene and intimate lodging experience, these delightful homes on the water are typically moored in picturesque canals, calm lakes, or scenic coastal areas, providing a peaceful retreat with breathtaking waterside views and a profound sense of calm.`
          },
          {
            subHeader: `Embrace the Water's Gentle Rhythm`,
            content: `Picture yourself sipping coffee on your private deck, watching swans glide by, local fishing boats gently pass, or the early morning mist rise from the water. Days can be spent fishing directly from your doorstep, birdwatching from your window, or simply unwinding amidst the gentle rocking of the water, far removed from the noise and rush of city life. Evenings offer stunning reflections on the water's surface, vibrant sunsets, and a profound sense of calm, creating an idyllic setting for relaxation and connection. It’s a chance to truly disconnect and embrace a slower pace.`
          },
          {
            subHeader: `Home Comforts on the Water`,
            content: `Our houseboats offer surprisingly spacious living areas, comfortable bedrooms, and often fully equipped kitchens, providing all the comforts of a traditional home, but on the water. They are perfect for those seeking ultimate relaxation, a romantic getaway, or a unique family adventure, offering a blend of privacy and immersion in nature. Many feature private decks for al fresco dining, sunbathing, or enjoying the views. They embody a unique charm, allowing guests to experience waterside living with direct access for swimming, kayaking, or simply observing local aquatic wildlife.`
          },
          {
            subHeader: `Idyllic Locations and Unique Perspectives`,
            content: `Hoteloza's portfolio of houseboats includes various styles, from rustic, charming vessels to luxurious, modern floating homes. They are located in diverse scenic watery environments, from the historic canals of Amsterdam and the serene backwaters of Kerala, India, to picturesque lakesides in North America. Beyond the unique lodging, many properties offer additional amenities such as access to small motorboats or kayaks, fishing gear, or nearby onshore facilities like restaurants and shops. Houseboats are perfect for those who appreciate quietude, unique photography opportunities, or simply a novel way to experience a destination. They provide a refreshing and memorable alternative to conventional accommodation, promising a unique vantage point and an unforgettable sense of peace.`
          },
          {
            subHeader: `Why Book Your Houseboat with Hoteloza?`,
            content: `Hoteloza handpicks houseboats known for their idyllic locations, comfortable amenities, unique charm, and high guest satisfaction. Our detailed listings provide specific information on mooring, facilities, surrounding attractions, and authentic guest reviews, ensuring you find the perfect floating home that aligns with your vision of a tranquil waterside escape. We streamline the booking process, offering secure transactions and dedicated customer support, making it easy to secure your serene floating home and embark on a truly distinctive and peaceful vacation.`
          },
          {
            subHeader: `Your Serene Floating Home`,
            content: `Ready for a peaceful retreat where the water meets unparalleled tranquility and unique charm? Explore Hoteloza's collection of enchanting houseboats and discover a new way to unwind. Your serene floating home, promising relaxation and unique memories, awaits.`
          },
        ];
        break;
      default: // Fallback for unspecified categories
        descriptionSegments = [
          {
            subHeader: `Extraordinary ${categoryName} Collection`,
            content: `Welcome to Hoteloza's extraordinary collection of ${categoryName.toLowerCase()}! Designed to cater to every traveler's unique taste, our diverse range of accommodations promises more than just a stay – it's an immersive experience tailored to your aspirations, connecting you deeply with your chosen destination.`
          },
          {
            subHeader: `Enhance Your Journey`,
            content: `Imagine embarking on a journey where every detail of your lodging enhances your destination. Whether it's the thrill of adventure, the solace of nature, or the embrace of local culture, our ${categoryName.toLowerCase()} offer unique moments waiting to be discovered, creating memories that last a lifetime. From innovative designs that challenge traditional notions of accommodation to authentic cultural immersions that broaden your perspective, every stay is an opportunity for profound discovery and personal growth.`
          },
          {
            subHeader: `Distinct Character and Unparalleled Experiences`,
            content: `Our properties are meticulously selected for their distinct character, exceptional quality, and the unparalleled experiences they provide. From avant-garde architectural marvels to charming traditional dwellings, expect personalized service and amenities that go beyond the ordinary, ensuring your stay is truly remarkable. We focus on properties that offer a strong sense of place, allowing you to truly connect with the local environment and culture, whether through unique design, local cuisine, or engaging activities.`
          },
          {
            subHeader: `Beyond Conventional Travel`,
            content: `Hoteloza's commitment to unique stays means we explore beyond the conventional. Our collection includes hidden gems in remote locations, eco-friendly properties that blend seamlessly with nature, and historical buildings brimming with stories. Each listing provides comprehensive information about its unique features, accessibility, and the experiences it offers. We aim to inspire and facilitate journeys that are not just about visiting, but about living and experiencing, offering options for every type of traveler, from the solo adventurer to large families seeking a special gathering place.`
          },
          {
            subHeader: `Why Choose Hoteloza for Unique Stays?`,
            content: `Hoteloza is your trusted partner in uncovering these extraordinary gems. We provide comprehensive details, genuine guest insights, and exclusive access to properties that redefine travel and exceed expectations. Our seamless booking process and dedicated support ensure your unique adventure is just a click away, making planning easy and stress-free. Trust us to guide you to accommodations that are truly special, ensuring your trip is as unique as you are.`
          },
          {
            subHeader: `Your Extraordinary Journey Begins`,
            content: `Ready to venture beyond the conventional and embark on an adventure uniquely yours? Explore Hoteloza's exceptional collection of ${categoryName.toLowerCase()} and unlock an experience that transcends the ordinary. Your extraordinary journey begins now.`
          },
        ];
        break;
    }

    return descriptionSegments.filter(segment => segment.content.trim() !== '');
  },

  // === Deskripsi untuk KATEGORI + ENTITAS GEOGRAFIS (Country, State, City, Landmark) ===
  getGeoCategoryDescription: (categoryName = "accommodations", entityType, entityName, cityName, stateName, countryName) => {
    let descriptionSegments = []; // Will store objects with { subHeader, content }
    let locationContext = "";

    // Determine location context for dynamic phrasing
    if (entityType === 'country') {
      locationContext = `in ${entityName}`;
    } else if (entityType === 'state') {
      locationContext = `in ${entityName}, ${countryName || 'a beautiful country'}`;
    } else if (entityType === 'city') {
      locationContext = `in ${entityName}, ${stateName || 'a vibrant region'}, ${countryName || 'its country'}`;
    } else if (entityType === 'landmark') {
      locationContext = `near ${entityName} in ${cityName || 'a vibrant city'}`;
    }

    // Intro based on entityType and category - this will be the first paragraph, often without a specific subHeader
    let introContent = "";
    if (entityType === 'country') {
      introContent = `Embark on an unforgettable journey through ${entityName} and discover the perfect ${categoryName.toLowerCase()} with Hoteloza. From ancient traditions to modern marvels, bustling cities to tranquil natural landscapes, ${entityName} promises an adventure that perfectly complements our range of curated accommodations, offering a deep dive into its rich culture and diverse beauty.`;
    } else if (entityType === 'state') {
      introContent = `Explore the captivating beauty of ${entityName} and find your ideal ${categoryName.toLowerCase()} with Hoteloza. Nestled within ${countryName || 'a beautiful country'}, ${entityName} offers a compelling blend of natural wonders, historical sites, and vibrant communities, making it a fantastic destination for all travelers seeking diverse experiences.`;
    } else if (entityType === 'city') {
      introContent = `Welcome to ${entityName}, a dynamic urban hub where history meets modern charm, offering a tapestry of experiences from bustling markets to serene parks! Hoteloza invites you to discover our curated collection of ${categoryName.toLowerCase()} that will serve as your perfect base for exploring this vibrant city in ${stateName || 'its region'}, ${countryName || 'its country'}.`;
    } else if (entityType === 'landmark') {
      introContent = `Discover the ultimate convenience and charm by booking your ${categoryName.toLowerCase()} near ${entityName} in ${cityName || 'a vibrant city'} through Hoteloza. Staying in close proximity offers unparalleled access to this iconic site and the rich cultural, historical, or natural experiences surrounding it, making your visit truly immersive.`;
    }
    descriptionSegments.push({ subHeader: `Welcome to ${entityName}`, content: introContent });


    // Specific experience based on categoryName
    switch (categoryName.toLowerCase()) {
      case "hotel":
        descriptionSegments.push({
          subHeader: `Experience the Comfort`,
          content: `Our hotels ${locationContext} offer a blend of urban sophistication and local charm. Imagine seamless check-ins after a long journey, followed by a comfortable night's rest in a beautifully appointed room with views of ${entityName}'s skyline or natural beauty. Many properties boast rooftop bars with panoramic views, exquisite restaurants serving local and international cuisine, and state-of-the-art fitness centers. They provide a reliable, full-service experience, ensuring every aspect of your stay is effortlessly managed, from personalized concierge services to serene spa treatments.`
        });
        descriptionSegments.push({
          subHeader: `Local Integration & Exploration`,
          content: `Strategically located, our hotels provide effortless access to ${entityType === 'landmark' ? `the iconic ${entityName} and the surrounding bustling streets, allowing you to experience its magic day and night` : `the most beloved attractions, cultural sites, and vibrant districts of ${entityName}`}. Explore local markets, discover hidden cafes down charming alleyways, visit world-class museums, or simply enjoy the ease of returning to comfort after a day of discovery. Many offer local tours or transportation services to enhance your exploration.`
        });
        descriptionSegments.push({
          subHeader: `Beyond the Main Attractions`,
          content: `Beyond the well-known sites, our hotel locations often provide a perfect springboard to discover ${entityName}'s authentic local life. Indulge in culinary delights at local eateries, mingle with residents in charming squares, and uncover artisan shops. For business travelers, proximity to key commercial hubs and convention centers is a significant advantage, while leisure seekers will appreciate easy access to shopping, entertainment, and cultural events.`
        });
        break;
      case "villa":
        descriptionSegments.push({
          subHeader: `Private Paradise Awaits`,
          content: `Indulge in unparalleled privacy and spacious luxury with our exclusive villas ${locationContext}. Picture yourself unwinding by a shimmering private infinity pool, surrounded by lush gardens that exude tranquility, far from the crowds. These havens are perfect for families seeking quality time, groups desiring shared moments, or couples yearning for a secluded romantic escape, all while enjoying bespoke services like private chefs preparing local delicacies or dedicated concierges organizing personalized excursions into ${entityName}'s hidden gems.`
        });
        descriptionSegments.push({
          subHeader: `Seclusion with Accessibility`,
          content: `While offering ultimate seclusion, our villas are thoughtfully located to provide convenient access to ${entityType === 'landmark' ? `the iconic ${entityName} and local amenities, blending privacy with accessibility` : `the serene beaches, vibrant markets, charming villages, or dramatic landscapes of ${entityName}`}. You can easily arrange private transport for bespoke excursions or simply enjoy the tranquility of your private abode, soaking in the unique ambiance of the region. Experience authentic local life on your own terms.`
        });
        descriptionSegments.push({
          subHeader: `Tailored Experiences & Views`,
          content: `Many villas ${locationContext} are designed to offer stunning panoramic views, whether of ${entityName}'s coastline, mountains, or unique architectural features. They provide an ideal base for exploring the region's culinary scene, with private cooking classes available directly in your villa kitchen. For ultimate relaxation, consider in-villa spa treatments. The spaciousness allows for truly unique gatherings and events, making your stay a memorable celebration of privacy and luxury in ${entityName}.`
        });
        break;
      case "resort":
        descriptionSegments.push({
          subHeader: `World of Leisure & Entertainment`,
          content: `Immerse yourself in a world of endless leisure and entertainment at our magnificent resorts ${locationContext}. From the moment you arrive, every detail is crafted for your enjoyment – multiple pools shimmer under the sun, diverse dining venues tantalize your palate with flavors from around the world, and a myriad of activities, from exhilarating water sports to rejuvenating spa treatments, await your pleasure. These self-contained paradises promise a vacation where every desire is anticipated, ensuring seamless relaxation and boundless fun.`
        });
        descriptionSegments.push({
          subHeader: `Seamless Local Blend`,
          content: `While designed for an all-encompassing experience, our resorts also offer easy access to ${entityType === 'landmark' ? `the majestic ${entityName} and its captivating surroundings, allowing you to combine iconic sightseeing with luxurious relaxation` : `the natural wonders, cultural gems, and vibrant local life of ${entityName}`}. Many provide shuttle services or curated tours, allowing you to seamlessly blend resort indulgence with authentic local exploration. Discover pristine beaches, lush rainforests, or historical towns just a short distance away.`
        });
        descriptionSegments.push({
          subHeader: `Diverse Resort Offerings`,
          content: `Resorts in ${locationContext} cater to a wide range of interests, from family-friendly properties with extensive kids' programs and entertainment to adult-only havens designed for romance and tranquility. Beyond structured activities, many resorts integrate local culture into their offerings through traditional performances, craft workshops, or culinary experiences featuring regional specialties. This blend ensures that your stay is not just luxurious, but also deeply connected to the unique spirit of ${entityName}.`
        });
        break;
      case "apartment":
        descriptionSegments.push({
          subHeader: `Your Home Away From Home`,
          content: `Live like a local and enjoy the freedom of home with our comfortable apartments ${locationContext}. These spacious accommodations offer separate living areas, fully equipped kitchens, and often laundry facilities, providing an authentic and flexible base for your travels. It's ideal for extended stays, families, or simply those who prefer to explore ${entityName} at their own pace, truly integrating into the local community.`
        });
        descriptionSegments.push({
          subHeader: `Immerse in Local Life`,
          content: `Nestled within local neighborhoods, our apartments put you at the heart of ${entityName}'s daily life. Discover charming bakeries and artisan coffee shops just around the corner, explore bustling local markets for fresh ingredients, and find hidden gems known only to residents. The convenience of cooking your own meals and having more space allows for a truly immersive and cost-effective travel experience, fostering a deeper connection to the place.`
        });
        descriptionSegments.push({
          subHeader: `Flexible & Functional Stays`,
          content: `Apartments ${locationContext} often offer unique perspectives on urban or regional living. You might find properties in historic buildings with period features, or modern lofts with sleek designs and city views. Many are well-connected to public transportation, making exploration of ${entityName}'s wider attractions effortless. They are particularly suitable for remote workers seeking a comfortable and functional base, or for families needing more space and flexibility than a hotel can offer, allowing for a more relaxed and authentic visit.`
        });
        break;
      case "guest house":
        descriptionSegments.push({
          subHeader: `Authentic Local Hospitality`,
          content: `Experience genuine hospitality and an intimate connection to local culture with our charming guesthouses ${locationContext}. Each guesthouse offers a unique story and a personal touch, often run by passionate local hosts eager to share insider tips and make you feel truly at home in their vibrant community, far beyond a typical tourist experience.`
        });
        descriptionSegments.push({
          subHeader: `Deep Cultural Immersion`,
          content: `Located within the heart of local communities, guesthouses provide unparalleled access to authentic experiences in ${entityName}. Explore nearby artisanal shops and hidden eateries offering traditional cuisine, engage in meaningful conversations with locals, and gain a deeper appreciation for the region's unique heritage and daily rhythm. Your hosts can often guide you to hidden gems that larger tour groups miss.`
        });
        descriptionSegments.push({
          subHeader: `Personalized & Educational Stays`,
          content: `Guesthouses ${locationContext} vary widely in style, from charming historical homes to quaint rural retreats. Many offer homemade breakfasts featuring local ingredients, cultural workshops (e.g., cooking classes, craft lessons), or guided tours led by the hosts themselves. This provides an opportunity for a truly immersive and educational travel experience, fostering a stronger connection to the local community and ensuring your stay in ${entityName} is both comfortable and uniquely enriching.`
        });
        break;
      case "capsule hotel":
        descriptionSegments.push({
          subHeader: `Efficient Urban Exploration`,
          content: `For the smart, urban explorer, our modern capsule hotels ${locationContext} offer an incredibly efficient and comfortable base. Experience the novelty of a perfectly designed personal pod, providing a private, quiet space to recharge after a day of intense sightseeing, business activities, or vibrant urban exploration in ${entityName}. Each capsule maximizes comfort within its compact design.`
        });
        descriptionSegments.push({
          subHeader: `Prime Locations & Connectivity`,
          content: `Strategically located in bustling urban hubs, these capsule hotels provide unbeatable access to ${entityName}'s major transportation links, iconic landmarks like ${entityType === 'landmark' ? entityName : 'its main attractions'}, and vibrant nightlife. Maximize your exploration time with minimal commute, allowing you to efficiently navigate and experience the best of ${entityName}'s dynamic urban landscape.`
        });
        descriptionSegments.push({
          subHeader: `Compact Comfort, Social Hub`,
          content: `Despite their compact sleeping areas, many capsule hotels ${locationContext} offer spacious communal areas including lounges, co-working spaces, and cafes, fostering a unique social environment. They are perfect for travelers looking for an affordable, minimalist, yet surprisingly comfortable lodging option, ideal for short stays or those prioritizing location and efficiency in a high-density urban setting.`
        });
        break;
      case "yurt":
        descriptionSegments.push({
          subHeader: `Glamping in Nature's Embrace`,
          content: `Immerse yourself in nature's embrace with our unique yurts ${locationContext}. Experience glamping at its finest, where the rustic charm of traditional nomadic dwellings meets modern comforts, all set against a backdrop of breathtaking landscapes unique to ${entityName}. Imagine waking to the sounds of nature, surrounded by untouched beauty, for a truly rejuvenating escape.`
        });
        descriptionSegments.push({
          subHeader: `Outdoor Adventures & Tranquility`,
          content: `From your cozy yurt, you're perfectly positioned to explore the pristine natural beauty of ${entityName}. Engage in unique outdoor activities like guided nature walks, birdwatching, or simply savor the tranquility by a campfire. Many yurts are located near scenic trails, lakes, or forests, offering seamless integration with the outdoors and a chance to truly disconnect.`
        });
        descriptionSegments.push({
          subHeader: `Eco-Friendly Luxury`,
          content: `Yurts ${locationContext} often provide a unique blend of comfort and environmental consciousness. They are an ideal choice for eco-tourism, offering a low-impact way to enjoy ${entityName}'s wilderness. Expect comfortable bedding, and sometimes even private facilities, making your glamping adventure a luxurious experience amidst serene natural settings.`
        });
        break;
      case "treehouse":
        descriptionSegments.push({
          subHeader: `Elevated Dreams & Seclusion`,
          content: `Fulfill your childhood dreams with an enchanting treehouse stay ${locationContext}. Perched high among the canopies, these elevated sanctuaries offer unparalleled seclusion, unique design, and stunning aerial views of ${entityName}'s natural wonders, perfect for a magical escape into the heart of the forest or alongside a scenic vista.`
        });
        descriptionSegments.push({
          subHeader: `Immersive Nature Connection`,
          content: `Your treehouse provides a truly immersive natural experience in ${entityName}. Explore the forest floor, discover local flora and fauna, and enjoy the peace of being suspended above the ground, yet still within reach of charming local towns or natural parks. It's a unique vantage point to observe the local ecosystem and unwind.`
        });
        descriptionSegments.push({
          subHeader: `Whimsical Comforts`,
          content: `Treehouses ${locationContext} are often designed with sustainability in mind, offering an eco-friendly way to enjoy the wilderness. Many feature private balconies for birdwatching, and some even provide amenities like outdoor showers or hot tubs, blending rustic charm with surprising luxury for an unforgettable and whimsical retreat in ${entityName}.`
        });
        break;
      case "tent":
        descriptionSegments.push({
          subHeader: `Luxury Glamping Redefined`,
          content: `Redefine outdoor adventure with our luxurious glamping tents ${locationContext}. Experience the thrill of being close to nature without compromising on comfort. These spacious, beautifully furnished tents provide a sophisticated retreat amidst the stunning landscapes of ${entityName}, offering an elegant escape under the open sky.`
        });
        descriptionSegments.push({
          subHeader: `Wilderness Access & Activities`,
          content: `Our glamping tents offer a unique vantage point to explore ${entityName}'s wild side. Enjoy exclusive access to hiking trails, serene lakeside spots, or open fields perfect for stargazing, all while retreating to a comfortable, stylish haven. Many properties offer curated outdoor activities like guided safaris or nature photography workshops.`
        });
        descriptionSegments.push({
          subHeader: `Adventure Meets Indulgence`,
          content: `These luxurious tents ${locationContext} typically include proper bedding, climate control, and sometimes private en-suite bathrooms, making them far from traditional camping. They provide a perfect balance of adventure and indulgence, allowing you to truly immerse yourself in the natural beauty of ${entityName} without sacrificing modern conveniences.`
        });
        break;
      case "dome house":
        descriptionSegments.push({
          subHeader: `Futuristic Retreats & Views`,
          content: `Step into the future of unique stays with our captivating dome houses ${locationContext}. These geodesic marvels offer panoramic views and an immersive connection to ${entityName}'s diverse environments, blending innovative architecture with the serene beauty of the outdoors. Imagine gazing at the stars from your bed or witnessing stunning sunrises through expansive windows.`
        });
        descriptionSegments.push({
          subHeader: `Immersive Natural Connection`,
          content: `From your transparent dome, gaze at the starlit skies or the sweeping landscapes of ${entityName}. These unique locations often provide access to secluded natural spots, allowing for unparalleled privacy and an intimate experience with the local environment. It's an ideal base for photography, stargazing, and unique nature walks.`
        });
        descriptionSegments.push({
          subHeader: `Innovative Design, Pristine Beauty`,
          content: `Dome houses ${locationContext} offer a minimalist yet luxurious experience, often featuring modern amenities within their unique spherical design. They are perfect for those seeking an unconventional and memorable getaway, providing a blend of architectural novelty and deep connection with the stunning natural surroundings of ${entityName}.`
        });
        break;
      case "ryokan":
        descriptionSegments.push({
          subHeader: `Journey into Japanese Tradition`,
          content: `Immerse yourself in authentic Japanese hospitality with a traditional ryokan stay ${locationContext}. Experience the serene ritual of changing into a yukata, savoring multi-course kaiseki dinners meticulously prepared with local ingredients, and unwinding in natural hot springs (onsen), all deeply rooted in the cultural essence of ${entityName}.`
        });
        descriptionSegments.push({
          subHeader: `Cultural Exploration & Serenity`,
          content: `Our ryokans offer a gateway to ${entityName}'s rich cultural heritage. Explore ancient temples, meticulously manicured gardens, and traditional craft shops, often within walking distance. Experience local festivals, tea ceremonies, or traditional performances for a profound cultural immersion that complements your peaceful stay.`
        });
        descriptionSegments.push({
          subHeader: `Authentic Japanese Experience`,
          content: `Located in picturesque settings, ryokans ${locationContext} provide an authentic glimpse into Japanese traditions. Many are situated near scenic natural beauty spots or historical villages, allowing guests to combine cultural discovery with tranquil relaxation, making your visit to ${entityName} truly unforgettable.`
        });
        break;
      case "machiya":
        descriptionSegments.push({
          subHeader: `Live Japan's Rich History`,
          content: `Uncover the intimate charm of Japan's traditional past with our beautifully restored machiyas ${locationContext}. These wooden townhouses offer a unique blend of heritage and modern comforts, allowing you to truly inhabit the spirit of ${entityName} and experience privacy and cultural immersion in the heart of historic neighborhoods.`
        });
        descriptionSegments.push({
          subHeader: `Heart of Local Life`,
          content: `Nestled within the charming streets of ${entityName}, machiyas provide a perfect base for authentic exploration. Discover hidden alleyways, quaint local eateries, and traditional artisan workshops, truly becoming part of the city's living history. You're steps away from local life, allowing for spontaneous discoveries.`
        });
        descriptionSegments.push({
          subHeader: `Space, Privacy & Culture`,
          content: `Machiyas ${locationContext} are ideal for those seeking more space and a residential feel compared to typical hotel rooms. They offer fully equipped kitchens, providing flexibility for self-catering, and are often located near public transport, making it easy to explore ${entityName}'s wider attractions while enjoying a unique cultural experience.`
        });
        break;
      case "country house":
        descriptionSegments.push({
          subHeader: `Serene Countryside Escape`,
          content: `Escape to serene countryside living with our charming country houses ${locationContext}. These properties offer a tranquil retreat amidst picturesque landscapes, perfect for unwinding, enjoying peaceful solitude, or gathering loved ones in the idyllic setting of ${entityName}, far from urban distractions.`
        });
        descriptionSegments.push({
          subHeader: `Embrace Rural Rhythms`,
          content: `From your country house, explore the gentle rhythms of rural ${entityName}. Discover charming villages, local markets brimming with fresh produce, and scenic walking or cycling trails, allowing for a deep connection with the local landscape and community. Experience authentic regional cuisine at nearby family-run restaurants.`
        });
        descriptionSegments.push({
          subHeader: `Timeless Charm & Tranquility`,
          content: `Country houses ${locationContext} are often surrounded by sprawling gardens, vineyards, or woodlands, providing ample space for relaxation and outdoor activities. They are perfect for family reunions, quiet romantic getaways, or solo retreats, offering a sense of timeless peace and a refreshing break from the usual travel pace in ${entityName}.`
        });
        break;
      case "haveli":
        descriptionSegments.push({
          subHeader: `Step into Regal India`,
          content: `Step back in time into the opulent past of India with our magnificent havelis ${locationContext}. These exquisitely restored traditional mansions offer a regal experience, transporting you to an era of grandeur and intricate artistry, allowing you to truly live a piece of ${entityName}'s history and heritage.`
        });
        descriptionSegments.push({
          subHeader: `Immersive Heritage Exploration`,
          content: `Our havelis provide a majestic base for exploring the rich historical tapestry of ${entityName}. Visit nearby palaces, ancient forts, and bustling bazaars, often accompanied by cultural performances and traditional dining within the haveli itself, immersing you in local heritage and vibrant street life.`
        });
        descriptionSegments.push({
          subHeader: `Architectural Grandeur & Luxury`,
          content: `Havelis ${locationContext} are architectural marvels, often featuring multiple courtyards, intricate frescoes, and antique furnishings. They offer a unique blend of historical authenticity and modern luxury, providing an unforgettable stay for history enthusiasts and cultural explorers seeking a profound connection with India's royal legacy in ${entityName}.`
        });
        break;
      case "riad":
        descriptionSegments.push({
          subHeader: `Hidden Moroccan Oasis`,
          content: `Discover a hidden oasis of tranquility within the vibrant medinas with our enchanting riads ${locationContext}. These traditional Moroccan houses, built around serene interior courtyards, offer a peaceful escape from the bustling souks, inviting you into a world of exquisite beauty and authentic hospitality unique to ${entityName}.`
        });
        descriptionSegments.push({
          subHeader: `Medina Exploration & Peace`,
          content: `From your riad, navigate the labyrinthine alleys of ${entityName}'s medina, discovering artisan workshops, spice markets, and historical landmarks. Enjoy traditional tea on the rooftop terrace, absorbing the unique sounds and scents of the city, and savor authentic Moroccan cuisine at hidden local eateries.`
        });
        descriptionSegments.push({
          subHeader: `Intimate Cultural Immersion`,
          content: `Riads ${locationContext} are perfect for an intimate and immersive cultural experience. They offer personalized service, often including traditional breakfasts and cooking classes, fostering a deep connection with Moroccan culture and providing a tranquil sanctuary amidst the lively energy of ${entityName}.`
        });
        break;
      case "farm stay":
        descriptionSegments.push({
          subHeader: `Connect with Rural Life`,
          content: `Connect with the land and embrace rural life with our charming farm stays ${locationContext}. These unique accommodations offer an immersive experience, inviting you to step away from the urban rush and discover the tranquility and authenticity of countryside living in ${entityName}, often with opportunities to interact with farm animals and engage in agricultural activities.`
        });
        descriptionSegments.push({
          subHeader: `Authentic Farm-to-Table Experience`,
          content: `Your farm stay offers a direct connection to the agricultural heart of ${entityName}. Engage in farm activities, taste fresh farm-to-table produce, and explore scenic trails, gaining unique insights into the local farming culture and natural beauty. It's a refreshing escape from the ordinary.`
        });
        descriptionSegments.push({
          subHeader: `Wholesome & Educational Escape`,
          content: `Farm stays ${locationContext} are ideal for families seeking an educational and wholesome vacation, or anyone looking for a peaceful retreat in nature. They provide a unique blend of rustic charm and comfort, allowing you to truly unwind and appreciate the simple pleasures of rural life in ${entityName}.`
        });
        break;
      case "cabin":
        descriptionSegments.push({
          subHeader: `Wilderness Retreats Await`,
          content: `Escape to the serene embrace of the wilderness with our captivating cabins ${locationContext}. Perfect for nature lovers, these rustic yet comfortable retreats are nestled amidst forests, mountainsides, or by tranquil lakes, offering profound solitude and access to ${entityName}'s pristine outdoors for true rejuvenation.`
        });
        descriptionSegments.push({
          subHeader: `Immerse in Nature's Quiet Grandeur`,
          content: `From your cabin, immerse yourself in the natural wonders of ${entityName}. Enjoy secluded hiking trails, pristine fishing spots, or simply the peace of being surrounded by untouched nature, far from the distractions of modern life. It's a perfect base for outdoor adventures and relaxation.`
        });
        descriptionSegments.push({
          subHeader: `Rustic Comfort & Privacy`,
          content: `Cabins ${locationContext} offer a unique blend of privacy and immersion in nature. Many feature cozy interiors with fireplaces and stunning views, providing an ideal setting for romantic getaways or peaceful family vacations. They allow you to truly disconnect and reconnect with the tranquility of ${entityName}'s wilderness.`
        });
        break;
      case "chalet":
        descriptionSegments.push({
          subHeader: `Quintessential Mountain Escape`,
          content: `Experience the quintessential mountain escape with our luxurious chalets ${locationContext}. These enchanting alpine-style homes offer warmth, comfort, and breathtaking panoramic views of ${entityName}'s majestic peaks or lush valleys, perfect for an unforgettable ski trip or serene summer hike.`
        });
        descriptionSegments.push({
          subHeader: `Alpine Adventures & Refined Comfort`,
          content: `Located in the heart of ${entityName}'s mountain landscapes, chalets provide direct access to world-class ski resorts or stunning hiking trails. Explore charming alpine villages, savor local delicacies, and fully embrace the active mountain lifestyle, making your holiday a blend of adventure and refined comfort.`
        });
        descriptionSegments.push({
          subHeader: `Spacious Sanctuaries with Views`,
          content: `Chalets ${locationContext} are ideal for large groups or families, offering spacious interiors, private amenities like saunas or hot tubs, and a cozy atmosphere. They provide a luxurious base for exploring the natural grandeur of ${entityName} while enjoying a private and comfortable sanctuary.`
        });
        break;
      case "boat":
        descriptionSegments.push({
          subHeader: `Unique Floating Sanctuaries`,
          content: `Embark on a truly unique and memorable adventure with our extraordinary boat accommodations ${locationContext}. From sleek yachts to charming riverboats, these floating sanctuaries offer a distinctive perspective of ${entityName}'s waterways, promising freedom and unparalleled views of its coastal or riverine beauty.`
        });
        descriptionSegments.push({
          subHeader: `Explore from the Water`,
          content: `Your boat stay offers a unique way to explore ${entityName}. Cruise along its scenic coastlines, navigate historical canals, or anchor in secluded coves, discovering hidden gems and enjoying waterside dining experiences that land-based accommodations can't offer. It's an immersive and dynamic travel experience.`
        });
        descriptionSegments.push({
          subHeader: `Adventurous & Tranquil Lodging`,
          content: `Boat accommodations ${locationContext} provide an adventurous yet comfortable lodging option. They are perfect for maritime enthusiasts or anyone seeking an unconventional getaway, allowing you to discover the beauty of ${entityName} from a completely new vantage point, creating truly unique memories on the water.`
        });
        break;
      case "houseboat":
        descriptionSegments.push({
          subHeader: `Peaceful Waterside Retreat`,
          content: `Discover a uniquely tranquil escape with our charming houseboats ${locationContext}. These delightful homes on the water offer a serene and intimate lodging experience, typically moored in picturesque canals or calm lakes, providing a peaceful retreat with breathtaking waterside views of ${entityName}.`
        });
        descriptionSegments.push({
          subHeader: `Embrace the Water's Rhythm`,
          content: `From your houseboat, enjoy the serene rhythms of life on the water in ${entityName}. Explore charming waterfront towns, fish directly from your deck, or simply relax and observe the local aquatic wildlife, offering a calm and unique perspective on the destination. It's a perfect blend of home comfort and natural beauty.`
        });
        descriptionSegments.push({
          subHeader: `Unique Charm & Home Comforts`,
          content: `Houseboats ${locationContext} are ideal for those who appreciate quietude and a unique setting. They often feature spacious living areas and fully equipped kitchens, providing all the comforts of home while offering a distinctive way to experience the tranquil waterways and landscapes of ${entityName}.`
        });
        break;
      default:
        descriptionSegments.push({
          subHeader: `Unique Experiences in ${entityName}`,
          content: `Our ${categoryName.toLowerCase()} ${locationContext} offer a truly immersive experience, blending comfort with the unique essence of the location. These properties are designed to enhance your journey, offering amenities and ambiance specific to their category and surroundings, ensuring a memorable stay that goes beyond the ordinary.`
        });
        descriptionSegments.push({
          subHeader: `Connect with Local Life`,
          content: `Strategically positioned, our properties provide excellent access to ${entityType === 'landmark' ? `the iconic ${entityName} and surrounding attractions` : `the cultural heart and natural wonders of ${entityName}`}. Engage with local life, discover authentic cuisine, and create lasting memories, fully immersing yourself in the destination's unique charm and offerings.`
        });
        descriptionSegments.push({
          subHeader: `Beyond Conventional Stays`,
          content: `We curate unique experiences ${locationContext}, highlighting properties that offer more than just accommodation. Whether through architectural distinctiveness, local culinary integration, or unique activity access, our aim is to provide a stay in ${entityName} that is as enriching as it is comfortable, fostering a deep connection with the local environment.`
        });
        break;
    }

    descriptionSegments.push({
      subHeader: `Why Choose Hoteloza for Your Stay ${locationContext}?`,
      content: `Hoteloza is your trusted partner in finding the perfect ${categoryName.toLowerCase()} ${locationContext}. We provide meticulous details, authentic guest reviews, and exclusive deals, ensuring a seamless booking experience. Our platform is designed to help you easily discover and secure the ideal accommodation that perfectly complements your travel aspirations, making your planning simple and secure.`
    });

    descriptionSegments.push({
      subHeader: `Book Your Perfect Getaway`,
      content: `Ready to discover your perfect retreat ${locationContext}? Explore Hoteloza's extensive collection of ${categoryName.toLowerCase()} today and unlock an unforgettable journey designed just for you. Your ultimate travel experience awaits, promising comfort, unique experiences, and cherished memories.`
    });

    return descriptionSegments.filter(segment => segment.content.trim() !== '');
  },
};

export default contentTemplates;