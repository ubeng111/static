// app/search/page.jsx
import { Suspense } from 'react';
import SearchClient from './SearchClient'; // Import the client component
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import CallToActions from "@/components/common/CallToActions";

export default function SearchPage() {
  return (
    <>
      <div className="header-margin"></div>
      <Header11 />
      <Suspense fallback={<div>Loading search results...</div>}>
        <SearchClient />
      </Suspense>
      <CallToActions />
      <DefaultFooter />
    </>
  );
}