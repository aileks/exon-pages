import os

from sqlalchemy import MetaData
from flask_sqlalchemy import SQLAlchemy

SCHEMA = os.environ.get("SCHEMA")
metadata = MetaData(schema=SCHEMA)
db = SQLAlchemy(metadata=metadata)
