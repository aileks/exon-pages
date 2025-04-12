import uuid

from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from .db import db, environment, SCHEMA


class User(db.Model, UserMixin):
    __tablename__ = "users"
    if environment == "prod":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    hashed_password = db.Column(db.String(128), nullable=False)

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
        }
