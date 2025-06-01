import Copyright from "./Copyright";

const index = () => {
  return (
    <footer className="footer -type-1">
      <div className="container">
        <div className="pt-20 pb-20"> {/* Mengurangi padding menjadi lebih kecil */}
          <div className="row y-gap-40 justify-between xl:justify-start">
            {/* Contact Us section removed */}
            {/* FooterContent component removed */}
            {/* Mobile section removed */}
          </div>
        </div>
        {/* End footer top */}

        <div className="py-10 border-top-light"> {/* Mengurangi padding vertikal menjadi lebih kecil */}
          <Copyright />
        </div>
        {/* End footer-copyright */}
      </div>
      {/* End container */}
    </footer>
  );
};

export default index;
