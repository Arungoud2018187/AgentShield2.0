from sqlalchemy.orm import Session
from datetime import datetime

from app.auth.hashing import verify_password
from app.auth.jwt_handler import create_access_token
from app.models.user import User


def authenticate_user(db: Session, email: str, password: str):

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        return None

    if not user.is_active:
        return None

    if not verify_password(password, user.password_hash):
        return None

    user.last_login = datetime.utcnow()

    db.commit()

    token = create_access_token(
        {
            "sub": user.employee_id,
            "role": user.role.role_name,
            "user_id": user.id,
            "email": user.email,
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "employee_id": user.employee_id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role.role_name,
            "last_login": user.last_login,
        },
    }