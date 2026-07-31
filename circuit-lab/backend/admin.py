from datetime import datetime, timedelta, timezone
from functools import wraps

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


# --- Dedicated admin login. Separate endpoint from /api/auth/login on
# purpose - a regular account, even with the right password, gets nothing
# from this route unless is_admin is also set. Same error message whether
# the account doesn't exist, the password's wrong, or it just isn't an
# admin account - never reveal which, or this becomes a way to fish for
# who the admins are. ---

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


# --- Auth guard: every route below requires a logged-in user whose
# is_admin flag is set. jwt_required() runs first (innermost), so
# get_jwt_identity() is safe to call inside. ---

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
    total_runs = db.session.query(db.func.coalesce(db.func.sum(Project.run_count), 0)).scalar()

    return (
        jsonify(
            {
                "user_count": User.query.count(),
                "project_count": Project.query.count(),
                "public_project_count": Project.query.filter_by(is_public=True).count(),
                "component_count": Component.query.count(),
                "total_runs": int(total_runs or 0),
                "new_users_7d": User.query.filter(User.created_at >= since).count(),
                "new_projects_7d": Project.query.filter(Project.created_at >= since).count(),
            }
        ),
        200,
    )


# --- Users ---

@admin_bp.get("/users")
@admin_required
def list_users():
    q = (request.args.get("q") or "").strip()
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

    total = query.count()
    users = (
        query.order_by(User.created_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    items = []
    for u in users:
        d = u.to_dict()
        d["project_count"] = Project.query.filter_by(user_id=u.id).count()
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

    db.session.commit()
    return jsonify({"user": user.to_dict()}), 200


@admin_bp.delete("/users/<int:user_id>")
@admin_required
def delete_user(user_id):
    actor_id = int(get_jwt_identity())
    if user_id == actor_id:
        return jsonify({"error": "You can't delete your own account from here."}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404

    # No FK cascades are configured on these tables, so clean up
    # everything that references this user (or their projects) by hand -
    # otherwise it's left as orphaned rows pointing at a missing id.
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
    is_public_param = request.args.get("is_public")
    page, per_page = _paginate_args()

    query = Project.query
    if q:
        query = query.filter(Project.name.ilike(f"%{q}%"))
    if is_public_param is not None:
        query = query.filter_by(is_public=(is_public_param == "true"))

    total = query.count()
    projects = (
        query.order_by(Project.updated_at.desc())
        .offset((page - 1) * per_page)
        .limit(per_page)
        .all()
    )

    items = []
    for p in projects:
        owner = User.query.get(p.user_id)
        d = p.to_dict()
        d["owner_name"] = owner.name if owner else "Unknown"
        d["owner_username"] = owner.username if owner else ""
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

    db.session.commit()
    return jsonify({"project": project.to_dict()}), 200


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


# --- Component catalog management ---
# Read access already exists for any logged-in user via components.py -
# these are the write endpoints, admin-only.

@admin_bp.post("/components")
@admin_required
def create_component():
    data = request.get_json(silent=True) or {}
    key = (data.get("key") or "").strip().lower()
    name = (data.get("name") or "").strip()
    category = (data.get("category") or "").strip()
    description = (data.get("description") or "").strip()
    model_type = (data.get("model_type") or "").strip()

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