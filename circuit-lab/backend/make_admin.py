"""
Grants (or revokes) admin panel access for an existing account, by username.

There's a chicken-and-egg problem with the admin panel: you need to already
be an admin to promote someone to admin through it. This script is how you
create your FIRST admin - register a normal account in the app, then run
this once from the command line.

Usage (from the backend folder, with your venv active):
    python make_admin.py <username>            # grant admin access
    python make_admin.py <username> --revoke   # revoke admin access
"""

import sys

from app import create_app
from models import db, User


def main():
    args = sys.argv[1:]
    if not args:
        print("Usage: python make_admin.py <username> [--revoke]")
        return

    username = args[0].strip().lower()
    revoke = "--revoke" in args[1:]

    app = create_app()
    with app.app_context():
        user = User.query.filter_by(username=username).first()
        if not user:
            print(f"No user found with username '{username}'. Register the account first, then rerun this.")
            return

        user.is_admin = not revoke
        db.session.commit()

        action = "revoked from" if revoke else "granted to"
        print(f"Admin access {action} '{username}'.")


if __name__ == "__main__":
    main()