// app/not-found.jsx
import DefaultFooter from "@/components/footer/default";
import CallToActions from "@/components/common/CallToActions";
import NotFound from "@/components/common/NotFound";
import Header1 from "@/components/header/header-11";


export const metadata = {
  title: "404 || Hotelazo",
  description: "Sorry, the page you're looking for doesn't exist.",
};

const NotFoundPage = () => {
  return (
    <>
      <div className="header-margin"></div>
      <Header1 />
      <NotFound />
      <CallToActions />
      <DefaultFooter />
    </>
  );
};

export default NotFoundPage;
