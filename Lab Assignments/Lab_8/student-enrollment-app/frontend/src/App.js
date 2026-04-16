import React, { useState, useEffect } from "react";
import { fetchCourses, fetchMyCourses } from "./api/gradesAPI";
import PaginatedTable from "./components/PaginatedTable";
import StudentSearch from "./components/StudentSearch";
import Tabs from "./components/Tabs";
import "./App.css";


function App() {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [tab, setTab] = useState("courses");
  const [myCourses, setMyCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (tab === "my") loadMyCourses();
  }, [tab]);

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

  const loadMyCourses = async () => {
    const data = await fetchMyCourses(1);
    setMyCourses(data);
  };

  // Filter students based on search (first letter of first or last name)
  const filteredCourses = courses.filter((c) => {
    const search = searchText.toLowerCase();

    return Object.values(c).some((val) =>
      String(val).toLowerCase().includes(search)
    );
  });

  const filteredMyCourses = myCourses.filter((c) => {
    const search = searchText.toLowerCase();

    return Object.values(c).some((val) =>
      String(val).toLowerCase().includes(search)
    );
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

      <div className="content-container">

      <Tabs
        activeTab={tab}
        onChange={setTab}
        tabs={[
          { key: "courses", label: "All Courses" },
          { key: "my", label: "My Classes" }
        ]}
      />

      <div className="search-container">
        <StudentSearch
          searchText={searchText}
          onSearchTextChange={setSearchText}
        />
      </div>

      </div>

      <div className="message-container">
        {message && <span className={`message ${showMessage ? "visible" : ""}`}>{message}</span>}
      </div>

      <div className="main-content">
        {tab === "courses" && (
          <PaginatedTable
            data={filteredCourses}
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
        )}

        {tab === "my" && (
          <PaginatedTable
            data={filteredMyCourses}
            columns={[
              { key: "course_id", label: "Course ID" },
              { key: "grade", label: "Grade" }
            ]}
          />
        )}

      </div>
    </div>
  );
}

export default App;