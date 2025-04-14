import os


class Config:
    SECRET_KEY = (
        os.environ.get("SECRET_KEY")
        or "app-dev-key-that-should-not-be-used-in-production"
    )
    FLASK_RUN_PORT: str | int = os.environ.get("FLASK_RUN_PORT", 8000)

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL").replace(  # pyright: ignore
        "postgres://", "postgresql://"
    )
    SQLALCHEMY_ECHO = True
