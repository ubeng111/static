import DefaultHeader from "@/components/header/default-header";
import DefaultFooter from "@/components/footer/default";
import CallToActions from "@/components/common/CallToActions";
import NotFound from "@/components/common/NotFound"; // Import the NotFound component

export const metadata = {
  title: "404 || GoTrip - Travel & Tour React NextJS Template",
  description: "Sorry, the page you're looking for doesn't exist.",
};

const Page = () => {
  return (
    <>
      <div className="header-margin"></div>
      <DefaultHeader />
      <NotFound />  {/* Display the NotFound component */}
      <CallToActions />
      <DefaultFooter />
    </>
  );
};

export default Page;
