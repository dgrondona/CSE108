import React, { useState, useRef, useEffect } from "react";
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

  const inputRef = useRef(null);

  useEffect(() => {
    if (editingName !== null && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select(); // optional: highlights the number so typing replaces it
    }
    }, [editingName]);

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

  const getLetterGrade = (grade) => {
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
  }

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
                    ref={inputRef}
                    type="number"
                    className="grade-edit"
                    value={editGrade}
                    onChange={handleGradeChange}
                    onKeyDown={(e) => handleGradeSubmit(e, s.name)}
                    onBlur={() => setEditingName(null)}
                  />
                ) : (
                  <span
                    className="grade-cell"
                    onClick={() => handleGradeClick(s.name, s.grade)}
                  >
                    <span className={`grade-letter grade-${getLetterGrade(s.grade)}`}>
                        {getLetterGrade(s.grade)}
                    </span>
                    <span className="grade-percent">{s.grade}%</span>
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