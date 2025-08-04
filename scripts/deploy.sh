#!/bin/bash

# Deployment script for Coding Agent
set -e

echo "🚀 Deploying Coding Agent..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build images
echo "📦 Building Docker images..."
docker build -t my-agent-image ./agent
docker build -t orchestrator-image ./orchestrator

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Start services
echo "▶️ Starting services..."
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Test the deployment
echo "🧪 Testing deployment..."
if curl -f http://localhost:3000/status/test > /dev/null 2>&1; then
    echo "✅ Orchestrator is responding"
else
    echo "⚠️ Orchestrator may not be ready yet"
fi

echo "🎉 Deployment complete!"
echo ""
echo "📋 Access URLs:"
echo "   Orchestrator: http://localhost:3000"
echo "   VNC (GUI): http://localhost:6080"
echo "   Jupyter: http://localhost:8888"
echo ""
echo "📝 Test with:"
echo "   curl -X POST -H 'Content-Type: application/json' \\"
echo "     -d '{\"task\":\"Build me a todo app\"}' \\"
echo "     http://localhost:3001/schedule" 
