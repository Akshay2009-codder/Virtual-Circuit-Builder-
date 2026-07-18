from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    # Phase 3+ will add: projects = db.relationship("Project", backref="owner", lazy=True)

    def set_password(self, raw_password):
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password_hash, raw_password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
        }


# --- Project: circuits users build. circuit_json holds the react-flow graph. ---

class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, default="")
    status = db.Column(db.String(20), default="in_progress")  # in_progress | completed | error
    circuit_json = db.Column(db.JSON, default=dict)  # { nodes: [...], edges: [...] }

    # populated by the simulate endpoint each time "Run circuit" is used -
    # real data, not estimated/fabricated stats
    last_run_status = db.Column(db.String(20))  # complete | open | short | no_source | None (never run)
    last_run_at = db.Column(db.DateTime)
    run_count = db.Column(db.Integer, default=0)

    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self, viewer_id=None):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description or "",
            "status": self.status,
            "circuit_json": self.circuit_json or {"nodes": [], "edges": []},
            "last_run_status": self.last_run_status,
            "last_run_at": self.last_run_at.isoformat() if self.last_run_at else None,
            "run_count": self.run_count or 0,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "is_owner": (viewer_id is not None and int(viewer_id) == self.user_id),
        }


# --- Shared access: lets other registered users open/edit/save the same
# circuit from their own account/device. Not real-time co-editing - it's
# shared database access, so the usual "last save wins" rule applies. ---

class ProjectCollaborator(db.Model):
    __tablename__ = "project_collaborators"
    __table_args__ = (db.UniqueConstraint("project_id", "user_id", name="uq_project_user"),)

    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("projects.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    added_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        user = User.query.get(self.user_id)
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": user.name if user else "Unknown",
            "email": user.email if user else "",
            "added_at": self.added_at.isoformat(),
        }