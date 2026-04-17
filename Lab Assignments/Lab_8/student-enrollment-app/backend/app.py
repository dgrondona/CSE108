from flask import Flask
from flask_cors import CORS
from models import db, Course, Enrollment, Student
from config import Config
from models import User
from admin import setup_admin

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)

    db.init_app(app)

    with app.app_context():
        db.create_all()
        seed_data()

    from routes import api
    app.register_blueprint(api, url_prefix="/api")

    setup_admin(app)

    return app

import random

def seed_data():
    from models import Course, Student, Enrollment

    if Course.query.first():
        return

    # -------------------
    # TEACHERS (just IDs in Course)
    # -------------------
    teacher_ids = [1, 2, 3, 4, 5]

    # -------------------
    # COURSES (10 total)
    # -------------------
    courses = []
    for i in range(10):
        c = Course(
            name=f"Course {i+1}",
            instructor=f"Prof {i+1}",
            capacity=25,
            time=f"MWF {8+i}:00",
            teacher_id=random.choice(teacher_ids)
        )
        courses.append(c)

    # -------------------
    # STUDENTS (50 total)
    # -------------------
    students = []
    for i in range(50):
        s = Student(name=f"Student {i+1}")
        students.append(s)

    db.session.add_all(courses + students)
    db.session.commit()

    # -------------------
    # ENROLLMENTS (4 courses per student avg)
    # -------------------
    all_courses = Course.query.all()

    enrollments = []

    for s in students:
        chosen_courses = random.sample(all_courses, 4)

        for c in chosen_courses:
            enrollments.append(
                Enrollment(
                    student_id=s.id,
                    course_id=c.id,
                    grade=random.randint(60, 100)
                )
            )

    db.session.add_all(enrollments)
    db.session.commit()

    users = [
        User(username="student1", password="pass", role="student", student_id=1),
        User(username="student2", password="pass", role="student", student_id=2),

        User(username="teacher1", password="pass", role="teacher", teacher_id=1),
        User(username="teacher2", password="pass", role="teacher", teacher_id=2),

        User(username="admin", password="pass", role="admin"),
    ]

    db.session.add_all(users)
    db.session.commit()


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)