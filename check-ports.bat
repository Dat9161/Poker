@echo off
echo ========================================
echo   Kiem tra cac port dang su dung
echo ========================================
echo.

echo Kiem tra port 3000 (Frontend):
netstat -ano | findstr :3000
if %errorlevel% equ 0 (
    echo   ^> Port 3000 DANG DUOC SU DUNG
) else (
    echo   ^> Port 3000 TRONG
)
echo.

echo Kiem tra port 8080 (Backend):
netstat -ano | findstr :8080
if %errorlevel% equ 0 (
    echo   ^> Port 8080 DANG DUOC SU DUNG
) else (
    echo   ^> Port 8080 TRONG
)
echo.

echo Kiem tra port 3306 (MySQL cu):
netstat -ano | findstr :3306
if %errorlevel% equ 0 (
    echo   ^> Port 3306 DANG DUOC SU DUNG (MySQL hien tai cua ban)
) else (
    echo   ^> Port 3306 TRONG
)
echo.

echo Kiem tra port 3307 (MySQL moi - Poker Game):
netstat -ano | findstr :3307
if %errorlevel% equ 0 (
    echo   ^> Port 3307 DANG DUOC SU DUNG (Poker Game MySQL)
) else (
    echo   ^> Port 3307 TRONG
)
echo.

echo ========================================
echo   Ket qua:
echo ========================================
echo   - Frontend:  Port 3000
echo   - Backend:   Port 8080
echo   - MySQL:     Port 3307 (DA DOI tu 3306)
echo ========================================
echo.
pause
