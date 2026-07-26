from app.auth.jwt_handler import (
    create_access_token,
    verify_token,
)

token = create_access_token(
    {
        "sub": "EMP001",
        "role": "Admin",
    }
)

print()

print("TOKEN")

print(token)

print()

print("VERIFY")

print(verify_token(token))