// app/search/page.jsx
import { Suspense } from 'react';
import SearchClient from './SearchClient';
import Header11 from "@/components/header/header-11";
import Footer from "@/components/footer/";
import CallToActions from "@/components/common/CallToActions";

export const dynamic = 'force-dynamic'; // Force dynamic rendering to handle query parameters

export default function SearchPage() {
  return (
    <>
      <div className="header-margin"></div>
      <Header11 />
      <Suspense fallback={<div>Loading search results...</div>}>
        <SearchClient />
      </Suspense>
      <CallToActions />
      <Footer />
    </>
  );
}