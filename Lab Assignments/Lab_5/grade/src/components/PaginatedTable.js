import React, { useState } from "react";
import PageControls from "./PageControls";
import "./PaginatedTable.css";

export default function PaginatedTable({ students, studentsPerPage = 50, onEdit, onDelete }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingName, setEditingName] = useState(null);
  const [editGrade, setEditGrade] = useState("");

  const totalPages = Math.ceil(students.length / studentsPerPage);
  const startIndex = (currentPage - 1) * studentsPerPage;
  const currentStudents = students.slice(startIndex, startIndex + studentsPerPage);

  const handlePageChange = (page) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  const handleGradeClick = (name, grade) => {
    setEditingName(name);
    setEditGrade(grade);
  };

  const handleGradeChange = (e) => setEditGrade(e.target.value);

  const handleGradeSubmit = (e, name) => {
    if (e.key === "Enter") {
      const parsed = parseFloat(editGrade);
      if (!isNaN(parsed)) {
        onEdit(name, parsed);
      }
      setEditingName(null);
    }
  };

  return (
    <div className="table-container">
      <table className="student-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((s) => (
            <tr key={s.name}>
              <td className="name-cell">{s.name}</td>
              <td>
                {editingName === s.name ? (
                  <input
                    type="number"
                    value={editGrade}
                    onChange={handleGradeChange}
                    onKeyDown={(e) => handleGradeSubmit(e, s.name)}
                    onBlur={() => setEditingName(null)}
                    style={{ width: "70px" }}
                  />
                ) : (
                  <span
                    className="grade-cell"
                    onClick={() => handleGradeClick(s.name, s.grade)}
                  >
                    {s.grade}
                  </span>
                )}
              </td>
              <td>
                <button className="delete-btn" onClick={() => onDelete(s.name)}>
                  Delete
                </button>
              </td>
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