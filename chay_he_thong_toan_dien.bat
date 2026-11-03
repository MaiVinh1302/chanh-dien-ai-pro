@echo off
chcp 65001 >nul
title KHỞI ĐỘNG CHÁNH ĐIỆN ONLINE 2.5D AI & ĐƯỜNG TRUYỀN INTERNET
cd /d "%~dp0"

echo =========================================================================
echo       HỆ THỐNG CHÁNH ĐIỆN ONLINE 2.5D AI MULTI-PLATFORM
echo =========================================================================
echo 1. Đang khởi động Server FastAPI (Port 8000)...
start "Chanh Dien AI Server" cmd /k "python server.py"

echo 2. Đang chờ Server sẵn sàng...
timeout /t 3 >nul

echo 3. Đang mở đường truyền Public HTTPS Cloudflare Tunnel cho Điện thoại...
start "Cloudflare Public Tunnel" cmd /k "cloudflared.exe tunnel --url http://127.0.0.1:8000"

echo.
echo =========================================================================
echo ĐÃ KHỞI CHẠY CẢ 2 TIẾN TRÌNH:
echo - Màn hình OBS Overlay trên máy: http://127.0.0.1:8000/overlay
echo - Bảng điều khiển Control:       http://127.0.0.1:8000/control
echo - Cửa sổ Cloudflare đang mở sẽ hiện link HTTPS công khai (dạng trycloudflare.com)
echo   để dùng trên điện thoại 4G/5G/Wi-Fi mà không lo chặn mạng!
echo =========================================================================
pause
