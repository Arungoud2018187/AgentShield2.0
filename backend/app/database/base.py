from app.database.database import Base

# Import all models here for Alembic
from app.models.role import Role
from app.models.department import Department
from app.models.user import User
from app.models.incident import Incident
from app.models.notification import Notification
from app.models.prompt_log import PromptLog
from app.models.security_event import SecurityEvent
from app.models.audit_log import AuditLog