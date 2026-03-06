import React from "react";
import "./StudentSearch.css";

export default function StudentSearch({ searchText, onSearchTextChange }) {
  return (
    <input
      type="text"
      className="search-bar"
      placeholder="Search by Name or Grade..."
      value={searchText}
      onChange={(e) => onSearchTextChange(e.target.value)}
    />
  );
}