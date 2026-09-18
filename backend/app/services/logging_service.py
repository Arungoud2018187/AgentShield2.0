from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.prompt_log import PromptLog
from app.models.security_event import SecurityEvent
from app.models.audit_log import AuditLog


class LoggingService:

    @staticmethod
    def log_prompt(user_id: int, prompt: str, response: str):
        db: Session = SessionLocal()

        try:
            log = PromptLog(
                user_id=user_id,
                prompt=prompt,
                response=response,
            )

            db.add(log)
            db.commit()

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()

    @staticmethod
    def log_security_event(
        user_id: int,
        event_type: str,
        severity: str,
        description: str,
    ):
        db: Session = SessionLocal()

        try:
            event = SecurityEvent(
                user_id=user_id,
                event_type=event_type,
                severity=severity,
                description=description,
            )

            db.add(event)
            db.commit()

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()

    @staticmethod
    def log_audit(
        user_id: int,
        action: str,
        details: str | None = None,
    ):
        db: Session = SessionLocal()

        try:
            log = AuditLog(
                user_id=user_id,
                action=action,
                details=details,
            )

            db.add(log)
            db.commit()

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()
