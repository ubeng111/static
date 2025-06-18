// ClientPage.jsx (Category - app/[lang]/(hotel)/[categoryslug]/ClientPage.jsx)
'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic'; // Pastikan dynamic sudah diimpor
import useSWR from 'swr';

// --- MODIFIKASI: Impor Komponen Secara Dinamis (next/dynamic) ---

// Komponen yang sudah dinamis:
const TopBreadCrumbCategory = dynamic(() => import('@/components/hotel-list/hotel-list-v5/TopBreadCrumbCategory'), { ssr: false });

// Tambahkan dynamic import untuk komponen-komponen lain:
const DynamicRelatedcategory88 = dynamic(() => import('@/components/hotel-single/Relatedcategory88'), {
  ssr: false,
  loading: () => <p>Loading related categories...</p>,
});
const DynamicHotelProperties88 = dynamic(() => import('@/components/hotel-list/hotel-list-v5/HotelProperties88'), {
  ssr: false,
  loading: () => <p>Loading hotel properties...</p>,
});
const DynamicPaginationComponent = dynamic(() => import('@/components/hotel-list/hotel-list-v5/PaginationComponent'), {
  ssr: false,
  loading: () => <p>Loading pagination...</p>,
});
const DynamicFooter = dynamic(() => import("@/components/footer"), {
  ssr: false,
  loading: () => <p>Loading footer...</p>,
});
const DynamicCallToActions = dynamic(() => import("@/components/common/CallToActions"), {
  ssr: false,
  loading: () => <p>Loading call to actions...</p>,
});
const DynamicMainFilterSearchBox = dynamic(() => import("@/components/hotel-list/common/MainFilterSearchBox"), {
  ssr: false,
  loading: () => <p>Loading search box...</p>,
});
const DynamicHeader11 = dynamic(() => import("@/components/header/header-11"), {
  ssr: false,
  loading: () => <p>Loading header...</p>,
});

// IMPORT FaqCategory DI SINI
const DynamicFaqCategory = dynamic(() => import('@/components/faq/Faqcategory'), {
  ssr: false, // Pastikan path ini benar dan set ssr ke false jika ada interaktivitas klien
  loading: () => <p>Loading FAQs...</p>,
});

// --- AKHIR MODIFIKASI next/dynamic ---


