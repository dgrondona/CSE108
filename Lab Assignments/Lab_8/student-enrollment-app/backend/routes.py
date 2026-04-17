from flask import Blueprint, request, jsonify
from models import db, Course, Student, Enrollment, User
from flask_login import login_user, logout_user, login_required, current_user

api = Blueprint("api", __name__)

# -----------------------
# HELPERS
# -----------------------
def safe_json(data):
    return jsonify(data if data is not None else {})

# -----------------------
# COURSES
# -----------------------
@api.route("/courses")
def get_courses():
    courses = Course.query.all()

    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "instructor": c.instructor,
            "capacity": c.capacity,
            "time": c.time,
            "enrolled": Enrollment.query.filter_by(course_id=c.id).count()
        }
        for c in courses
    ])

# -----------------------
# ENROLL (STUDENT ONLY)
# -----------------------
@api.route("/enroll", methods=["POST"])
@login_required
def enroll():
    if current_user.role != "student":
        return jsonify({"error": "Students only"}), 403

    data = request.get_json()
    course_id = data.get("course_id")

    student_id = current_user.student_id

    existing = Enrollment.query.filter_by(
        student_id=student_id,
        course_id=course_id
    ).first()

    if existing:
        return jsonify({"error": "Already enrolled"}), 400

    course = Course.query.get(course_id)
    if not course:
        return jsonify({"error": "Course not found"}), 404

    count = Enrollment.query.filter_by(course_id=course_id).count()
    if count >= course.capacity:
        return jsonify({"error": "Course full"}), 400

    db.session.add(Enrollment(student_id=student_id, course_id=course_id))
    db.session.commit()

    return jsonify({"message": "enrolled"})

# -----------------------
# DROP
# -----------------------
@api.route("/drop", methods=["POST"])
@login_required
def drop_course():
    if current_user.role != "student":
        return jsonify({"error": "Students only"}), 403

    data = request.get_json()
    course_id = data.get("course_id")

    enrollment = Enrollment.query.filter_by(
        student_id=current_user.student_id,
        course_id=course_id
    ).first()

    if not enrollment:
        return jsonify({"error": "Not enrolled"}), 404

    db.session.delete(enrollment)
    db.session.commit()

    return jsonify({"message": "dropped"})

# -----------------------
# LOGIN
# -----------------------
@api.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    user = User.query.filter_by(
        username=data.get("username"),
        password=data.get("password")
    ).first()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    login_user(user)

    return jsonify({
        "id": user.id,
        "role": user.role,
        "username": user.username,
        "student_id": user.student_id,
        "teacher_id": user.teacher_id
    })

# -----------------------
# ME
# -----------------------
@api.route("/me")
@login_required
def me():
    return jsonify({
        "id": current_user.id,
        "role": current_user.role,
        "username": current_user.username,
        "student_id": current_user.student_id,
        "teacher_id": current_user.teacher_id
    })

# -----------------------
# LOGOUT
# -----------------------
@api.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "logged out"})

# -----------------------
# TEACHER COURSES (FIXED — NO PARAMS)
# -----------------------
@api.route("/teacher/courses")
@login_required
def teacher_courses():
    if current_user.role != "teacher":
        return jsonify({"error": "Unauthorized"}), 403

    courses = Course.query.filter_by(teacher_id=current_user.teacher_id).all()

    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "time": c.time,
            "capacity": c.capacity,
            "enrolled": Enrollment.query.filter_by(course_id=c.id).count()
        }
        for c in courses
    ])

# -----------------------
# ROSTER
# -----------------------
@api.route("/course/<int:course_id>/students")
@login_required
def course_students(course_id):
    enrollments = Enrollment.query.filter_by(course_id=course_id).all()

    return jsonify([
        {
            "student_id": e.student_id,
            "name": Student.query.get(e.student_id).name if Student.query.get(e.student_id) else "",
            "grade": e.grade
        }
        for e in enrollments
    ])

# -----------------------
# GRADE UPDATE
# -----------------------
@api.route("/grade", methods=["POST"])
@login_required
def update_grade():
    if current_user.role != "teacher":
        return jsonify({"error": "Unauthorized"}), 403

    data = request.get_json()

    enrollment = Enrollment.query.filter_by(
        student_id=data.get("student_id"),
        course_id=data.get("course_id")
    ).first()

    if not enrollment:
        return jsonify({"error": "Enrollment not found"}), 404

    enrollment.grade = data.get("grade")
    db.session.commit()

    return jsonify({"message": "grade updated"})

@api.route("/my-courses")
@login_required
def my_courses():
    enrollments = Enrollment.query.filter_by(
        student_id=current_user.student_id
    ).all()

    return jsonify([
        {
            "course_id": e.course_id,
            "name": Course.query.get(e.course_id).name,
            "instructor": Course.query.get(e.course_id).instructor,
            "time": Course.query.get(e.course_id).time,
            "grade": e.grade,
            "enrolled": Enrollment.query.filter_by(course_id=e.course_id).count(),
            "capacity": Course.query.get(e.course_id).capacity,
        }
        for e in enrollments
    ])