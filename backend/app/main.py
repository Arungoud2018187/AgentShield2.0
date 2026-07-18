from fastapi import FastAPI

from app.config.settings import settings
from app.routers import auth, test, security

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

# Register routers
app.include_router(auth.router)
app.include_router(test.router)
app.include_router(security.router)


@app.get("/")
def root():
    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "Running",
    }