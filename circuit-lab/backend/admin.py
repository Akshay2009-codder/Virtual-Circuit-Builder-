from datetime import datetime, timedelta, timezone
from functools import wraps
import json

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from models import (
    db,
    User,
    Follow,
    Project,
    ProjectCollaborator,
    ProjectInvite,
    ProjectLike,
    ProjectComment,
)
from component_model import Component

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

# In-memory settings / system toggles store (with persistence fallback)
SYSTEM_SETTINGS = {
    "gallery_submissions_enabled": True,
    "user_registrations_enabled": True,
    "maintenance_mode": False,
    "max_projects_per_user": 50,
    "simulation_rate_limit_per_min": 60,
}

# Reports mock/storage queue for community flags
REPORTS_QUEUE = [
    {
        "id": 1,
        "project_id": 1,
        "project_name": "Overvolted LED Spark Demo",
        "owner_name": "SparkTester",
        "reporter_name": "SafetyInspector",
        "reason": "Overcurrent configuration without resistor causing simulation crash reports.",
        "status": "pending",
        "created_at": (datetime.now(timezone.utc) - timedelta(hours=3)).isoformat(),
    },
    {
        "id": 2,
        "project_id": 2,
        "project_name": "High Voltage Arc Sim",
        "owner_name": "TeslaFan99",
        "reporter_name": "LabModerator",
        "reason": "Misleading title and spam descriptions.",
        "status": "pending",
        "created_at": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat(),
    },
]


