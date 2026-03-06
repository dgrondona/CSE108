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

  const handleAdd = async (name, grade) => {
    const exists = students.some((s) => s.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      setMessage(`Student "${name}" already exists!`);
      return;
    }
    await addStudent(name, grade);
    setMessage(`Added ${name}`);
    loadStudents();
  };

  const handleUpdate = async (name, grade) => {
    await updateStudentGrade(name, grade);
    setMessage(`Updated ${name} to grade ${grade}`);
    loadStudents();
  };

  const handleDelete = async (name) => {
    await removeStudent(name);
    setMessage(`Deleted ${name}`);
    loadStudents();
  };

  return (
    <div className="app">
      <div className="logo-container">
        <h1>Grades App</h1>
      </div>

      <div className="search-container">
        <StudentSearch
          searchText={searchText}
          onSearchTextChange={setSearchText}
        />
      </div>

      {message && <div className="message">{message}</div>}

      <div className="main-content">
        <PaginatedTable
          students={filteredStudents}
          studentsPerPage={10}
          onEdit={handleUpdate}
          onDelete={handleDelete}
        />

        <StudentForm onAdd={handleAdd} />
      </div>
    </div>
  );
}

export default App;