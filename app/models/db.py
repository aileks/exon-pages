import os

from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy

environment: str = os.environ.get("FLASK_ENV") or "dev"
SCHEMA: str | None = os.environ.get("SCHEMA")
metadata = MetaData(schema=SCHEMA)
db = SQLAlchemy(metadata=metadata)
