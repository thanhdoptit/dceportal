import React from 'react';
import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

const Pagination = ({ currentPage, totalPages, onPageChange, className = '', ...props }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <nav
      className={twMerge(
        'flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6',
        className
      )}
      {...props}
    >
      <div className='flex flex-1 justify-between sm:hidden'>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Trước
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className='relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Sau
        </button>
      </div>
      <div className='hidden sm:flex sm:flex-1 sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm text-gray-700'>
            Hiển thị <span className='font-medium'>{currentPage}</span> trên{' '}
            <span className='font-medium'>{totalPages}</span> trang
          </p>
        </div>
        <div>
          <ul className='isolate inline-flex -space-x-px rounded-md shadow-sm'>
            <li>
              <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className='relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <span className='sr-only'>Trang đầu</span>
                <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
                  <path
                    fillRule='evenodd'
                    d='M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08l-3.74 3.53 3.74 3.53a.75.75 0 01.02 1.06z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </li>
            <li>
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className='relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <span className='sr-only'>Trang trước</span>
                <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
                  <path
                    fillRule='evenodd'
                    d='M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </li>
            {getPageNumbers().map(page => (
              <li key={page}>
                <button
                  onClick={() => onPageChange(page)}
                  className={twMerge(
                    'relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset focus:z-20 focus:outline-offset-0',
                    page === currentPage
                      ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                      : 'text-gray-900 ring-gray-300 hover:bg-gray-50'
                  )}
                >
                  {page}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className='relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <span className='sr-only'>Trang sau</span>
                <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
                  <path
                    fillRule='evenodd'
                    d='M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </li>
            <li>
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className='relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <span className='sr-only'>Trang cuối</span>
                <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor' aria-hidden='true'>
                  <path
                    fillRule='evenodd'
                    d='M4.21 14.77a.75.75 0 01.02-1.06L8.168 10 4.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Pagination;
