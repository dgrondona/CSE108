import React from "react";

export default function PageControls({ currentPage, totalPages, onPageChange }) {
  return (
    <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Prev
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
}