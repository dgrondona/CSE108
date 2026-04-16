import React, { useState, useRef, useEffect } from "react";
import PageControls from "./PageControls";
import "./PaginatedTable.css";

export default function PaginatedTable({
  data,
  columns,
  studentsPerPage = 50,
  actions = null
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingName, setEditingName] = useState(null);
  const [editGrade, setEditGrade] = useState("");

  const totalPages = Math.ceil(data.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentData = data.slice(startIndex, startIndex + studentsPerPage);

  const handlePageChange = (page) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (editingName !== null && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select(); // optional: highlights the number so typing replaces it
    }
    }, [editingName]);

  return (
    <div className="table-container">
      <table className="student-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td key={col.key}>
                  {row[col.key]}
                </td>
              ))}

              {actions && (
                <td>
                  {actions(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <PageControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}