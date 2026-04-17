from flask import Flask
from flask_cors import CORS
from models import db, Course, Enrollment, Student
from config import Config



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

    return app

def seed_data():
    from models import Course, Student

    if Course.query.first():
        return  # already seeded

    c1 = Course(
        name="Math 101",
        instructor="Dr. Smith",
        capacity=30,
        time="MWF 10:00"
    )

    c2 = Course(
        name="CS 108",
        instructor="Prof. Lee",
        capacity=25,
        time="TTh 1:00"
    )

    s1 = Student(name="Alice")
    s2 = Student(name="Bob")

    db.session.add_all([c1, c2, s1, s2])
    db.session.commit()


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)