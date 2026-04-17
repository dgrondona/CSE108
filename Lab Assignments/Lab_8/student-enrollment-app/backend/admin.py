from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from models import db, User, Course, Student, Enrollment


class UserAdmin(ModelView):
    column_list = ("id", "username", "role", "student_id", "teacher_id")
    form_columns = ("username", "password", "role", "student_id", "teacher_id")


class StudentAdmin(ModelView):
    column_list = ("id", "name")


class CourseAdmin(ModelView):
    column_list = ("id", "name", "instructor", "capacity", "time", "teacher_id")


class EnrollmentAdmin(ModelView):
    column_list = ("id", "student_id", "course_id", "grade")


def setup_admin(app):
    admin = Admin(app, name="Student System Admin")

    admin.add_view(UserAdmin(User, db.session))
    admin.add_view(StudentAdmin(Student, db.session))
    admin.add_view(CourseAdmin(Course, db.session))
    admin.add_view(EnrollmentAdmin(Enrollment, db.session))