export default function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex justify-center mt-6 space-x-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition disabled:opacity-50"
      >
        ◀️ 
      </button>
      <span className="px-4 py-2 bg-gray-700 rounded">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition disabled:opacity-50"
      >
         ▶️
      </button>
    </div>
  );
}
