#!/bin/bash
set -e

echo "=== [AgentShield Backend] Starting Service ==="

# Wait for PostgreSQL to become accessible
echo "Waiting for database connection..."
python - << 'EOF'
import time
import sys
import psycopg2
from app.config.settings import settings

retries = 30
db_url = settings.DATABASE_URL

for i in range(retries):
    try:
        # Check connection
        conn = psycopg2.connect(db_url)
        conn.close()
        print("✔ Database connection successfully established.")
        sys.exit(0)
    except Exception as e:
        print(f"Waiting for database... ({i+1}/{retries}) - {e}")
        time.sleep(2)

print("❌ Could not connect to database after timeout.")
sys.exit(1)
EOF

# Run database schema migrations
echo "Running Alembic database migrations..."
alembic upgrade head

# Seed initial roles and users if needed
echo "Synchronizing seed accounts and roles..."
python scripts/seed_database.py || echo "Seed execution finished."

# Start FastAPI ASGI server with production workers
echo "Launching FastAPI server with Uvicorn..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
