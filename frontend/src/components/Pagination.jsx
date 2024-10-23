import React from 'react'

const Pagination = ({currentPage, totalPages, handleNextPage, handlePrevPage}) => {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &lt;
        </button>
        
        <span className="text-gray-700">
          {currentPage} out of {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          &gt;
        </button>
      </div>
  )
}

export default Pagination