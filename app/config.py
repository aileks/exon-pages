import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    FLASK_RUN_PORT = os.environ.get("FLASK_RUN_PORT", 8000)
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    database_url = os.environ.get("DATABASE_URL", "sqlite:///dev.db")
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://")

    SQLALCHEMY_DATABASE_URI = database_url
