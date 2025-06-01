// app/not-found.jsx
import DefaultHeader from "@/components/header/default-header";
import DefaultFooter from "@/components/footer/default";
import CallToActions from "@/components/common/CallToActions";
import NotFound from "@/components/common/NotFound";

export const metadata = {
  title: "404 || Hotelazo",
  description: "Sorry, the page you're looking for doesn't exist.",
};

const NotFoundPage = () => {
  return (
    <>
      <div className="header-margin"></div>
      <DefaultHeader />
      <NotFound />
      <CallToActions />
      <DefaultFooter />
    </>
  );
};

export default NotFoundPage;
