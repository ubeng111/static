import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { styled, useTheme } from '@mui/material/styles';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

// Styled Pagination Component
const StyledPagination = styled(Pagination)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(2, 0),

  '& .MuiPagination-ul': {
    display: 'flex',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    gap: theme.spacing(0.75), // Consistent spacing between items
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  '& .MuiPaginationItem-root': {
    minWidth: '48px', // Default 48px touch target for desktop
    height: '48px',
    borderRadius: theme.shape.borderRadius, // Soft rounded corners
    fontSize: '1rem',
    fontWeight: theme.typography.fontWeightMedium,
    // Latar belakang tombol default kini biru muda
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary[800] : theme.palette.primary[50],
    // Warna teks kontras dengan biru muda ini (biasanya biru gelap)
    color: theme.palette.mode === 'dark' ? theme.palette.primary[100] : theme.palette.primary[900],
    // Border hitam untuk tombol normal
    border: `1px solid ${theme.palette.mode === 'dark' ? '#000000' : '#000000'}`, // Border hitam
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)', // Bayangan lebih ringan
    transition: 'all 0.2s ease-in-out', // Smooth transitions
    padding: '0 12px',

    '&:hover': {
      backgroundColor: theme.palette.primary.main, // Biru utama Material-UI saat hover
      color: theme.palette.primary.contrastText, // Teks kontras (biasanya putih)
      borderColor: theme.palette.primary.main, // Border jadi biru utama
      transform: 'translateY(-2px)', // Slight lift effect
      boxShadow: theme.shadows[1], // Soft shadow on hover
    },

    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${theme.palette.primary.light}`, // Clear blue focus ring
      borderColor: theme.palette.primary.main,
    },
  },

  '& .Mui-selected': {
    // Background color adalah biru utama tema Anda
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText, // Teks kontras (biasanya putih)
    fontWeight: theme.typography.fontWeightBold,
    // Border biru untuk tombol aktif
    border: `1px solid ${theme.palette.primary.main}`, // Border biru
    boxShadow: theme.shadows[2], // Slightly stronger shadow for active state
    transform: 'none', // No lift effect when active

    '&:hover': {
      backgroundColor: theme.palette.primary.dark, // Biru lebih gelap saat hover pada yang terpilih
      color: theme.palette.primary.contrastText,
      borderColor: theme.palette.primary.dark,
    },
  },

  '& .Mui-disabled': {
    opacity: 0.5, // Sedikit lebih transparan
    backgroundColor: theme.palette.action.disabledBackground, // Tetap abu-abu untuk disabled
    color: theme.palette.action.disabled, // Teks abu-abu untuk disabled
    border: `1px solid ${theme.palette.action.disabledBackground}`,
    boxShadow: 'none',
    transform: 'none',
  },

  // Styling khusus untuk tombol 'Previous'/'Next' (ikon)
  '& .MuiPaginationItem-previousNext': {
    minWidth: '48px', // Consistent 48px for desktop
    height: '48px',
    // Latar belakang juga biru muda, konsisten dengan tombol angka normal
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.primary[800] : theme.palette.primary[50],
    color: theme.palette.primary.main, // Ikon panah biru utama
    // Border biru untuk tombol Previous/Next
    border: `1px solid ${theme.palette.primary.main}`, // Border biru
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText, // Teks kontras (putih) saat hover
      borderColor: theme.palette.primary.main,
    },
  },

  // Styling untuk ellipsis
  '& .MuiPaginationItem-ellipsis': {
    minWidth: '48px', // Consistent 48px for desktop
    height: '48px',
    backgroundColor: 'transparent', // Tetap transparan
    color: theme.palette.text.secondary, // Teks abu-abu sekunder (untuk titik-titik)
    border: 'none', // Ellipsis biasanya tanpa border
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // --- Penyesuaian responsif untuk layar kecil (mobile/HP) ---
  [theme.breakpoints.down('sm')]: {
    '& .MuiPaginationItem-root': {
      minWidth: '32px', // Smaller 32px for mobile
      height: '32px',
      fontSize: '0.8rem',
      padding: '0',
    },
    '& .MuiPaginationItem-previousNext': {
      minWidth: '34px', // Slightly larger for arrow icons
      height: '34px',
    },
    '& .MuiPaginationItem-ellipsis': {
      minWidth: '32px', // Consistent with number buttons
      height: '32px',
    },
    '& .MuiPagination-ul': {
      gap: theme.spacing(0.25), // Tighter spacing
    },
  },
  // --- Akhir penyesuaian responsif ---
}));

function PaginationComponent({
  pageCount,
  onPageChange,
  forcePage,
}) {
  const theme = useTheme();
  const [page, setPage] = useState(forcePage !== undefined && forcePage >= 0 ? forcePage + 1 : 1);

  useEffect(() => {
    if (forcePage !== undefined && forcePage >= 0 && (forcePage + 1) !== page) {
      setPage(forcePage + 1);
    }
  }, [forcePage, page]);

  const handleChange = (event, value) => {
    setPage(value);
    if (typeof onPageChange === 'function') {
      onPageChange({ selected: value - 1 });
    }
  };

  return (
    <StyledPagination
      count={pageCount}
      page={page}
      onChange={handleChange}
      renderItem={(item) => (
        <PaginationItem
          {...item}
          components={{
            previous: ArrowBackIosNewRoundedIcon,
            next: ArrowForwardIosRoundedIcon,
          }}
          aria-label={
            item.type === 'previous' ? 'Previous page' :
            item.type === 'next' ? 'Next page' :
            item.type === 'page' ? `Page ${item.page}` :
            item.type === 'start-ellipsis' || item.type === 'end-ellipsis' ? 'More pages' :
            undefined
          }
        />
      )}
      siblingCount={1}
      boundaryCount={1}
      showFirstButton={false}
      showLastButton={false}
    />
  );
}

export default PaginationComponent;