// app/not-found.jsx
import DefaultFooter from "@/components/footer";
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
      <NotFound />
      <CallToActions />
      <DefaultFooter />
    </>
  );
};

export default NotFoundPage;