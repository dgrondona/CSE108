import React, { useState, useEffect } from "react";
import { fetchCourses, fetchMyCourses } from "./api/gradesAPI";
import PaginatedTable from "./components/PaginatedTable";
import StudentSearch from "./components/StudentSearch";
import Tabs from "./components/Tabs";
import { enroll, dropCourse } from "./api/gradesAPI";
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

  const handleDrop = async (courseId) => {
    try {
      const res = await dropCourse(courseId, 1);
    
      if (res.error) throw new Error(res.error);
    
      showTempMessage("Course dropped");
    
      loadMyCourses();
      loadCourses();
    
    } catch (err) {
      showTempMessage(err.message);
    }
  };

  const handleEnroll = async (courseId) => {
  try {
    const res = await enroll(courseId, 1);

    if (res.error) throw new Error(res.error);

    showTempMessage("Enrolled successfully!");

    // refresh both views
    loadCourses();
    if (tab === "my") loadMyCourses();

  } catch (err) {
    showTempMessage(err.message);
  }
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
              { key: "instructor", label: "Instructor" },
              { key: "time", label: "Time" },
              { key: "enrolled", label: "Enrolled" },
              { key: "capacity", label: "Capacity" }
            ]}
            actions={(row) => (
              <button onClick={() => handleEnroll(row.id)}>
                Enroll
              </button>
            )}
          />
        )}

        {tab === "my" && (
          <PaginatedTable
            data={filteredMyCourses}
            columns={[
              { key: "name", label: "Course" },
              { key: "instructor", label: "Instructor" },
              { key: "time", label: "Time" },
              { key: "grade", label: "Grade" },
              { key: "enrolled", label: "Enrolled" },
              { key: "capacity", label: "Capacity" }
            ]}
            actions={(row) => (
              <button
                onClick={() => handleDrop(row.course_id)}
              >
                Drop
              </button>
            )}
          />
        )}

      </div>
    </div>
  );
}

export default App;