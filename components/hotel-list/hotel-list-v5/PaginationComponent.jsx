import React, { useState, useEffect } from 'react';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import { styled } from '@mui/material/styles';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

const StyledPagination = styled(Pagination)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  padding: theme.spacing(0.5, 0),
  backgroundColor: 'transparent', // Biar container luar kelihatan background-nya

  '& .MuiPagination-ul': {
    display: 'flex',
    listStyle: 'none',
    padding: 0,
    margin: 0,
    gap: theme.spacing(0.75),
    flexWrap: 'wrap',
    justifyContent: 'center',
  },

  '& .MuiPaginationItem-root': {
    minWidth: '36px',
    height: '36px',
    borderRadius: theme.shape.borderRadius,
    fontSize: '1rem',
    fontWeight: theme.typography.fontWeightMedium,
    backgroundColor:
      theme.palette.mode === 'dark'
        ? theme.palette.primary[800]
        : '#fff', // PASTIKAN background putih biar tidak transparan
    color:
      theme.palette.mode === 'dark'
        ? theme.palette.primary[100]
        : theme.palette.primary[900],
    border: `1px solid ${theme.palette.mode === 'dark' ? '#000' : '#ccc'}`, // border abu muda
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease-in-out',
    padding: '0 12px',

    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderColor: theme.palette.primary.main,
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[1],
    },

    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
      borderColor: theme.palette.primary.main,
    },
  },

  '& .Mui-selected': {
    backgroundColor: `${theme.palette.primary.main} !important`,
    color: `${theme.palette.primary.contrastText} !important`,
    fontWeight: theme.typography.fontWeightBold,
    border: `1px solid ${theme.palette.primary.main} !important`,
    boxShadow: theme.shadows[2],
    transform: 'none',

    '&:hover': {
      backgroundColor: `${theme.palette.primary.dark} !important`,
      color: `${theme.palette.primary.contrastText} !important`,
      borderColor: `${theme.palette.primary.dark} !important`,
    },
  },

  '& .Mui-disabled': {
    opacity: 0.5,
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
    border: `1px solid ${theme.palette.action.disabledBackground}`,
    boxShadow: 'none',
    transform: 'none',
  },

  '& .MuiPaginationItem-previousNext': {
    minWidth: '36px',
    height: '36px',
    backgroundColor: '#fff', // Pastikan tombol prev/next putih
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      borderColor: theme.palette.primary.main,
    },
  },

  '& .MuiPaginationItem-ellipsis': {
    minWidth: '36px',
    height: '36px',
    backgroundColor: 'transparent',
    color: theme.palette.text.secondary,
    border: 'none',
    boxShadow: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  [theme.breakpoints.down('sm')]: {
    '& .MuiPaginationItem-root': {
      minWidth: '28px',
      height: '28px',
      fontSize: '0.8rem',
      padding: '0',
    },
    '& .MuiPaginationItem-previousNext': {
      minWidth: '28px',
      height: '28px',
    },
    '& .MuiPaginationItem-ellipsis': {
      minWidth: '28px',
      height: '28px',
    },
    '& .MuiPagination-ul': {
      gap: theme.spacing(0.25),
    },
  },
}));

function PaginationComponent({ pageCount, onPageChange, forcePage }) {
  const [page, setPage] = useState(
    forcePage !== undefined && forcePage >= 0 ? forcePage + 1 : 1
  );

  useEffect(() => {
    if (
      forcePage !== undefined &&
      forcePage >= 0 &&
      forcePage + 1 !== page
    ) {
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
    <div
      style={{
        border: '1px solid #ddd',
        backgroundColor: '#f9f9f9',
        borderRadius: 4,
        padding: 4,
        display: 'inline-block',
      }}
    >
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
              item.type === 'previous'
                ? 'Previous page'
                : item.type === 'next'
                ? 'Next page'
                : item.type === 'page'
                ? `Page ${item.page}`
                : item.type === 'start-ellipsis' || item.type === 'end-ellipsis'
                ? 'More pages'
                : undefined
            }
          />
        )}
        siblingCount={1}
        boundaryCount={1}
        showFirstButton={false}
        showLastButton={false}
      />
    </div>
  );
}

export default PaginationComponent;
