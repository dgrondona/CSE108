from flask import Flask, request, jsonify, send_from_directory
import json
import os

app = Flask(__name__, static_folder="build", static_url_path="")

# In-memory database
DATA_FILE = "grades.json"

def loadGrades():
    if not os.path.exists(DATA_FILE):
        return {}
    with open(DATA_FILE, "r") as f:
        try:
            return json.load(f)
        except:
            return {}
        
def saveGrades(grades):
    with open(DATA_FILE, "w") as f:
        json.dump(grades, f, indent=2)

# Get all students
@app.route("/grades", methods=["GET"])
def get_all():
    return jsonify(loadGrades())

# Get one student
@app.route("/grades/<name>", methods=["GET"])
def get_one(name):
    grades = loadGrades()

    if name not in grades:
        return "Student not found", 404

    return jsonify({
        "name": name,
        "grade": grades[name]
    })

# Add student
@app.route("/grades", methods=["POST"])
def add_student():
    data = request.get_json()
    name = data.get("name")
    grade = data.get("grade")

    if not name or grade is None:
        return "Invalid input", 400

    if grade > 100:
        return "Value cannot be greater than 100", 400

    grades = loadGrades()
    grades[name] = grade
    saveGrades(grades)

    return jsonify({"message": "Added"}), 201

# Update student
@app.route("/grades/<name>", methods=["PUT"])
def update_student(name):
    grades = loadGrades()

    if name not in grades:
        return "Student not found", 404

    data = request.get_json()
    grade = data.get("grade")

    if grade > 100:
        return "Value cannot be greater than 100", 400

    grades[name] = grade
    saveGrades(grades)

    return jsonify({"message": "Updated"})

# Delete student
@app.route("/grades/<name>", methods=["DELETE"])
def delete_student(name):
    grades = loadGrades()

    if name not in grades:
        return "Student not found", 404

    del grades[name]
    saveGrades(grades)

    return jsonify({"message": "Deleted"})

@app.route("/")
def serve():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True)