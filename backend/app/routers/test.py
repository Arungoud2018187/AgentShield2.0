from fastapi import APIRouter, Depends

from app.auth.rbac import require_role

router = APIRouter(
    prefix="/api/test",
    tags=["RBAC Test"]
)


@router.get("/employee")
def employee_route(
    current_user=Depends(require_role("EMPLOYEE", "ANALYST", "ADMIN"))
):
    return {
        "message": f"Welcome {current_user.full_name}! Employee access granted."
    }


@router.get("/analyst")
def analyst_route(
    current_user=Depends(require_role("ANALYST", "ADMIN"))
):
    return {
        "message": f"Welcome {current_user.full_name}! Analyst access granted."
    }


@router.get("/admin")
def admin_route(
    current_user=Depends(require_role("ADMIN"))
):
    return {
        "message": f"Welcome {current_user.full_name}! Admin access granted."
    }