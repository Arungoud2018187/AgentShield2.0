from sqlalchemy.orm import Session

from app.database.database import SessionLocal
from app.models.prompt_log import PromptLog


class LoggingService:

    @staticmethod
    def log_prompt(user_id, prompt, response):

        db: Session = SessionLocal()

        try:
            log = PromptLog(
                user_id=user_id,
                prompt=prompt,
                response=response
            )

            db.add(log)
            db.commit()

        finally:
            db.close()