import React, { useState, useEffect } from "react";
import {
  fetchAllStudents,
  fetchStudent,
  addStudent,
  updateStudentGrade,
  removeStudent,
} from "./api/gradesAPI";
import StudentTable from "./components/StudentTable";
import StudentForm from "./components/StudentForm";
import StudentSearch from "./components/StudentSearch";
import "./App.css";

function App() {

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const all = await fetchAllStudents();
    setStudents(all);
  };

  const handleSearch = async (name) => {
    const student = await fetchStudent(name);
    if (student) {
      setSelectedStudent(student);
      setMessage("");
    } else {
      setSelectedStudent(null);
      setMessage(`Student "${name}" not found.`);
    }
  };

  const handleAdd = async (name, grade) => {
    const newStudent = await addStudent(name, grade);
    if (newStudent) {
      setMessage(`Added ${name} successfully.`);
      loadStudents();
    } else {
      setMessage(`Failed to add ${name}.`);
    }
  };

  const handleUpdate = async (name, grade) => {
    const updated = await updateStudentGrade(name, grade);
    if (updated) {
      setMessage(`Updated ${name}'s grade to ${grade}.`);
      loadStudents();
    } else {
      setMessage(`Failed to update ${name}.`);
    }
  };

  const handleDelete = async (name) => {
    const deleted = await removeStudent(name);
    if (deleted) {
      setMessage(`Deleted ${name}.`);
      loadStudents();
    } else {
      setMessage(`Failed to delete ${name}.`);
    }
  };

  return (
    <div className="app">
      <h1>Grades App</h1>

      {/* Search a single student */}
      <StudentSearch onSearch={handleSearch} />

      {/* Show single student info */}
      {selectedStudent && (
        <div className="selected-student">
          {selectedStudent.name}: {selectedStudent.grade}
        </div>
      )}

      {/* Display messages */}
      {message && <div className="message">{message}</div>}

      {/* Form to add/edit a student */}
      <StudentForm
        onAdd={handleAdd}
        onUpdate={handleUpdate}
      />

      {/* Table of all students */}
      <StudentTable
        students={students}
        onEdit={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;