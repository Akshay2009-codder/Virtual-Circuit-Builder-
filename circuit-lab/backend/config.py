import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    # Swap this for a Postgres URL later, e.g.
    # postgresql://user:password@localhost:5432/circuitlab
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", f"sqlite:///{os.path.join(basedir, 'circuitlab.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-secret-change-this")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=6)

    _cors = os.environ.get("CORS_ORIGINS", "*")
    CORS_ORIGINS = "*" if _cors == "*" else [o.strip() for o in _cors.split(",") if o.strip()]