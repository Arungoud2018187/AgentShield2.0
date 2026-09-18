from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.auth_service import authenticate_user
from app.auth.dependencies import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
):
    return authenticate_user(
        db=db,
        identifier=payload.identifier,
        password=payload.password,
        selected_role=payload.selected_role,
    )


@router.get(
    "/me",
    response_model=UserResponse,
)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
):
    return {
        "id": current_user.id,
        "employee_id": current_user.employee_id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role.role_name if current_user.role else "EMPLOYEE",
        "department": (
            current_user.department.department_name
            if current_user.department
            else None
        ),
    }