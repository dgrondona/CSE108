export async function fetchCourses() {
    const res = await fetch("http://127.0.0.1:5000/api/courses");
    return res.json();
}