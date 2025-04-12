from typing import cast
from flask import Flask, Response, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, CSRFError
from flask_login import LoginManager, login_manager

from .models import db, User
from .config import Config

app: Flask = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
app.config.from_object(Config)
csrf = CSRFProtect(app)
db.init_app(app)
Migrate(app, db)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

login_manager = LoginManager()
login_manager.init_app(app)


@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))


@login_manager.unauthorized_handler
def unauthorized():
    return jsonify({"message": "Unauthorized"}, 401)


@app.errorhandler(404)
def not_found(_) -> Response:
    return cast(Response, app.send_static_file("index.html"))


@app.errorhandler(CSRFError)
def handle_csrf_error(e) -> tuple[Response, int]:
    return (
        jsonify({"message": e.description, "status_code": 400}),
        400,
    )


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def react_root(path: str) -> tuple[Response, int] | Response:
    if path == "favicon.ico":
        return cast(
            Response,
            app.send_from_directory("public", "favicon.ico"),  # pyright: ignore
        )
    return cast(Response, app.send_static_file("index.html"))
