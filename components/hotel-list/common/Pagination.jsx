'use client';

import ReactPaginate from 'react-paginate';  // Pastikan Anda menginstal react-paginate jika belum

const Pagination = ({ totalHotels, currentPage, setCurrentPage, itemsPerPage = 20 }) => {
  const totalPages = Math.ceil(totalHotels / itemsPerPage);  // Menghitung total halaman berdasarkan totalHotels

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1; // react-paginate uses zero-based index, but we want 1-based index
    setCurrentPage(selectedPage);  // Mengubah halaman aktif
  };

  return (
    <div className="border-top-light mt-30 pt-30">
      <div className="row x-gap-10 y-gap-20 justify-between md:justify-center">
        <div className="col-md-auto md:order-3">
          <div className="row x-gap-20 y-gap-20 items-center md:d-none">
            {/* Gunakan ReactPaginate untuk paginasi */}
            <ReactPaginate
              pageCount={totalPages} // Total halaman
              onPageChange={handlePageClick} // Fungsi untuk menangani perubahan halaman
              containerClassName="pagination" // Class untuk container
              activeClassName="active" // Class untuk halaman aktif
              pageClassName="page-item" // Class untuk setiap item halaman
              pageLinkClassName="page-link" // Class untuk link halaman
              previousClassName="previous-item" // Class untuk tombol sebelumnya
              nextClassName="next-item" // Class untuk tombol berikutnya
              breakLabel="..." // Label untuk pemisah halaman
              marginPagesDisplayed={2} // Berapa banyak halaman di awal dan akhir yang ditampilkan
              pageRangeDisplayed={5} // Berapa banyak halaman yang ditampilkan pada satu waktu
              previousLabel={<i className="icon-chevron-left text-12" />} // Ikon untuk tombol sebelumnya
              nextLabel={<i className="icon-chevron-right text-12" />} // Ikon untuk tombol berikutnya
            />
          </div>

          <div className="row x-gap-10 y-gap-20 justify-center items-center d-none md:d-flex">
            <ReactPaginate
              pageCount={totalPages}
              onPageChange={handlePageClick}
              containerClassName="pagination"
              activeClassName="active"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="previous-item"
              nextClassName="next-item"
              breakLabel="..."
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              previousLabel={<i className="icon-chevron-left text-12" />}
              nextLabel={<i className="icon-chevron-right text-12" />}
            />
          </div>

          <div className="text-center mt-30 md:mt-10">
            <div className="text-14 text-light-1">
              {((currentPage - 1) * itemsPerPage) + 1} – {Math.min(currentPage * itemsPerPage, totalHotels)} of {totalHotels} hotels found
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
