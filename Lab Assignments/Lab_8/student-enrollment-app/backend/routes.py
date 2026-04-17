from flask import Blueprint, request, jsonify
from models import db, Course, Student, Enrollment

api = Blueprint("api", __name__)

# GET all courses
@api.route("/courses")
def get_courses():
    courses = Course.query.all()

    result = []

    for c in courses:
        enrolled_count = Enrollment.query.filter_by(course_id=c.id).count()

        result.append({
            "id": c.id,
            "name": c.name,
            "instructor": c.instructor,
            "capacity": c.capacity,
            "time": c.time,
            "enrolled": enrolled_count
        })

    return jsonify(result)

# ENROLL student
@api.route("/enroll", methods=["POST"])
def enroll():
    data = request.json
    student_id = data["student_id"]
    course_id = data["course_id"]

    # check duplicate
    existing = Enrollment.query.filter_by(
        student_id=student_id,
        course_id=course_id
    ).first()

    if existing:
        return jsonify({"error": "Already enrolled"}), 400

    course = Course.query.get(course_id)

    enrolled_count = Enrollment.query.filter_by(course_id=course_id).count()

    if enrolled_count >= course.capacity:
        return jsonify({"error": "Course full"}), 400

    new = Enrollment(student_id=student_id, course_id=course_id)
    db.session.add(new)
    db.session.commit()

    return jsonify({"message": "enrolled"})

@api.route("/student/<int:student_id>/courses")
def my_courses(student_id):
    enrollments = Enrollment.query.filter_by(student_id=student_id).all()

    result = []

    for e in enrollments:
        course = Course.query.get(e.course_id)

        if not course:
            continue

        enrolled_count = Enrollment.query.filter_by(course_id=course.id).count()

        result.append({
            "course_id": course.id,
            "name": course.name,
            "instructor": course.instructor,
            "time": course.time,
            "grade": e.grade,
            "enrolled": enrolled_count,
            "capacity": course.capacity
        })

    return jsonify(result)

@api.route("/drop", methods=["POST"])
def drop_course():
    data = request.json

    student_id = data["student_id"]
    course_id = data["course_id"]

    enrollment = Enrollment.query.filter_by(
        student_id=student_id,
        course_id=course_id
    ).first()

    if not enrollment:
        return jsonify({"error": "Not enrolled"}), 404

    db.session.delete(enrollment)
    db.session.commit()

    return jsonify({"message": "dropped"})