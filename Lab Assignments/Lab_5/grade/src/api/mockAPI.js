let mockStudents = [
  { name: "Alice", grade: 90 },
  { name: "Bob", grade: 85 },
];

export const fetchAllStudents = async () => {
  return [...mockStudents];
};

export const fetchStudent = async (name) => {
  return mockStudents.find((s) => s.name === name) || null;
};

export const addStudent = async (name, grade) => {
  const newStudent = { name, grade };
  mockStudents.push(newStudent);
  return newStudent;
};

export const updateStudentGrade = async (name, grade) => {
  const student = mockStudents.find((s) => s.name === name);
  if (student) student.grade = grade;
  return student;
};

export const removeStudent = async (name) => {
  const index = mockStudents.findIndex((s) => s.name === name);
  if (index !== -1) {
    const removed = mockStudents.splice(index, 1)[0];
    return removed;
  }
  return null;
};