from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings

from app.api.auth import router as auth_router
from app.api.chat import router as chat_router
from app.api.users import router as users_router
from app.api.security import router as security_router
from app.api.dashboard import router as dashboard_router
from app.api.analytics import router as analytics_router
from app.api.notifications import router as notifications_router
from app.api.incidents import router as incidents_router
from app.api.copilot import router as copilot_router
from app.api.employee import router as employee_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

# =====================================
# CORS
# =====================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================
# API ROUTERS
# =====================================

app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(users_router)
app.include_router(security_router)
app.include_router(dashboard_router)
app.include_router(analytics_router)
app.include_router(notifications_router)
app.include_router(incidents_router)
app.include_router(copilot_router)
app.include_router(employee_router)

# =====================================
# HEALTH & ROOT ENDPOINTS
# =====================================

@app.get("/api/health")
def api_health():
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "ai_engine": "OpenRouter",
        "model": settings.OPENROUTER_MODEL,
    }

@app.get("/")
def root():
    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "Running",
    }