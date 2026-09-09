@echo off
set "PATH=C:\Users\Lenovo\AppData\Local\Programs\MinGit\cmd;C:\Users\Lenovo\AppData\Local\Programs\MinGit\mingw64\bin;%PATH%"
cd /d "%~dp0"
echo ============================================================
echo   Syncing all changes to GitHub...
echo ============================================================
git add .
git commit -m "Update project files"
git push
echo.
echo ============================================================
echo   Done! All updates pushed to GitHub.
echo ============================================================
timeout /t 3 >nul
