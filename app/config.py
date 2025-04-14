import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    FLASK_RUN_PORT: str | int = os.environ.get("FLASK_RUN_PORT", 8000)
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL").replace(  # pyright: ignore
        "postgres://", "postgresql://"
    )
