#!/bin/bash

echo "🃏 Starting Poker Game Application..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if ports are available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        echo "✅ Port $1 is available"
        return 0
    fi
}

echo "Checking ports..."
check_port 3000
check_port 8080
check_port 3306
echo ""

# Start Docker Compose
echo "🚀 Starting services with Docker Compose..."
echo "This may take a few minutes on first run..."
echo ""

docker-compose up --build

echo ""
echo "👋 Application stopped"
