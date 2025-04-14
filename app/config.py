import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    FLASK_RUN_PORT: str | int = os.environ.get("FLASK_RUN_PORT", 8000)
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    db_url = os.environ.get("DATABASE_URL") or "sqlite:///dev.db"
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://") + "?sslmode=require"
    SQLALCHEMY_DATABASE_URI = db_url
