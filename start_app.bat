@echo off
cd /d "%~dp0"
echo ============================================================
echo   Starting CinePulse Movie Recommendation System
echo ============================================================
echo.
echo Starting Backend Server (port 5000)...
start "CinePulse Backend" cmd /c "node server/server.js"

timeout /t 2 /nobreak >nul

echo Starting Frontend Vite Client (port 5173)...
start "CinePulse Frontend" cmd /c "npm --prefix client run dev"

timeout /t 2 /nobreak >nul

echo Opening browser at http://localhost:5173...
start http://localhost:5173

echo.
echo App is running! Close the server/client windows to stop.
