from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_cors import CORS

app = Flask(__name__)

# --------------------
# CONFIG
# --------------------
app.config["SECRET_KEY"] = "dev"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
CORS(app)

# --------------------
# MODELS
# --------------------

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    role = db.Column(db.String(20))  # student, teacher, admin


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    capacity = db.Column(db.Integer)
    teacher_id = db.Column(db.Integer)


class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer)
    course_id = db.Column(db.Integer)
    grade = db.Column(db.String(5))


# --------------------
# API ROUTES
# --------------------

@app.route("/api/courses", methods=["GET"])
def get_courses():
    courses = Course.query.all()
    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "capacity": c.capacity,
            "teacher_id": c.teacher_id
        }
        for c in courses
    ])


@app.route("/api/enroll", methods=["POST"])
def enroll():
    data = request.json

    course = Course.query.get(data["course_id"])
    enrolled_count = Enrollment.query.filter_by(course_id=course.id).count()

    if enrolled_count >= course.capacity:
        return jsonify({"error": "Class full"}), 400

    enrollment = Enrollment(
        student_id=data["student_id"],
        course_id=data["course_id"],
        grade=""
    )

    db.session.add(enrollment)
    db.session.commit()

    return jsonify({"message": "Enrolled successfully"})


@app.route("/api/student/<int:student_id>/courses")
def student_courses(student_id):
    enrollments = Enrollment.query.filter_by(student_id=student_id).all()

    return jsonify([
        {
            "course_id": e.course_id,
            "grade": e.grade
        }
        for e in enrollments
    ])


@app.route("/api/course/<int:course_id>/students")
def course_students(course_id):
    enrollments = Enrollment.query.filter_by(course_id=course_id).all()

    return jsonify([
        {
            "student_id": e.student_id,
            "grade": e.grade
        }
        for e in enrollments
    ])


@app.route("/api/grade", methods=["POST"])
def update_grade():
    data = request.json

    enrollment = Enrollment.query.filter_by(
        student_id=data["student_id"],
        course_id=data["course_id"]
    ).first()

    if enrollment:
        enrollment.grade = data["grade"]
        db.session.commit()

    return jsonify({"message": "Grade updated"})


# --------------------
# FLASK ADMIN
# --------------------

class AdminView(ModelView):
    pass


admin = Admin(app, name="Admin Panel")
admin.add_view(AdminView(User, db.session))
admin.add_view(AdminView(Course, db.session))
admin.add_view(AdminView(Enrollment, db.session))


# --------------------
# INIT DB + RUN
# --------------------

if __name__ == "__main__":
    with app.app_context():
        db.create_all()

        # seed data (ONLY if empty)
        if not User.query.first():
            db.session.add(User(username="student1", role="student"))
            db.session.add(User(username="teacher1", role="teacher"))
            db.session.add(User(username="admin1", role="admin"))

            db.session.add(Course(name="Math 101", capacity=2, teacher_id=2))
            db.session.add(Course(name="Physics 101", capacity=2, teacher_id=2))

            db.session.commit()

    app.run(debug=True)