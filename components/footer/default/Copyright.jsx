const Copyright = () => {
  return (
    <div className="row justify-between items-center y-gap-10">
      <div className="col-auto">
        <div className="d-flex items-center">
          © {new Date().getFullYear()} by
          <a
            href="https://hoteloza.com"
            className="mx-2"
            target="_blank"
            rel="noopener noreferrer"
          >
            Hoteloza
          </a>
          All rights reserved.
        </div>
      </div>
      {/* End .col */}

      <div className="col-auto" style={{ marginLeft: 'auto' }}>
        {/* The div below was removed as it contained the links for Privacy, Terms, and Site Map */}
      </div>
      {/* End .col */}
    </div>
  );
};

export default Copyright;