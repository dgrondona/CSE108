const BASE = "http://127.0.0.1:5000/api";

export async function fetchCourses() {
  const res = await fetch(`${BASE}/courses`);
  return res.json();
}

export async function fetchMyCourses(studentId = 1) {
  const res = await fetch(`${BASE}/student/${studentId}/courses`);
  return res.json();
}

export async function enroll(courseId, studentId = 1) {
  const res = await fetch(`${BASE}/enroll`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ course_id: courseId, student_id: studentId })
  });

  return res.json();
}

export const dropCourse = async (courseId, studentId) => {
  const res = await fetch("http://127.0.0.1:5000/api/drop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      course_id: courseId,
      student_id: studentId
    })
  });

  return res.json();
};