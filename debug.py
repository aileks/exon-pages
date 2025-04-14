import os
import psycopg2
import urllib.parse
from sqlalchemy import create_engine
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Get the original URL
original_url = os.environ.get("DATABASE_URL")
print(f"Original URL: {original_url}")

# Test direct psycopg2 connection
try:
    print("Testing direct psycopg2 connection...")
    conn = psycopg2.connect(original_url)
    print("Direct connection SUCCESSFUL")
    conn.close()
except Exception as e:
    print(f"Direct connection FAILED: {e}")

# Parse the URL
parsed = urllib.parse.urlparse(original_url)
print(f"Parsed components: {parsed}")

# URL that Flask/SQLAlchemy would construct
if original_url.startswith("postgres://"):
    sqlalchemy_url = original_url.replace("postgres://", "postgresql://")
else:
    sqlalchemy_url = original_url
print(f"SQLAlchemy URL: {sqlalchemy_url}")

# Try SQLAlchemy connection
try:
    print("Testing SQLAlchemy connection...")
    engine = create_engine(sqlalchemy_url)
    connection = engine.connect()
    print("SQLAlchemy connection SUCCESSFUL")
    connection.close()
except Exception as e:
    print(f"SQLAlchemy connection FAILED: {e}")

# Try Flask-SQLAlchemy connection
try:
    print("Testing Flask-SQLAlchemy connection...")
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = sqlalchemy_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db = SQLAlchemy(app)
    with app.app_context():
        result = db.session.execute("SELECT 1").scalar()
    print(f"Flask-SQLAlchemy connection SUCCESSFUL: {result}")
except Exception as e:
    print(f"Flask-SQLAlchemy connection FAILED: {e}")
