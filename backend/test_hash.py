from app.auth.hashing import (
    hash_password,
    verify_password,
)

password = "Admin@123"

hashed = hash_password(password)

print("HASH:")
print(hashed)

print()

print("VERIFY:", verify_password(password, hashed))