const BASE_URL = "https://amhep.pythonanywhere.com/grades";

// Check if a student exists
export const studentExists = async (name) => {
  const student = await fetchStudent(name);
  return student && !student.error ? true : false;
};

// Function to get all grades and students
export const fetchAllStudents = async () => {
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to fetch grades");
    }
    const data = await res.json();

    // Convert object response to array for easier handling
    return Object.entries(data).map(([name, grade]) => ({ name, grade }));

  } catch (error) {
    console.error("fetchAllStudents error:", error);
    return { error: error.message };
  }
};

// Get a single student's grade by name
export const fetchStudent = async (name) => {
  try {
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(name)}`);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Failed to fetch grade for ${name}`);
    }
    const data = await res.json();
    return { name, grade: data[name] || data };
  } catch (error) {
    console.error("fetchStudent error:", error);
    return { error: error.message };
  }
};

export const addStudent = async (name, grade) => {
  try {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, grade }),
    });

    const contentType = res.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text(); // read plain text or HTML
    }

    if (!res.ok) {
      // If HTML/text, just throw it as message
      throw new Error(
        typeof data === "string"
          ? data.replace(/<[^>]+>/g, "").trim() // strip HTML tags
          : data?.message || "Failed to create student"
      );
    }

    return data;
  } catch (error) {
    console.error("createStudent error:", error);
    throw error;
  }
};

export const updateStudentGrade = async (name, grade) => {
  try {
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(name)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade }),
    });

    const contentType = res.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      throw new Error(
        typeof data === "string"
          ? data.replace(/<[^>]+>/g, "").trim()
          : data?.message || `Failed to update grade for ${name}`
      );
    }

    return data;
  } catch (error) {
    console.error("updateGrade error:", error);
    throw error;
  }
};

// Delete a student
export const removeStudent = async (name, grade) => {
  try {
    const res = await fetch(`${BASE_URL}/${encodeURIComponent(name)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade }),
    });

    const contentType = res.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      throw new Error(
        typeof data === "string"
          ? data.replace(/<[^>]+>/g, "").trim()
          : data?.message || `Failed to delete ${name}`
      );
    }

    return data;
  } catch (error) {
    console.error("deleteStudent error:", error);
    throw error;
  }
};