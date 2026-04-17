const BASE = "http://127.0.0.1:5000/api";

export async function fetchCourses() {
  const res = await fetch(`${BASE}/courses`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function fetchMyCourses() {
  const res = await fetch(`${BASE}/my-courses`, {
    credentials: "include"
  });
  return res.json();
}

export async function enroll(courseId, studentId = 1) {
  const res = await fetch(`${BASE}/enroll`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course_id: courseId, student_id: studentId })
  });

  return res.json();
}

export const dropCourse = async (courseId, studentId) => {
  const res = await fetch("http://127.0.0.1:5000/api/drop", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      course_id: courseId,
      student_id: studentId
    })
  });

  return res.json();
};