from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

from models import db, User, Course, Student, Enrollment


def setup_admin(app):
    admin = Admin(app, name="Student System Admin")

    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Student, db.session))
    admin.add_view(ModelView(Course, db.session))
    admin.add_view(ModelView(Enrollment, db.session))