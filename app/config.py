import os
from urllib.parse import urlparse, parse_qs, urlencode


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    FLASK_RUN_PORT: str | int = os.environ.get("FLASK_RUN_PORT", 8000)
    SQLALCHEMY_ECHO = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    db_url = os.environ.get("DATABASE_URL") or "sqlite:///dev.db"

    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
        url_parts = urlparse(db_url)
        query_params = parse_qs(url_parts.query)

        if "sslmode" not in query_params:
            query_params["sslmode"] = ["require"]

        query_string = urlencode(query_params, doseq=True)
        db_url = (
            f"{url_parts.scheme}://{url_parts.netloc}{url_parts.path}?{query_string}"
        )

        print(f"Final database URL: {db_url}")

    SQLALCHEMY_DATABASE_URI = db_url
