import React, { useState } from "react";
import "./StudentForm.css";

export default function StudentForm({ students, onSave }) {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedGrade = parseFloat(grade);
    if (!name || isNaN(parsedGrade)) return;

    const existing = students.find((s) => s.name.toLowerCase() === name.toLowerCase());

    if (existing) {
      // update existing student
      onSave(name, parsedGrade, true);
    } else {
      // add new student
      onSave(name, parsedGrade, false);
    }

    setName("");
    setGrade("");
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
      <button type="submit">Save</button>
    </form>
  );
}