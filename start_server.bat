@echo off
chcp 65001 >nul
title Chanh Dien Online 2.5D AI Server
echo ==============================================================
echo   CHANH DIEN ONLINE 2.5D AI MULTI-PLATFORM
echo   OBS Overlay:   http://127.0.0.1:8000/overlay
echo   Control Panel: http://127.0.0.1:8000/control
echo ==============================================================
echo.
cd /d "%~dp0"
python server.py
pause
