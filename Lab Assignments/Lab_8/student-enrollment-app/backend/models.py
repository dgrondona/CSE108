from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin

db = SQLAlchemy()

class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)
    instructor = db.Column(db.String(100), nullable=False)

    capacity = db.Column(db.Integer, default=30)

    time = db.Column(db.String(50))  # simple for lab (e.g. "MWF 10:00")

    teacher_id = db.Column(db.Integer)

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'))
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'))
    grade = db.Column(db.Float, default=0)

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    role = db.Column(db.String(20))  # student / teacher / admin

    student_id = db.Column(db.Integer, nullable=True)
    teacher_id = db.Column(db.Integer, nullable=True)