import os
import uuid
import traceback

from typing import cast
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, CSRFError
from flask_login import LoginManager

from .models import db, User
from .config import Config
from .api.auth import auth
from .api.notes import notes
from .api.experiments import experiments

app: Flask = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
app.config.from_object(Config)
csrf = CSRFProtect(app)
db.init_app(app)
Migrate(app, db)
CORS(app, origins=["http://localhost:8000"], supports_credentials=True)

login_manager = LoginManager()
login_manager.init_app(app)


app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(notes, url_prefix="/api/notes")
app.register_blueprint(experiments, url_prefix="/api/experiments")


@login_manager.user_loader
def load_user(user_id: str) -> User | None:
    return User.query.get(uuid.UUID(user_id))


@login_manager.unauthorized_handler
def unauthorized() -> tuple[Response, int]:
    return jsonify({"message": "Unauthorized", "status_code": 401}), 401


@app.errorhandler(404)
def not_found(_) -> Response | tuple[Response, int]:
    if request.path.startswith("/api/"):
        return jsonify({"error": "Resource not found", "status_code": 404}), 404
    return cast(Response, app.send_static_file("index.html"))


@app.errorhandler(CSRFError)
def handle_csrf_error(e) -> tuple[Response, int]:
    return jsonify({"error": e.description, "status_code": 400}), 400


@app.errorhandler(400)
def handle_bad_request(e) -> tuple[Response, int]:
    return jsonify({"error": str(e), "status_code": 400}), 400


@app.errorhandler(401)
def handle_unauthorized(e) -> tuple[Response, int]:
    return jsonify({"error": "Unauthorized", "status_code": 401}), 401


@app.errorhandler(403)
def handle_forbidden(_) -> tuple[Response, int]:
    return jsonify({"error": "Forbidden", "status_code": 403}), 403


@app.errorhandler(405)
def handle_method_not_allowed(_) -> tuple[Response, int]:
    return jsonify({"error": "Method not allowed", "status_code": 405}), 405


@app.errorhandler(500)
def handle_server_error(e) -> tuple[Response, int]:
    app.logger.error(f"Server error: {str(e)}")
    app.logger.error(traceback.format_exc())
    return jsonify({"error": "Internal server error", "status_code": 500}), 500


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def react_root(path: str) -> tuple[Response, int] | Response:
    if path == "favicon.ico":
        return cast(
            Response,
            app.send_from_directory("public", "favicon.ico"),  # pyright: ignore
        )
    return cast(Response, app.send_static_file("index.html"))
