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
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const loadTeacherCourses = async () => {
    const res = await fetch(`http://127.0.0.1:5000/api/teacher/${user.id}/courses`);
    const data = await res.json();
    setTeacherCourses(data);
  };

  const loadRoster = async (courseId) => {
    const res = await fetch(`http://127.0.0.1:5000/api/course/${courseId}/students`);
    const data = await res.json();
    setRoster(data);
    
    const course = teacherCourses.find(c => c.id === courseId);
    setSelectedCourse(course || null);
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
          
            <h3>{selectedCourse?.name} Roster</h3>

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

  useEffect(() => {
    const checkUser = async () => {
      const res = await fetch("http://127.0.0.1:5000/api/me", {
        credentials: "include"
      });
    
      if (!res.ok) {
        setUser(null);
        return;
      }
    
      const data = await res.json();
      setUser(data);
    };
  
    checkUser();
  }, []);

  const logout = async () => {
    await fetch("http://127.0.0.1:5000/api/logout", {
      credentials: "include"
    });

    setUser(null);
    localStorage.removeItem("user");
  };

  const login = async (username, password) => {
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "Login failed");
        return;
      }

      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } finally {
      setLoginLoading(false);
    }
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
      const res = await fetch("http://127.0.0.1:5000/api/drop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseId,
          student_id: user.id
        })
      }); 

      const data = await res.json();  

      if (!res.ok) throw new Error(data.error || "Drop failed");  

      showTempMessage("Course dropped");  

      loadMyCourses();
      loadCourses();  

    } catch (err) {
      showTempMessage(err.message);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseId,
          student_id: user.id   // ✅ FIXED
        })
      });
    
      const data = await res.json();
    
      if (!res.ok) throw new Error(data.error || "Enroll failed");
    
      showTempMessage("Enrolled successfully!");
    
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
      <div className="login-container">
        <div className="login-card">
          <h2>Log In</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              login(username, password);
            }}
          >
            <div className="login-field">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                autoComplete="username"
              />
            </div>

            <div className="login-field">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
              />
            </div>

            {loginError && (
              <div className="login-error">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <span className="spinner"></span>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="logo">
        <h1>Student Enrollment System</h1>
      </div>

      {user && (
        <button
          onClick={() => {
            setUser(null);
            localStorage.removeItem("user");
          }}
        >
          Logout
        </button>
      )}

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