import os

from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy

environment = os.environ.get("FLASK_ENV") or "dev"
SCHEMA = os.environ.get("SCHEMA")
metadata = MetaData(schema=SCHEMA)
db = SQLAlchemy(metadata=metadata)
