"""
Unit tests for Auth API endpoints
"""
import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from auth import hash_password, verify_password, generate_token, decode_token


def test_password_hashing():
    """Verify password hashing and verification safety."""
    pwd = "SecretPassword123!"
    hashed = hash_password(pwd)
    assert hashed != pwd
    assert verify_password(pwd, hashed) is True
    assert verify_password("WrongPassword", hashed) is False


def test_jwt_token_generation():
    """Verify JWT payload encoding and decoding."""
    user_id = 42
    username = "circuit_master"
    token = generate_token(user_id, username)
    assert isinstance(token, str)

    decoded = decode_token(token)
    assert decoded["user_id"] == user_id
    assert decoded["username"] == username
