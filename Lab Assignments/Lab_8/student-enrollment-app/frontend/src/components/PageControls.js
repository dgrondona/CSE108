import React from "react";
import "./PageControls.css";

export default function PageControls({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="page-controls">
      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ←
      </button>

      <span className="page-number">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="page-btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        →
      </button>
    </div>
  );
}