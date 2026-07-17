from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, Project

projects_bp = Blueprint("projects", __name__, url_prefix="/api/projects")


def _project_or_404(project_id, user_id):
    project = Project.query.filter_by(id=project_id, user_id=user_id).first()
    return project


@projects_bp.get("")
@jwt_required()
def list_projects():
    user_id = get_jwt_identity()
    items = Project.query.filter_by(user_id=user_id).order_by(Project.updated_at.desc()).all()
    return jsonify({"projects": [p.to_dict() for p in items]}), 200


@projects_bp.post("")
@jwt_required()
def create_project():
    user_id = get_jwt_identity()
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "Untitled Circuit").strip()[:120]
    description = (data.get("description") or "").strip()[:2000]
    circuit_json = data.get("circuit_json") or {"nodes": [], "edges": []}

    project = Project(
        user_id=user_id, name=name, description=description,
        circuit_json=circuit_json, status="in_progress",
    )
    db.session.add(project)
    db.session.commit()
    return jsonify({"project": project.to_dict()}), 201


@projects_bp.get("/<int:project_id>")
@jwt_required()
def get_project(project_id):
    user_id = get_jwt_identity()
    project = _project_or_404(project_id, user_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404
    return jsonify({"project": project.to_dict()}), 200


@projects_bp.put("/<int:project_id>")
@jwt_required()
def update_project(project_id):
    user_id = get_jwt_identity()
    project = _project_or_404(project_id, user_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404

    data = request.get_json(silent=True) or {}
    if "name" in data:
        project.name = (data["name"] or "Untitled Circuit").strip()[:120]
    if "description" in data:
        project.description = (data["description"] or "").strip()[:2000]
    if "circuit_json" in data:
        project.circuit_json = data["circuit_json"]
    if "status" in data and data["status"] in ("in_progress", "completed", "error"):
        project.status = data["status"]

    db.session.commit()
    return jsonify({"project": project.to_dict()}), 200


@projects_bp.delete("/<int:project_id>")
@jwt_required()
def delete_project(project_id):
    user_id = get_jwt_identity()
    project = _project_or_404(project_id, user_id)
    if not project:
        return jsonify({"error": "Project not found."}), 404
    db.session.delete(project)
    db.session.commit()
    return jsonify({"deleted": True}), 200