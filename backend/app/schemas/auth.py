from pydantic import BaseModel, Field


class LoginRequest(BaseModel):
    identifier: str = Field(..., description="Email address or Employee ID")
    password: str = Field(..., min_length=1, description="Account password")
    selected_role: str = Field(..., description="Selected portal role: Employee, Administrator, or SOC Analyst")


class UserResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str
    role: str
    department: str | None = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse