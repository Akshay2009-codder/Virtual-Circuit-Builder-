import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))


def _get_db_url():
    url = os.environ.get("DATABASE_URL", f"sqlite:///{os.path.join(basedir, 'circuitlab.db')}")
    # Neon / Render provide "postgresql://" but SQLAlchemy needs "postgresql+psycopg2://"
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif url.startswith("postgresql://") and "+psycopg2" not in url:
        url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
    return url


class Config:
    SQLALCHEMY_DATABASE_URI = _get_db_url()
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "dev-secret-change-this")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=6)

    _cors = os.environ.get("CORS_ORIGINS", "*")
    CORS_ORIGINS = "*" if _cors == "*" else [o.strip() for o in _cors.split(",") if o.strip()]