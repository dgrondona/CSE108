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
  const [user, setUser] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [roster, setRoster] = useState([]);
  const [editing, setEditing] = useState(null);
  const [gradeValue, setGradeValue] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loadTeacherCourses = async () => {
    const res = await fetch(`http://127.0.0.1:5000/api/teacher/${user.id}/courses`);
    const data = await res.json();
    setTeacherCourses(data);
  };

  const loadRoster = async (courseId) => {
    const res = await fetch(`http://127.0.0.1:5000/api/course/${courseId}/students`);
    const data = await res.json();
    setRoster(data);
    setSelectedCourse(courseId);
  };

  const updateGrade = async (studentId, newGrade) => {
    const res = await fetch("http://127.0.0.1:5000/api/grade", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        student_id: studentId,
        course_id: selectedCourse,
        grade: newGrade
      })
    });

    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    // refresh roster
    loadRoster(selectedCourse);
  };

  const TeacherDashboard = () => {
    return (
      <div className="teacher-dashboard">

        <h2>My Courses</h2>

        {/* COURSE LIST */}
        <PaginatedTable
          data={teacherCourses}
          columns={[
            { key: "name", label: "Course" },
            { key: "time", label: "Time" },
            { key: "enrolled", label: "Enrolled" },
            { key: "capacity", label: "Capacity" }
          ]}
          actions={(row) => (
            <button onClick={() => loadRoster(row.id)}>
              View Students
            </button>
          )}
        />

        {/* ROSTER */}
        {selectedCourse && (
          <div className="roster-section">
          
            <h3>Class Roster</h3>

            <PaginatedTable
              data={roster}
              columns={[
                { key: "name", label: "Student" },
                { key: "grade", label: "Grade" }
              ]}
              renderCell={(row, col) => {
                if (col.key === "grade") {
                  const isEditing = editing === row.student_id;
                
                  return isEditing ? (
                    <input
                      type="number"
                      value={gradeValue}
                      onChange={(e) => setGradeValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateGrade(row.student_id, gradeValue);
                          setEditing(null);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => {
                        setEditing(row.student_id);
                        setGradeValue(row.grade);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {row.grade}
                    </span>
                  );
                }
              
                return row[col.key];
              }}
            />

          </div>
        )}

      </div>
    );
  };

  const login = async (username, password) => {
    const res = await fetch("http://127.0.0.1:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.error) {
      showTempMessage(data.error);
      return;
    }

    setUser(data);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (user?.role === "teacher") {
      loadTeacherCourses();
    }
  }, [user]);

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
    const data = await fetchMyCourses(user.id);
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

  if (!user) {
    return (
      <div className="login">

        <h2>Login</h2>

        <input
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={() => login(username, password)}>
          Login
        </button>

      </div>
    );
  }

  return (
    <div className="app">
      <div className="logo">
        <h1>Student Enrollment System</h1>
      </div>

      {user.role === "teacher" && <TeacherDashboard />}

      {user.role === "student" && (
      <>
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
      </>
      )}
    </div>
  );
}

export default App;