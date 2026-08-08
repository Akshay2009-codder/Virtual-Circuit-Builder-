from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from component_model import Component

components_bp = Blueprint("components", __name__, url_prefix="/api/components")


@components_bp.get("")
@jwt_required()
def list_components():
    category = request.args.get("category")
    query = Component.query
    if category:
        query = query.filter_by(category=category)
    items = query.order_by(Component.category, Component.name).all()
    return jsonify({"components": [c.to_dict() for c in items], "count": len(items)}), 200


@components_bp.get("/<string:key>")
@jwt_required()
def get_component(key):
    item = Component.query.filter_by(key=key).first()
    if not item:
        return jsonify({"error": "Component not found."}), 404
    return jsonify({"component": item.to_dict()}), 200
