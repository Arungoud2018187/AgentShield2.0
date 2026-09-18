from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict


class UserCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    password: str
    role_id: int
    department_id: int


class UserUpdate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    role_id: int
    department_id: int
    is_active: bool


class UserResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: EmailStr
    role_id: int
    department_id: int
    is_active: bool
    last_login: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)