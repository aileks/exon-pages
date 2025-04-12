import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    FLASK_RUN_PORT: str | int = os.environ.get("FLASK_RUN_PORT", 5000)

    SQLALCHEMY_TRACK_MODIFICATIONS: bool = False
    db_url: str | None = os.environ.get("DATABASE_URL")
    if db_url and db_url.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URI: str = db_url.replace("postgres://", "postgresql://")
    else:
        SQLALCHEMY_DATABASE_URI: str = db_url or "sqlite:///dev.db"
    SQLALCHEMY_ECHO: bool = True