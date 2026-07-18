from sqlalchemy.orm import sessionmaker, Session

from app.database.database import engine

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    """
    Database dependency.
    Creates a new database session for each request
    and closes it automatically.
    """
    db: Session = SessionLocal()

    try:
        yield db

    finally:
        db.close()