// Pastikan `ClientPage` menerima `categoryslug` dan `currentLang`
// Jika Anda perlu `countryslug`, `stateslug`, `cityslug` di sini
// sebagai parameter URL, tambahkan juga di props ini.
// Contoh: export default function ClientPage({ categoryslug, countryslug, stateslug, cityslug, dictionary, currentLang }) {
export default function ClientPage({ categoryslug, dictionary, currentLang }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page')) || 1;

  const commonDict = dictionary?.common || {};
  const categoryPageDict = dictionary?.categoryPage || {};
  const headerDict = dictionary?.header || {};
  const faqDict = dictionary?.faq || {}; // Pastikan ini juga diakses dari dictionary jika FAQ punya teks sendiri

  const fetcher = useCallback(async (url) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(commonDict.failedToLoadHotelList || 'Failed to fetch data');
    }
    return response.json();
  }, [commonDict.failedToLoadHotelList]);

  // Asumsi API Anda sudah memberikan hotel dengan properti country_slug, state_slug, city_slug
  const { data, error, isLoading } = useSWR(`/api/${categoryslug}?page=${page}`, fetcher, {
    revalidateOnFocus: false,
    keepPreviousData: true,
  });

  const hotels = useMemo(() => data?.hotels || [], [data]);
  const relatedcategory = useMemo(() => data?.relatedcategory || [], [data]);
  const pagination = useMemo(() => data?.pagination || { page: 1, totalPages: 1, totalHotels: 0 }, [data]);

  const formattedCategory = useMemo(
    () => (categoryslug ? categoryslug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : categoryPageDict.categoryDefault || 'Category'),
    [categoryslug, categoryPageDict.categoryDefault]
  );

  // Ambil 3 hotel teratas atau sesuai keinginan untuk FAQ "best-rated"
  // Pastikan objek hotel di `hotels` memiliki `country_slug`, `state_slug`, dan `city_slug`
  const topRatedHotelsForFAQ = useMemo(() => {
    // Anda bisa menambahkan logika penyortiran di sini jika diperlukan
    return hotels.slice(0, 3);
  }, [hotels]);


  const handlePageClick = useCallback(
    (event) => {
      const newPage = event.selected + 1;
      if (newPage === pagination.page) return;

      router.push(`/${currentLang}/${categoryslug}?page=${newPage}`);
      window.scrollTo(0, 0);
    },
    [categoryslug, pagination.page, router, currentLang]
  );

  if (isLoading) {
    return (
      <div className="preloader">
        <div className="preloader__wrap">
          <div className="preloader__icon"></div>
        </div>
        <div className="preloader__title">{commonDict.preloaderTitle || 'Hoteloza..'}</div>
      </div>
    );
  }

  if (error) {
    return <div>{commonDict.errorLoadingData || 'Error loading data. Please try again later.'}</div>;
  }

  if (!hotels.length) {
    return <div>{commonDict.noHotelsFound || 'No hotels found for this category.'}</div>;
  }

  return (
    <>
      {/* Ganti Header11 dengan DynamicHeader11 */}
      <DynamicHeader11 dictionary={dictionary} currentLang={currentLang} />

      <div className="header-margin"></div>

      <section className="section-bg pt-40 pb-40 relative z-5">
        <div className="section-bg__item col-12">
          <img
            src="/img/misc/bg-1.webp"
            srcSet="/img/misc/bg-1.webp 480w, /img/misc/bg-1.webp 768w, /img/misc/bg-1.webp 1200w"
            alt={headerDict.luxuryBackgroundImageAlt || "Luxury background image"}
            loading="lazy"
            className="w-full h-full object-cover"
            width={1200}
            height={800}
          />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
                <h1 className="text-30 fw-600 text-white">
                  {categoryPageDict.discoverLuxeStaysIn?.replace('{formattedCategory}', formattedCategory) || `Discover Luxe Stays In ${formattedCategory}`}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TopBreadCrumbCategory sudah dinamis, biarkan seperti ini */}
      <TopBreadCrumbCategory categoryslug={categoryslug} dictionary={dictionary} />

      <section className="layout-pt-md">
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* Ganti MainFilterSearchBox dengan DynamicMainFilterSearchBox */}
              <DynamicMainFilterSearchBox dictionary={dictionary} currentLang={currentLang} />
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row">
            {/* Ganti HotelProperties88 dengan DynamicHotelProperties88 */}
            <DynamicHotelProperties88 hotels={hotels} dictionary={dictionary} currentLang={currentLang} />
          </div>
        </div>
      </section>

      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', transform: 'translateY(-60px)', marginTop: '5%' }}>
          {/* Ganti PaginationComponent dengan DynamicPaginationComponent */}
          <DynamicPaginationComponent
            pageCount={pagination.totalPages}
            onPageChange={handlePageClick}
            containerClassName="pagination"
            activeClassName="active"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousLabel={null}
            nextLabel={null}
            forcePage={pagination.page - 1}
          />
        </div>
      )}

      <div className="pt-40 sm:pt-20 item_gap-x30">
        {relatedcategory.length > 0 ? (
          // Pastikan komentar di luar ekspresi JSX
          <DynamicRelatedcategory88 relatedcategory={relatedcategory} categoryslug={categoryslug} dictionary={dictionary} currentLang={currentLang} />
        ) : (
          <p>{commonDict.noRelatedCategoriesFound || 'No related categories found.'}</p>
        )}
      </div>

      <section id="faq" className="pt-40 layout-pb-md">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row y-gap-20">
              <div className="col-12 text-center">
                <h2 className="text-22 fw-500">
                  {categoryPageDict.faqsAboutHotels?.replace('{formattedCategory}', formattedCategory) || `FAQs about ${formattedCategory} hotels`}
                </h2>
              </div>
              <div className="col-lg-8 offset-lg-2">
                <div className="accordion -simple row y-gap-20 js-accordion">
                  {/* MENGGUNAKAN KOMPONEN FAQCATEGORY DI SINI */}
                  {/* Ganti FaqCategory dengan DynamicFaqCategory */}
                  <DynamicFaqCategory
                    category={formattedCategory} // Menggunakan kategori yang sudah diformat
                    items={topRatedHotelsForFAQ} // Meneruskan hotel teratas untuk ditampilkan di FAQ
                    currentLang={currentLang}    // Meneruskan bahasa saat ini
                    categoryslug={categoryslug}
                    dictionary={dictionary}  // Meneruskan slug kategori saat ini
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Ganti CallToActions dengan DynamicCallToActions */}
      <DynamicCallToActions dictionary={dictionary} currentLang={currentLang} />

      {/* Ganti Footer dengan DynamicFooter */}
      <DynamicFooter dictionary={dictionary} currentLang={currentLang} />

    </>
  );
}