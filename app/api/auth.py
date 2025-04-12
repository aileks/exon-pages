from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from flask_wtf.csrf import generate_csrf

from app.models.user import User
from app.models.db import db

auth = Blueprint("auth", __name__)


@auth.route("/users/new", methods=["POST"])
def signup():
    data = request.json

    if (
        not data
        or not data.get("email")
        or not data.get("password")
        or not data.get("username")
    ):
        return jsonify({"error": "Missing required fields"}), 400

    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409

    existing_username = User.query.filter_by(username=data["username"]).first()
    if existing_username:
        return jsonify({"error": "Username already taken"}), 409

    new_user = User(
        email=data["email"],  # pyright: ignore
        username=data["username"],  # pyright: ignore
    )
    new_user.password = data["password"]

    db.session.add(new_user)
    db.session.commit()

    login_user(new_user)

    return jsonify(new_user.to_dict()), 201


@auth.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        if not data or not data.get("email") or not data.get("password"):
            return jsonify({"error": "Missing email or password"}), 400

        user = User.query.filter_by(email=data["email"]).first()

        if not user or not user.check_password(data["password"]):
            return jsonify({"error": "Invalid credentials"}), 401

        login_user(user)

        return jsonify(user.to_dict()), 200
    except Exception:
        return jsonify({"error": "An error occurred during login"}), 500


@auth.route("/logout", methods=["DELETE"])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Successfully logged out"}), 200


@auth.route("/me", methods=["GET"])
@login_required
def get_current_user():
    return jsonify(current_user.to_dict()), 200


@auth.route("/csrf/restore", methods=["GET"])
def restore_csrf():
    return jsonify({"csrf_token": generate_csrf()}), 200
