#!/bin/bash

echo "========================================"
echo "  Kiểm tra các port đang sử dụng"
echo "========================================"
echo ""

echo "Kiểm tra port 3000 (Frontend):"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "  > Port 3000 ĐANG ĐƯỢC SỬ DỤNG"
    lsof -i :3000
else
    echo "  > Port 3000 TRỐNG"
fi
echo ""

echo "Kiểm tra port 8080 (Backend):"
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "  > Port 8080 ĐANG ĐƯỢC SỬ DỤNG"
    lsof -i :8080
else
    echo "  > Port 8080 TRỐNG"
fi
echo ""

echo "Kiểm tra port 3306 (MySQL cũ):"
if lsof -Pi :3306 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "  > Port 3306 ĐANG ĐƯỢC SỬ DỤNG (MySQL hiện tại của bạn)"
    lsof -i :3306
else
    echo "  > Port 3306 TRỐNG"
fi
echo ""

echo "Kiểm tra port 3307 (MySQL mới - Poker Game):"
if lsof -Pi :3307 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "  > Port 3307 ĐANG ĐƯỢC SỬ DỤNG (Poker Game MySQL)"
    lsof -i :3307
else
    echo "  > Port 3307 TRỐNG"
fi
echo ""

echo "========================================"
echo "  Kết quả:"
echo "========================================"
echo "  - Frontend:  Port 3000"
echo "  - Backend:   Port 8080"
echo "  - MySQL:     Port 3307 (ĐÃ ĐỔI từ 3306)"
echo "========================================"
echo ""
