import React, { useState } from "react";
import "./StudentForm.css";
import ImportExport from "./ImportExport";

export default function StudentForm({ onAdd, students }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedGrade = parseFloat(grade);
    if (!name || isNaN(parsedGrade)) return;

    onAdd(name.trim(), parsedGrade);
    setName("");
    setGrade("");
  };

  const handleImport = (importedStudents) => {
    importedStudents.forEach((s) => {
      onAdd(s.name, s.grade);
    });
  };

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Student Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Grade"
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
      />
      <button type="submit">Add Student</button>

      {/* Import / Export Buttons below the submit button */}
      <ImportExport students={students} onImport={handleImport} />
    </form>
  );
}