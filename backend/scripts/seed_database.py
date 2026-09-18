from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

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
    # Test Users for all 3 roles
    # -------------------------
    seed_users = [
        {
            "employee_id": "EMP001",
            "full_name": "Arun Goud",
            "email": "arun@agentshield.com",
            "password": "AgentShield123",
            "role": "ADMIN",
            "department": "Security",
        },
        {
            "employee_id": "EMP002",
            "full_name": "Teju",
            "email": "analyst@agentshield.com",
            "password": "AgentShield123",
            "role": "ANALYST",
            "department": "Security",
        },
        {
            "employee_id": "EMP003",
            "full_name": "Bhuvana",
            "email": "employee@agentshield.com",
            "password": "AgentShield123",
            "role": "EMPLOYEE",
            "department": "Engineering",
        },
    ]

    for u_data in seed_users:
        user_obj = db.query(User).filter(User.email == u_data["email"]).first()
        if user_obj is None:
            user_obj = User(
                employee_id=u_data["employee_id"],
                full_name=u_data["full_name"],
                email=u_data["email"],
                password_hash=hash_password(u_data["password"]),
                role_id=role_objects[u_data["role"]].id,
                department_id=department_objects[u_data["department"]].id,
                is_active=True,
            )
            db.add(user_obj)
        else:
            user_obj.employee_id = u_data["employee_id"]
            user_obj.full_name = u_data["full_name"]
            user_obj.password_hash = hash_password(u_data["password"])
            user_obj.role_id = role_objects[u_data["role"]].id
            user_obj.department_id = department_objects[u_data["department"]].id
            user_obj.is_active = True

    db.commit()

    print("✅ Database seeded successfully with baseline portal users!")
    print("👑 Administrator : arun@agentshield.com / EMP001 (Pass: AgentShield123)")
    print("🔍 SOC Analyst   : analyst@agentshield.com / EMP002 (Pass: AgentShield123)")
    print("💼 Employee      : employee@agentshield.com / EMP003 (Pass: AgentShield123)")

except Exception as e:
    db.rollback()
    print(f"❌ Error: {e}")

finally:
    db.close()