from flask import Flask, jsonify
from flask_cors import CORS
from models import db, Course, Enrollment, Student, User
from config import Config
from admin import setup_admin
from flask import Flask, session
from flask_login import LoginManager

login_manager = LoginManager()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"error": "Unauthorized"}), 401

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    app.config["SECRET_KEY"] = "dev-secret-key-change-later"
    CORS(app, supports_credentials=True)

    login_manager.init_app(app)
    app.secret_key = "dev-secret-key"

    db.init_app(app)

    with app.app_context():
        db.create_all()
        seed_data()

    from routes import api
    app.register_blueprint(api, url_prefix="/api")

    setup_admin(app)

    return app


def seed_data():
    from models import User, Course, Student, Enrollment

    # -------------------------
    # RESET GUARD (SAFE)
    # -------------------------
    if User.query.first() or Course.query.first():
        return

    # -------------------------
    # TEACHERS
    # -------------------------
    teacher_users = [
        ("jsmith", "Smith"),
        ("adoe", "Doe"),
        ("bwayne", "Wayne"),
        ("ckent", "Kent"),
        ("dprince", "Prince"),
    ]

    teachers = []
    teacher_map = {}

    for i, (username, name) in enumerate(teacher_users, start=1):
        user = User(
            username=username,
            password="1234",
            role="teacher",
            teacher_id=i
        )
        teachers.append(user)
        teacher_map[name] = i

    # -------------------------
    # COURSES (DETEMINISTIC STRUCTURE)
    # -------------------------
    course_templates = [
        ("Math 101", "Smith", 3, "MWF 9:00"),
        ("Math 201", "Smith", 5, "MWF 10:00"),

        ("CS 108", "Doe", 4, "TTh 1:00"),
        ("CS 220", "Doe", 2, "TTh 2:00"),

        ("Physics 1", "Wayne", 6, "MWF 11:00"),
        ("Physics 2", "Wayne", 2, "MWF 12:00"),

        ("Philosophy", "Kent", 5, "TTh 9:00"),
        ("Ethics", "Kent", 3, "TTh 10:00"),

        ("History", "Prince", 4, "MWF 2:00"),
        ("Politics", "Prince", 2, "MWF 3:00"),
    ]

    courses = []
    for name, prof, cap, time in course_templates:
        courses.append(
            Course(
                name=name,
                instructor=prof,
                capacity=cap,
                time=time,
                teacher_id=teacher_map[prof]
            )
        )

    # -------------------------
    # STUDENTS (DETERMINISTIC LIST)
    # -------------------------
    student_names = [
        "jsmith_s", "adoe_s", "bjones", "ckim", "dlee",
        "emartin", "fgarcia", "hpatel", "ijohnson", "knguyen",
        "lliu", "mmurphy", "ncooper", "operez", "rwhite"
    ]

    student_users = []
    students = []

    for i, name in enumerate(student_names, start=1):
        student_users.append(
            User(
                username=name,
                password="1234",
                role="student",
                student_id=i
            )
        )
        students.append(Student(name=name))

    # -------------------------
    # COMMIT BASE DATA
    # -------------------------
    db.session.add_all(teachers)
    db.session.add_all(courses)
    db.session.add_all(student_users)
    db.session.add_all(students)
    db.session.commit()

    # -------------------------
    # ENROLLMENTS (CONTROLLED FILLING)
    # -------------------------
    all_courses = Course.query.all()
    all_students = Student.query.all()

    # deterministic distribution:
    # first few courses = full, others partial
    for i, course in enumerate(all_courses):
        if i % 2 == 0:
            target = course.capacity  # full
        else:
            target = max(1, course.capacity - 1)  # nearly full

        chosen = all_students[:target]  # deterministic slice

        for s in chosen:
            db.session.add(
                Enrollment(
                    student_id=s.id,
                    course_id=course.id,
                    grade=75 + (s.id % 25)
                )
            )

    db.session.commit()


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)