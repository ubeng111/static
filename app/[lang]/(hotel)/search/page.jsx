// app/search/page.jsx
import { Suspense } from 'react';
import SearchClient from './SearchClient';
import { getdictionary } from '@/dictionaries/get-dictionary'; // Import getdictionary

export const dynamic = 'force-dynamic'; // Force dynamic rendering to handle query parameters

// Make SearchPage an async component to fetch dictionary
export default async function SearchPage({ params }) { // Add params to receive lang
  const locale = params?.lang || 'en'; // Extract locale from params
  const dictionary = await getdictionary(locale); // Fetch the dictionary

  return (
    <>
      <div className="header-margin"></div>
      <Suspense fallback={<div>Loading search results...</div>}>
        {/* Pass dictionary and currentLang (locale) to SearchClient */}
        <SearchClient dictionary={dictionary} currentLang={locale} />
      </Suspense>
      {/* Remove the duplicate SearchClient call if it's not intended */}
      {/* <SearchClient dictionary={dictionary} currentLang={locale} /> */}
    </>
  );
}