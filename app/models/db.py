import os

from flask_sqlalchemy import SQLAlchemy

environment: str = os.environ.get("FLASK_ENV") or "dev"
SCHEMA: str | None = os.environ.get("SCHEMA")

db = SQLAlchemy()


def add_prefix_for_prod(attr: str) -> str:
    if environment == "prod":
        return f"{SCHEMA}.{attr}"
    else:
        return attr