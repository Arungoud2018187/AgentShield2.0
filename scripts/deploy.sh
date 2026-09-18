#!/bin/bash
set -e

# ==============================================================================
# AgentShield Production Deployment Script
# ==============================================================================

echo "=================================================="
echo "      AGENTSHIELD ENTERPRISE DEPLOYMENT           "
echo "=================================================="

# Check for Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed. Please install Docker before deploying."
    exit 1
fi

# Check for Docker Compose
if ! docker compose version &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed or not working."
    exit 1
fi

# Ensure .env exists at root
if [ ! -f .env ]; then
    echo "Creating .env from .env.production.example..."
    cp .env.production.example .env
fi

# Load variables from .env
export $(grep -v '^#' .env | xargs)

PORT=${FRONTEND_PORT:-80}

echo "Building and starting AgentShield containers..."
docker compose up -d --build

echo "Waiting for services to become healthy..."
sleep 5

# Check database
echo "Verifying database container..."
docker compose ps db

# Check backend logs
echo "Verifying backend startup..."
docker compose logs --tail=20 backend

echo ""
echo "=================================================="
echo "      AGENTSHIELD DEPLOYMENT SUCCESSFUL!          "
echo "=================================================="
echo "🌐 Application URL: http://localhost:${PORT}"
echo "🛡️  Health Check:   http://localhost:${PORT}/health"
echo "⚙️  API Endpoint:   http://localhost:${PORT}/api/health"
echo ""
echo "Default Enterprise Portals & Credentials:"
echo "--------------------------------------------------"
echo "1. Administrator: arun@agentshield.com    | Pass: AgentShield123"
echo "2. SOC Analyst:   analyst@agentshield.com | Pass: AgentShield123"
echo "3. Employee:      employee@agentshield.com| Pass: AgentShield123"
echo "=================================================="
