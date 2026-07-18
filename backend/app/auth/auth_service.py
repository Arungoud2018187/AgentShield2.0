from sqlalchemy.orm import Session

from app.models.user import User
from app.auth.hashing import verify_password
from app.auth.jwt_handler import create_access_token


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    """
    Authenticate a user using email and password.
    """

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
        return None

    token = create_access_token(
        {
            "sub": user.employee_id,
            "role": user.role.role_name,
            "user_id": user.id,
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }