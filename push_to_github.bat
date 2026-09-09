@echo off
set "PATH=C:\Users\Lenovo\AppData\Local\Programs\MinGit\cmd;C:\Users\Lenovo\AppData\Local\Programs\MinGit\mingw64\bin;%PATH%"
cd /d "%~dp0"
echo ============================================================
echo   Pushing CinePulse to GitHub (Yashbhai18)
echo ============================================================
echo.
git push -u origin main
echo.
echo ============================================================
echo   Finished!
echo ============================================================
pause
