import re
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from models import db, User
from email_utils import generate_otp, otp_expiry, send_otp_email, OTP_RESEND_COOLDOWN_SECONDS

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def _now():
    return datetime.now(timezone.utc)


def _aware(dt):
    # SQLite loses timezone info on read - re-attach UTC so comparisons work.
    if dt and dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not name or len(name) < 2:
        return jsonify({"error": "Name must be at least 2 characters."}), 400
    if not EMAIL_RE.match(email):
        return jsonify({"error": "Enter a valid email address."}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters."}), 400

    existing = User.query.filter_by(email=email).first()
    if existing and existing.is_verified:
        return jsonify({"error": "An account with this email already exists."}), 409

    otp = generate_otp()

    if existing and not existing.is_verified:
        # they registered but never verified - let them try again with a fresh code
        existing.name = name
        existing.set_password(password)
        existing.otp_code = otp
        existing.otp_expires_at = otp_expiry()
        existing.otp_last_sent_at = _now()
        user = existing
    else:
        user = User(name=name, email=email, is_verified=False, otp_code=otp, otp_expires_at=otp_expiry(), otp_last_sent_at=_now())
        user.set_password(password)
        db.session.add(user)

    db.session.commit()
    send_otp_email(email, otp)

    return jsonify({"message": "Verification code sent to your email.", "email": email}), 201


@auth_bp.post("/verify-otp")
def verify_otp():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    code = (data.get("otp") or "").strip()

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "No account found for that email."}), 404
    if user.is_verified:
        return jsonify({"error": "This account is already verified. Try logging in."}), 400
    if not user.otp_code or not code or code != user.otp_code:
        return jsonify({"error": "Incorrect verification code."}), 400
    if not user.otp_expires_at or _now() > _aware(user.otp_expires_at):
        return jsonify({"error": "That code has expired. Request a new one."}), 400

    user.is_verified = True
    user.otp_code = None
    user.otp_expires_at = None
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.post("/resend-otp")
def resend_otp():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "No account found for that email."}), 404
    if user.is_verified:
        return jsonify({"error": "This account is already verified. Try logging in."}), 400

    if user.otp_last_sent_at:
        elapsed = (_now() - _aware(user.otp_last_sent_at)).total_seconds()
        if elapsed < OTP_RESEND_COOLDOWN_SECONDS:
            wait = int(OTP_RESEND_COOLDOWN_SECONDS - elapsed)
            return jsonify({"error": f"Please wait {wait}s before requesting another code."}), 429

    otp = generate_otp()
    user.otp_code = otp
    user.otp_expires_at = otp_expiry()
    user.otp_last_sent_at = _now()
    db.session.commit()
    send_otp_email(email, otp)

    return jsonify({"message": "A new verification code has been sent."}), 200


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password."}), 401

    if not user.is_verified:
        return jsonify({
            "error": "Please verify your email before logging in.",
            "needs_verification": True,
            "email": user.email,
        }), 403

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.get("/me")
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found."}), 404
    return jsonify({"user": user.to_dict()}), 200