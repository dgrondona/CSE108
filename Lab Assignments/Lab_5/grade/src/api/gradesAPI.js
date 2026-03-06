const BASE_URL = "https://amhep.pythonanywhere.com/grades";

// Function to get all grades and students
export const getAllGrades = async () => {

    try {

        const res = await fetch(BASE_URL);
        if (!res.ok) throw new Error("Failed to fetch grades");
        const data = await res.json();
        return data;

    } catch (error) {

        console.error("getAllGrades error: ", error);
        return [];

    }

};

// Get a single students grade by name
export const getStudent = async (name) => {

    try {

        const res = await fetch(`${BASE_URL}/${encodedURIComponent(name)}`);
        if (!res.ok) throw new Error(`Failed to fetch grade for ${name}`);
        const data = await res.json();
        return data;

    } catch (error) {

        console.error("getStudent error: ", error);
        return null;

    }

};

// Create a student with a grade
export const createStudent = async (name, grade) => {

  try {

    const res = await fetch(BASE_URL, {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, grade }),

    });

    if (!res.ok) throw new Error("Failed to create student");
    const data = await res.json();
    return data;

  } catch (error) {

    console.error("createStudent error:", error);
    return null;

  }

};

// Update a students grade
export const updateGrade = async (name, grade) => {

  try {

    const res = await fetch(`${BASE_URL}/${encodeURIComponent(name)}`, {

      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grade }),

    });

    if (!res.ok) throw new Error(`Failed to update grade for ${name}`);
    const data = await res.json();
    return data;

  } catch (error) {

    console.error("updateGrade error:", error);
    return null;

  }

};

// Delete a student
export const deleteStudent = async (name) => {

  try {

    const res = await fetch(`${BASE_URL}/${encodeURIComponent(name)}`, {

      method: "DELETE",

    });

    if (!res.ok) throw new Error(`Failed to delete student ${name}`);
    const data = await res.json();
    return data;

  } catch (error) {

    console.error("deleteStudent error:", error);
    return null;
    
  }

};