from datetime import datetime, timezone
from fastapi import HTTPException, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.auth.hashing import verify_password
from app.auth.jwt_handler import create_access_token
from app.models.user import User


def normalize_role(role_name: str) -> str:
    """
    Normalizes human-readable role labels and system identifiers to canonical DB roles.
    """
    if not role_name:
        return ""
    cleaned = role_name.strip().upper().replace(" ", "_").replace("-", "_")
    if cleaned in ("EMPLOYEE", "EMP", "STAFF"):
        return "EMPLOYEE"
    if cleaned in ("ADMINISTRATOR", "ADMIN", "SYSTEM_ADMIN"):
        return "ADMIN"
    if cleaned in ("SOC_ANALYST", "SOC", "ANALYST", "SECURITY_ANALYST", "SECURITY_OPERATIONS"):
        return "ANALYST"
    return cleaned


def authenticate_user(
    db: Session,
    identifier: str,
    password: str,
    selected_role: str | None = None,
):
    """
    Authenticate user by Email or Employee ID, verify password against DB hash,
    and enforce that the selected role strictly matches the user's database role.
    """
    clean_identifier = identifier.strip()

    user = (
        db.query(User)
        .filter(
            or_(
                User.email.ilike(clean_identifier),
                User.employee_id.ilike(clean_identifier),
            )
        )
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please check your Email/Employee ID and password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact an administrator.",
        )

    if not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please check your Email/Employee ID and password.",
        )

    # Validate database role against selected role
    user_db_role = user.role.role_name if user.role else "EMPLOYEE"
    if selected_role:
        normalized_selected = normalize_role(selected_role)
        normalized_actual = normalize_role(user_db_role)

        if normalized_selected != normalized_actual:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=(
                    f"Role authorization mismatch. You selected '{selected_role}', but your "
                    f"account is registered as '{user_db_role}'. Please log in through your assigned portal."
                ),
            )

    user.last_login = datetime.now(timezone.utc)
    db.commit()

    token = create_access_token(
        {
            "sub": user.employee_id,
            "role": user_db_role,
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
            "role": user_db_role,
            "department": user.department.department_name if user.department else None,
            "last_login": user.last_login,
        },
    }