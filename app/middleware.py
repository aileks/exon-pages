from functools import wraps
from flask import jsonify
from flask_login import current_user


def require_auth(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        if not current_user.is_authenticated:
            return jsonify({"error": "Authentication required"}), 401
        return func(*args, **kwargs)

    return decorated
