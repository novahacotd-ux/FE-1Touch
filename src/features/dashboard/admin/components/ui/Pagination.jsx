import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * Shared Pagination Component
 * Matches the style of AdminClasses (IconButton)
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div className="pagi-text">
        Trang <b>{page}</b> / <b>{totalPages || 1}</b>
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        <button
          className="pagi-btn"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={isFirst}
          title="Trang trước"
        >
          <FiChevronLeft />
        </button>
        <button
          className="pagi-btn"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={isLast}
          title="Trang sau"
        >
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
}
