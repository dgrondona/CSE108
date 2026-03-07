import React, { useState, useEffect } from "react";
import {
  fetchAllStudents,
  fetchStudent,
  addStudent,
  updateStudentGrade,
  removeStudent,
} from "./api/mockAPI";
import PaginatedTable from "./components/PaginatedTable";
import StudentForm from "./components/StudentForm";
import StudentSearch from "./components/StudentSearch";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [highlightedStudent, setHighlightedStudent] = useState(null);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const all = await fetchAllStudents();
    setStudents(all);
  };

  // Filter students based on search (first letter of first or last name)
  const filteredStudents = students.filter((s) => {
    const search = searchText.toLowerCase();
    return (
      s.name.toLowerCase().startsWith(search) || // name starts with search
      String(s.grade).startsWith(search)         // grade starts with search
    );
  });

  const handleUpdate = async (name, grade) => {
    await updateStudentGrade(name, grade);
    showTempMessage(`Updated ${name} to grade ${grade}`);
    loadStudents();
  };

  const handleSave = async (name, grade, isUpdate) => {
    if (isUpdate) {
      await updateStudentGrade(name, grade);
      showTempMessage(`Updated ${name} to ${grade}`);
    } else {
      await addStudent(name, grade);
      showTempMessage(`Added ${name} with ${grade}`);
    }

    setHighlightedStudent(name); // highlight this student
    loadStudents();

    // remove highlight after 2 seconds
    setTimeout(() => setHighlightedStudent(null), 2000);
  };

  const handleDelete = async (name) => {
    await removeStudent(name);
    showTempMessage(`Deleted ${name}`);
    loadStudents();
  };

  const showTempMessage = (text, duration = 3000) => {
    setMessage(text);
    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, duration);
  };

  return (
    <div className="app">
      <div className="logo">
        <h1>Grades App</h1>
      </div>

      <div className="search-container">
        <StudentSearch
          searchText={searchText}
          onSearchTextChange={setSearchText}
        />
      </div>

      <div className="message-container">
        {message && <span className={`message ${showMessage ? "visible" : ""}`}>{message}</span>}
      </div>

      <div className="main-content">
        <PaginatedTable
          students={filteredStudents}
          studentsPerPage={50}
          onEdit={handleUpdate}
          onDelete={handleDelete}
          highlightedStudent={highlightedStudent}
        />

        <StudentForm students={students} onSave={handleSave} />
      </div>
    </div>
  );
}

export default App;