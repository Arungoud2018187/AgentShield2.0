from fastapi import Depends, HTTPException, status

from app.auth.dependencies import get_current_user


def require_role(*allowed_roles):
    """
    Restrict access to users with specific roles.
    """

    def role_checker(current_user=Depends(get_current_user)):
        user_role = current_user.role.role_name.upper()

        if user_role not in [role.upper() for role in allowed_roles]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource.",
            )

        return current_user

    return role_checker