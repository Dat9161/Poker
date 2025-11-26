@echo off
echo 🃏 Starting Poker Game Application...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker is running
echo.

echo Checking ports...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 3000 is already in use
) else (
    echo ✅ Port 3000 is available
)

netstat -ano | findstr :8080 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 8080 is already in use
) else (
    echo ✅ Port 8080 is available
)

netstat -ano | findstr :3306 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 3306 is already in use
) else (
    echo ✅ Port 3306 is available
)

echo.
echo 🚀 Starting services with Docker Compose...
echo This may take a few minutes on first run...
echo.

docker-compose up --build

echo.
echo 👋 Application stopped
pause
