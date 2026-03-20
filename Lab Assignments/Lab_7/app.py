from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder="build", static_url_path="")

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///grades.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    grade = db.Column(db.Float, nullable=False)

    def to_dict(self):
        return {
            "name": self.name,
            "grade": self.grade
        }

# Create DB
with app.app_context():
    db.create_all()

# Get all students
@app.route("/grades", methods=["GET"])
def get_all():
    students = Student.query.all()
    return jsonify({s.name: s.grade for s in students})

# Get one student
@app.route("/grades/<name>", methods=["GET"])
def get_one(name):
    student = Student.query.filter_by(name=name).first()

    if not student:
        return "Student not found", 404

    return jsonify(student.to_dict())

# Add student (or update if exists)
@app.route("/grades", methods=["POST"])
def add_student():
    data = request.get_json()
    name = data.get("name")
    grade = data.get("grade")

    if not name or grade is None:
        return "Invalid input", 400

    if grade > 100:
        return "Value cannot be greater than 100", 400

    student = Student.query.filter_by(name=name).first()

    if student:
        student.grade = grade
    else:
        student = Student(name=name, grade=grade)
        db.session.add(student)

    db.session.commit()

    return jsonify({"message": "Saved"}), 201

# Update student
@app.route("/grades/<name>", methods=["PUT"])
def update_student(name):
    student = Student.query.filter_by(name=name).first()

    if not student:
        return "Student not found", 404

    data = request.get_json()
    grade = data.get("grade")

    if grade > 100:
        return "Value cannot be greater than 100", 400

    student.grade = grade
    db.session.commit()

    return jsonify({"message": "Updated"})

# Delete student
@app.route("/grades/<name>", methods=["DELETE"])
def delete_student(name):
    student = Student.query.filter_by(name=name).first()

    if not student:
        return "Student not found", 404

    db.session.delete(student)
    db.session.commit()

    return jsonify({"message": "Deleted"})

@app.route("/")
def serve():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True)