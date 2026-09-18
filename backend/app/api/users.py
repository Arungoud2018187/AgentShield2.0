from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.auth.hashing import hash_password
from app.auth.rbac import require_role
from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.services.logging_service import LoggingService

router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
    dependencies=[Depends(require_role("ADMIN"))],
)


# ==============================
# GET ALL USERS
# ==============================
@router.get("/")
def get_all_users(
    search: str = Query(None),
    role_id: int = Query(None),
    department_id: int = Query(None),
    status_filter: bool = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(User)

    if search:
        query = query.filter(
            or_(
                User.full_name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%"),
                User.employee_id.ilike(f"%{search}%"),
            )
        )

    if role_id is not None:
        query = query.filter(User.role_id == role_id)

    if department_id is not None:
        query = query.filter(User.department_id == department_id)

    if status_filter is not None:
        query = query.filter(User.is_active == status_filter)

    total = query.count()

    users = (
        query.order_by(User.id.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "pages": (total + limit - 1) // limit if total > 0 else 1,
        "users": [
            {
                "id": user.id,
                "employee_id": user.employee_id,
                "full_name": user.full_name,
                "email": user.email,
                "role_id": user.role_id,
                "department_id": user.department_id,
                "is_active": user.is_active,
                "last_login": user.last_login,
                "created_at": user.created_at,
            }
            for user in users
        ],
    }


# ==============================
# CREATE USER
# ==============================
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role("ADMIN")),
):
    existing = (
        db.query(User)
        .filter(
            or_(
                User.email.ilike(payload.email.strip()),
                User.employee_id.ilike(payload.employee_id.strip()),
            )
        )
        .first()
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this Email or Employee ID already exists.",
        )

    new_user = User(
        employee_id=payload.employee_id.strip(),
        full_name=payload.full_name.strip(),
        email=payload.email.strip(),
        password_hash=hash_password(payload.password),
        role_id=payload.role_id,
        department_id=payload.department_id,
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    LoggingService.log_audit(
        user_id=admin_user.id,
        action="USER_CREATED",
        details=f"Admin {admin_user.email} created user {new_user.employee_id} ({new_user.email})",
    )

    return {
        "id": new_user.id,
        "employee_id": new_user.employee_id,
        "full_name": new_user.full_name,
        "email": new_user.email,
        "role_id": new_user.role_id,
        "department_id": new_user.department_id,
        "is_active": new_user.is_active,
        "created_at": new_user.created_at,
    }


# ==============================
# UPDATE USER
# ==============================
@router.put("/{user_id}")
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role("ADMIN")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # Check unique constraints if changed
    conflict = (
        db.query(User)
        .filter(
            User.id != user_id,
            or_(
                User.email.ilike(payload.email.strip()),
                User.employee_id.ilike(payload.employee_id.strip()),
            ),
        )
        .first()
    )
    if conflict:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Another user already has this Email or Employee ID.",
        )

    user.employee_id = payload.employee_id.strip()
    user.full_name = payload.full_name.strip()
    user.email = payload.email.strip()
    user.role_id = payload.role_id
    user.department_id = payload.department_id
    user.is_active = payload.is_active

    db.commit()
    db.refresh(user)

    LoggingService.log_audit(
        user_id=admin_user.id,
        action="USER_UPDATED",
        details=f"Admin {admin_user.email} updated user {user.employee_id}",
    )

    return {
        "id": user.id,
        "employee_id": user.employee_id,
        "full_name": user.full_name,
        "email": user.email,
        "role_id": user.role_id,
        "department_id": user.department_id,
        "is_active": user.is_active,
        "updated_at": user.updated_at,
    }


# ==============================
# DELETE USER
# ==============================
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    admin_user: User = Depends(require_role("ADMIN")),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.id == admin_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own administrative account.",
        )

    deleted_emp_id = user.employee_id
    db.delete(user)
    db.commit()

    LoggingService.log_audit(
        user_id=admin_user.id,
        action="USER_DELETED",
        details=f"Admin {admin_user.email} deleted user {deleted_emp_id}",
    )

    return {"detail": f"User {deleted_emp_id} deleted successfully."}