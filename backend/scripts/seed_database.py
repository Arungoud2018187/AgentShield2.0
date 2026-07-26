from app.database.session import SessionLocal
from app.models.role import Role
from app.models.department import Department
from app.models.user import User
from app.auth.hashing import hash_password

db = SessionLocal()

try:
    # -------------------------
    # Roles
    # -------------------------
    roles = [
        "EMPLOYEE",
        "ANALYST",
        "ADMIN",
    ]

    role_objects = {}

    for role_name in roles:
        role = db.query(Role).filter(Role.role_name == role_name).first()

        if role is None:
            role = Role(role_name=role_name)
            db.add(role)
            db.commit()
            db.refresh(role)

        role_objects[role_name] = role

    # -------------------------
    # Departments
    # -------------------------
    departments = [
        "Engineering",
        "Security",
        "Finance",
        "HR",
        "Management",
    ]

    department_objects = {}

    for dept_name in departments:
        dept = (
            db.query(Department)
            .filter(Department.department_name == dept_name)
            .first()
        )

        if dept is None:
            dept = Department(department_name=dept_name)
            db.add(dept)
            db.commit()
            db.refresh(dept)

        department_objects[dept_name] = dept

    # -------------------------
    # Admin User
    # -------------------------
    admin = (
        db.query(User)
        .filter(User.email == "arun@agentshield.com")
        .first()
    )

    if admin is None:
        admin = User(
            employee_id="EMP001",
            full_name="Arun Goud",
            email="arun@agentshield.com",
            password_hash=hash_password("AgentShield123"),
            role_id=role_objects["ADMIN"].id,
            department_id=department_objects["Security"].id,
            is_active=True,
        )

        db.add(admin)

    else:
        # Always reset admin details
        admin.employee_id = "EMP001"
        admin.full_name = "Arun Goud"
        admin.password_hash = hash_password("AgentShield123")
        admin.role_id = role_objects["ADMIN"].id
        admin.department_id = department_objects["Security"].id
        admin.is_active = True

    db.commit()

    print("✅ Database seeded successfully!")
    print("📧 Email    : arun@agentshield.com")
    print("🔑 Password : AgentShield123")

except Exception as e:
    db.rollback()
    print(f"❌ Error: {e}")

finally:
    db.close()