@admin_bp.post("/login")
def admin_login():
    data = request.get_json(silent=True) or {}
    identifier = (data.get("username") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(username=identifier).first()
    if not user or not user.check_password(password) or not user.is_admin:
        return jsonify({"error": "Invalid admin credentials."}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 200


def admin_required(fn):
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return jsonify({"error": "Admin access required."}), 403
        return fn(*args, **kwargs)

    return wrapper


def _paginate_args():
    try:
        page = max(1, int(request.args.get("page", 1)))
    except (TypeError, ValueError):
        page = 1
    try:
        per_page = min(100, max(1, int(request.args.get("per_page", 20))))
    except (TypeError, ValueError):
        per_page = 20
    return page, per_page


# --- Dashboard overview ---

@admin_bp.get("/stats")
@admin_required
def stats():
    since = datetime.now(timezone.utc) - timedelta(days=7)
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

    total_runs = db.session.query(db.func.coalesce(db.func.sum(Project.run_count), 0)).scalar()
    today_runs = (
        db.session.query(db.func.coalesce(db.func.sum(Project.run_count), 0))
        .filter(Project.last_run_at >= today_start)
        .scalar()
    )

    # Recent projects
    recent_projects_query = Project.query.order_by(Project.created_at.desc()).limit(6).all()
    recent_projects = []
    for p in recent_projects_query:
        owner = User.query.get(p.user_id)
        d = p.to_dict()
        d["owner_name"] = owner.name if owner else "Unknown"
        d["owner_username"] = owner.username if owner else ""
        recent_projects.append(d)

    # Recent gallery (public) published
    recent_pub_query = (
        Project.query.filter_by(is_public=True)
        .order_by(Project.updated_at.desc())
        .limit(6)
        .all()
    )
    recent_published = []
    for p in recent_pub_query:
        owner = User.query.get(p.user_id)
        d = p.to_dict()
        d["owner_name"] = owner.name if owner else "Unknown"
        d["owner_username"] = owner.username if owner else ""
        recent_published.append(d)

    return (
        jsonify(
            {
                "user_count": User.query.count(),
                "project_count": Project.query.count(),
                "public_project_count": Project.query.filter_by(is_public=True).count(),
                "component_count": Component.query.count(),
                "total_runs": int(total_runs or 0),
                "today_runs": int(today_runs or 0) if today_runs else int((total_runs or 0) // 10),
                "new_users_7d": User.query.filter(User.created_at >= since).count(),
                "new_projects_7d": Project.query.filter(Project.created_at >= since).count(),
                "pending_reports_count": len([r for r in REPORTS_QUEUE if r["status"] == "pending"]),
                "recent_projects": recent_projects,
                "recent_published": recent_published,
            }
        ),
        200,
    )


# --- Users ---

@admin_bp.get("/users")
@admin_required
def list_users():
    q = (request.args.get("q") or "").strip()
    status_filter = request.args.get("status")  # "active", "suspended", "admin"
    sort_by = request.args.get("sort_by", "created_at")
    order = request.args.get("order", "desc")
    page, per_page = _paginate_args()

    query = User.query
    if q:
        query = query.filter(
            db.or_(
                User.username.ilike(f"%{q}%"),
                User.name.ilike(f"%{q}%"),
                User.email.ilike(f"%{q}%"),
            )
        )

    if status_filter == "admin":
        query = query.filter_by(is_admin=True)
    elif status_filter == "suspended":
        query = query.filter_by(is_verified=False)
    elif status_filter == "active":
        query = query.filter_by(is_verified=True)

    # Sorting
    sort_column = getattr(User, sort_by, User.created_at)
    if order == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    total = query.count()
    users = query.offset((page - 1) * per_page).limit(per_page).all()

    items = []
    for u in users:
        d = u.to_dict()
        d["is_verified"] = bool(u.is_verified)
        d["status"] = "active" if u.is_verified else "suspended"
        d["project_count"] = Project.query.filter_by(user_id=u.id).count()

        latest_project = (
            Project.query.filter_by(user_id=u.id)
            .order_by(Project.updated_at.desc())
            .first()
        )
        d["last_active"] = (
            latest_project.updated_at.isoformat()
            if latest_project and latest_project.updated_at
            else u.created_at.isoformat()
        )
        items.append(d)

    return jsonify({"users": items, "total": total, "page": page, "per_page": per_page}), 200


@admin_bp.patch("/users/<int:user_id>")
@admin_required
def update_user(user_id):
    actor_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    data = request.get_json(silent=True) or {}

    if "is_admin" in data:
        if user.id == actor_id and not data["is_admin"]:
            return jsonify({"error": "You can't remove your own admin access."}), 400
        user.is_admin = bool(data["is_admin"])

    if "is_verified" in data:
        user.is_verified = bool(data["is_verified"])

    if "status" in data:
        user.is_verified = (data["status"] == "active")

    db.session.commit()
    d = user.to_dict()
    d["is_verified"] = bool(user.is_verified)
    d["status"] = "active" if user.is_verified else "suspended"
    d["project_count"] = Project.query.filter_by(user_id=user.id).count()
    return jsonify({"user": d}), 200


@admin_bp.post("/users/<int:user_id>/reset-password")
@admin_required
def reset_user_password(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    data = request.get_json(silent=True) or {}
    new_password = (data.get("password") or "CircuitLab@2026").strip()

    if len(new_password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400

    user.set_password(new_password)
    db.session.commit()
    return jsonify({"message": f"Password for @{user.username} has been reset successfully."}), 200


@admin_bp.delete("/users/<int:user_id>")
@admin_required
def delete_user(user_id):
    actor_id = int(get_jwt_identity())
    if user_id == actor_id:
        return jsonify({"error": "You can't delete your own account from here."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    project_ids = [p.id for p in Project.query.filter_by(user_id=user_id).all()]
    if project_ids:
        ProjectCollaborator.query.filter(
            ProjectCollaborator.project_id.in_(project_ids)
        ).delete(synchronize_session=False)
        ProjectInvite.query.filter(
            ProjectInvite.project_id.in_(project_ids)
        ).delete(synchronize_session=False)
        ProjectLike.query.filter(
            ProjectLike.project_id.in_(project_ids)
        ).delete(synchronize_session=False)
        ProjectComment.query.filter(
            ProjectComment.project_id.in_(project_ids)
        ).delete(synchronize_session=False)
        Project.query.filter(Project.id.in_(project_ids)).delete(synchronize_session=False)

    ProjectCollaborator.query.filter_by(user_id=user_id).delete(synchronize_session=False)
    ProjectInvite.query.filter(
        db.or_(ProjectInvite.from_user_id == user_id, ProjectInvite.to_user_id == user_id)
    ).delete(synchronize_session=False)
    ProjectLike.query.filter_by(user_id=user_id).delete(synchronize_session=False)
    ProjectComment.query.filter_by(user_id=user_id).delete(synchronize_session=False)
    Follow.query.filter(
        db.or_(Follow.follower_id == user_id, Follow.followee_id == user_id)
    ).delete(synchronize_session=False)

    db.session.delete(user)
    db.session.commit()
    return jsonify({"deleted": True}), 200


# --- Projects ---

@admin_bp.get("/projects")
@admin_required
def list_projects():
    q = (request.args.get("q") or "").strip()
    filter_mode = request.args.get("filter", "all")  # "all", "public", "private", "flagged"
    is_public_param = request.args.get("is_public")
    sort_by = request.args.get("sort_by", "updated_at")
    order = request.args.get("order", "desc")
    page, per_page = _paginate_args()

    query = Project.query
    if q:
        query = query.filter(
            db.or_(
                Project.name.ilike(f"%{q}%"),
                Project.description.ilike(f"%{q}%"),
            )
        )

    if filter_mode == "public" or is_public_param == "true":
        query = query.filter_by(is_public=True)
    elif filter_mode == "private" or is_public_param == "false":
        query = query.filter_by(is_public=False)
    elif filter_mode == "flagged":
        flagged_ids = [r["project_id"] for r in REPORTS_QUEUE if r["status"] == "pending"]
        query = query.filter(Project.id.in_(flagged_ids))

    sort_col = getattr(Project, sort_by, Project.updated_at)
    if order == "asc":
        query = query.order_by(sort_col.asc())
    else:
        query = query.order_by(sort_col.desc())

    total = query.count()
    projects = query.offset((page - 1) * per_page).limit(per_page).all()

    items = []
    flagged_set = {r["project_id"] for r in REPORTS_QUEUE if r["status"] == "pending"}
    for p in projects:
        owner = User.query.get(p.user_id)
        d = p.to_dict()
        d["owner_name"] = owner.name if owner else "Unknown"
        d["owner_username"] = owner.username if owner else ""
        d["is_flagged"] = p.id in flagged_set
        items.append(d)

    return jsonify({"projects": items, "total": total, "page": page, "per_page": per_page}), 200


@admin_bp.patch("/projects/<int:project_id>")
@admin_required
def update_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404

    data = request.get_json(silent=True) or {}
    if "is_public" in data:
        project.is_public = bool(data["is_public"])

    if "name" in data:
        project.name = data["name"]

    db.session.commit()
    owner = User.query.get(project.user_id)
    d = project.to_dict()
    d["owner_name"] = owner.name if owner else "Unknown"
    d["owner_username"] = owner.username if owner else ""
    return jsonify({"project": d}), 200


@admin_bp.delete("/projects/<int:project_id>")
@admin_required
def delete_project(project_id):
    project = Project.query.get(project_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404

    ProjectCollaborator.query.filter_by(project_id=project_id).delete()
    ProjectInvite.query.filter_by(project_id=project_id).delete()
    ProjectLike.query.filter_by(project_id=project_id).delete()
    ProjectComment.query.filter_by(project_id=project_id).delete()
    db.session.delete(project)
    db.session.commit()
    return jsonify({"deleted": True}), 200


# --- Component Catalog Management ---

@admin_bp.get("/components")
@admin_required
def list_components():
    q = (request.args.get("q") or "").strip()
    category = request.args.get("category")
    page, per_page = _paginate_args()

    query = Component.query
    if q:
        query = query.filter(
            db.or_(
                Component.name.ilike(f"%{q}%"),
                Component.key.ilike(f"%{q}%"),
                Component.description.ilike(f"%{q}%"),
            )
        )
    if category and category != "all":
        query = query.filter_by(category=category)

    total = query.count()
    components = (
        query.order_by(Component.category.asc(), Component.name.asc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    return jsonify({
        "components": [c.to_dict() for c in components],
        "total": total,
        "page": page,
        "per_page": per_page,
    }), 200


@admin_bp.post("/components")
@admin_required
def create_component():
    data = request.get_json(silent=True) or {}
    key = (data.get("key") or "").strip().lower()
    name = (data.get("name") or "").strip()
    category = (data.get("category") or "").strip().lower()
    description = (data.get("description") or "").strip()
    model_type = (data.get("model_type") or "").strip().lower()

    if not key or not name or not category or not model_type:
        return jsonify({"error": "key, name, category, and model_type are required."}), 400
    if Component.query.filter_by(key=key).first():
        return jsonify({"error": "A component with that key already exists."}), 409

    component = Component(
        key=key,
        name=name,
        category=category,
        description=description,
        model_type=model_type,
        unit=data.get("unit"),
        default_value=data.get("default_value"),
        terminal_count=data.get("terminal_count", 2),
        spec=data.get("spec") or {},
    )
    db.session.add(component)
    db.session.commit()
    return jsonify({"component": component.to_dict()}), 201


@admin_bp.put("/components/<int:component_id>")
@admin_required
def update_component(component_id):
    component = Component.query.get(component_id)
    if not component:
        return jsonify({"error": "Component not found."}), 404

    data = request.get_json(silent=True) or {}
    for field in ("name", "category", "description", "model_type", "unit"):
        if field in data:
            setattr(component, field, data[field])
    if "default_value" in data:
        component.default_value = data["default_value"]
    if "terminal_count" in data:
        component.terminal_count = data["terminal_count"]
    if "spec" in data:
        component.spec = data["spec"] or {}

    db.session.commit()
    return jsonify({"component": component.to_dict()}), 200


@admin_bp.delete("/components/<int:component_id>")
@admin_required
def delete_component(component_id):
    component = Component.query.get(component_id)
    if not component:
        return jsonify({"error": "Component not found."}), 404
    db.session.delete(component)
    db.session.commit()
    return jsonify({"deleted": True}), 200


# --- Reports & Flags ---

@admin_bp.get("/reports")
@admin_required
def list_reports():
    status = request.args.get("status", "all")
    reports = REPORTS_QUEUE
    if status != "all":
        reports = [r for r in reports if r["status"] == status]
    return jsonify({"reports": reports}), 200


@admin_bp.post("/reports/<int:report_id>/action")
@admin_required
def handle_report_action(report_id):
    data = request.get_json(silent=True) or {}
    action = data.get("action")  # "dismiss", "unpublish", "delete_project"

    rep = next((r for r in REPORTS_QUEUE if r["id"] == report_id), None)
    if not rep:
        return jsonify({"error": "Report not found."}), 404

    if action == "dismiss":
        rep["status"] = "dismissed"
    elif action == "unpublish":
        rep["status"] = "resolved"
        proj = Project.query.get(rep["project_id"])
        if proj:
            proj.is_public = False
            db.session.commit()
    elif action == "delete_project":
        rep["status"] = "resolved"
        proj = Project.query.get(rep["project_id"])
        if proj:
            db.session.delete(proj)
            db.session.commit()

    return jsonify({"report": rep, "success": True}), 200


# --- Settings & Admin Profile ---

@admin_bp.get("/settings")
@admin_required
def get_settings():
    return jsonify({"settings": SYSTEM_SETTINGS}), 200


@admin_bp.post("/settings")
@admin_required
def update_settings():
    data = request.get_json(silent=True) or {}
    for k, v in data.items():
        if k in SYSTEM_SETTINGS:
            SYSTEM_SETTINGS[k] = v
    return jsonify({"settings": SYSTEM_SETTINGS, "message": "Settings updated."}), 200


@admin_bp.post("/change-password")
@admin_required
def change_admin_password():
    actor_id = int(get_jwt_identity())
    admin_user = User.query.get(actor_id)
    if not admin_user:
        return jsonify({"error": "Admin user not found."}), 404

    data = request.get_json(silent=True) or {}
    current_password = data.get("current_password") or ""
    new_password = (data.get("new_password") or "").strip()

    if not admin_user.check_password(current_password):
        return jsonify({"error": "Current password is incorrect."}), 400

    if len(new_password) < 6:
        return jsonify({"error": "New password must be at least 6 characters long."}), 400

    admin_user.set_password(new_password)
    db.session.commit()
    return jsonify({"message": "Admin password updated successfully."}), 200