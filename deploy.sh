#!/bin/bash

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚀 Starting Automated Deployment...${NC}"

# Check requirements
command -v docker >/dev/null 2>&1 || { echo -e "${RED}Docker is not installed.${NC}"; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo -e "${RED}Kubectl is not installed.${NC}"; exit 1; }

# Check for .env
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found! Please create one based on .env.example${NC}"
    exit 1
fi

# Load envs for script usage
set -a
. .env
set +a

echo -e "${GREEN}🔍 Environment variables loaded.${NC}"

# 1. Build Backend
echo -e "${BLUE}📦 Building Backend Image...${NC}"
docker build -t backend-image:latest -f ./app/backend/Dockerfile .

# 2. Build Frontend
echo -e "${BLUE}📦 Building Frontend Image...${NC}"

# Ensure VITE_ variables are handled
# Check if VITE_GOOGLE_CLIENT_ID is set, otherwise fall back to GOOGLE_CLIENT_ID
if [ -z "$VITE_GOOGLE_CLIENT_ID" ] && [ -n "$GOOGLE_CLIENT_ID" ]; then
    echo -e "${GREEN}✔️ Using GOOGLE_CLIENT_ID as VITE_GOOGLE_CLIENT_ID${NC}"
    VITE_GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
fi

# Build frontend with args
docker build \
    --build-arg VITE_API_URL="$VITE_API_URL" \
    --build-arg VITE_GOOGLE_CLIENT_ID="$VITE_GOOGLE_CLIENT_ID" \
    -t frontend-image:latest -f ./app/frontend/Dockerfile .

# 3. K8s Setup
echo -e "${BLUE}☸️  Deploying to Kubernetes...${NC}"

# Update Secret (delete and recreate to ensure latest values from .env)
echo "🔒 Updating Kubernetes Secret..."
kubectl delete secret backend-secret --ignore-not-found
kubectl create secret generic backend-secret --from-env-file=.env

# Apply Manifests
echo "📄 Applying Kubernetes Manifests..."
kubectl apply -f k8s/

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "------------------------------------------------"
echo "Check Pods:    kubectl get pods"
echo "Check Service: kubectl get svc frontend-service"
echo "------------------------------------------------"