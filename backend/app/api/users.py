from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.auth.hashing import hash_password

router = APIRouter(
    prefix="/api/users",
    tags=["Users"],
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
        "pages": (total + limit - 1) // limit,
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