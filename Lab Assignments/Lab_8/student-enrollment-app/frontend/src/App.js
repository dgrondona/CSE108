import React, { useState, useEffect } from "react";
import { fetchCourses } from "./api/gradesAPI";
import PaginatedTable from "./components/PaginatedTable";
import StudentForm from "./components/StudentForm";
import StudentSearch from "./components/StudentSearch";
import "./App.css";


function App() {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
  try {
    const all = await fetchCourses();
    setCourses(all);
  } catch (error) {
    console.error("Failed to load courses:", error);
    setCourses([]);
    showTempMessage(error.message || "Failed to load courses");
  }
  };

  // Filter students based on search (first letter of first or last name)
  const filteredCourses = courses.filter((c) => {
    const search = searchText.toLowerCase();
    return c.name.toLowerCase().startsWith(search);
  });

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
        <h1>Student Enrollment System</h1>
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
          data={courses}
          columns={[
            { key: "name", label: "Course" },
            { key: "capacity", label: "Capacity" }
          ]}
          actions={(row) => (
            <button onClick={() => {}}>
              Enroll
            </button>
          )}
        />

      </div>
    </div>
  );
}

export default App;