import React, { useState } from "react";
import "./StudentForm.css";
import ImportExport from "./ImportExport";

export default function StudentForm({ onSave, students }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const parsedGrade = parseFloat(grade);
    if (!trimmedName || isNaN(parsedGrade)) return;

    // Check if student already exists
    const existingStudent = students.find(
      (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
    );

    // If exists, pass a flag so onAdd knows this is an update
    onSave(trimmedName, parsedGrade, !!existingStudent);

    setName("");
    setGrade("");
  };

  // Import students safely (can add throttling here if needed)
  const handleImport = async (importedStudents) => {
    for (const s of importedStudents) {
      const existing = students.find(
        (st) => st.name.toLowerCase() === s.name.toLowerCase()
      );
      await onSave(s.name, s.grade, !!existing);
      // Optional: add a small delay if hitting API rate limits
      // await new Promise((r) => setTimeout(r, 500));
    }
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
      <button type="submit">Save Student</button>

      {/* Import / Export Buttons below the submit button */}
      <ImportExport students={students} onImport={handleImport} />
    </form>
  );
}