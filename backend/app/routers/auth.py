from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.auth.auth_service import authenticate_user
from app.database.session import get_db
from app.schemas.auth import TokenResponse

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    result = authenticate_user(
        db=db,
        email=form_data.username,   # username field contains the email
        password=form_data.password,
    )

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    return result