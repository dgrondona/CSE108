from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__, static_folder="build", static_url_path="")

# In-memory database
grades = {}

# Get all students
@app.route("/grades", methods=["GET"])
def get_all():
    return jsonify(grades)

# Get one student
@app.route("/grades/<name>", methods=["GET"])
def get_one(name):
    if name in grades:
        return jsonify({name: grades[name]})
    return "Student not found", 404

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

    grades[name] = grade
    return jsonify({"message": "Added"}), 201

# Update student
@app.route("/grades/<name>", methods=["PUT"])
def update_student(name):
    if name not in grades:
        return "Student not found", 404

    data = request.get_json()
    grade = data.get("grade")

    if grade > 100:
        return "Value cannot be greater than 100", 400

    grades[name] = grade
    return jsonify({"message": "Updated"})

# Delete student
@app.route("/grades/<name>", methods=["DELETE"])
def delete_student(name):
    if name not in grades:
        return "Student not found", 404

    del grades[name]
    return jsonify({"message": "Deleted"})

@app.route("/")
def serve():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True)