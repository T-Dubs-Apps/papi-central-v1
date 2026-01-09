@echo off
REM ========================================
REM CORTEX DESKTOP - One-Click Setup
REM Automates installation and launch
REM ========================================

echo.
echo ========================================
echo  CORTEX DESKTOP - Auto Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found!
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo [1/4] Python detected...
echo.

REM Check if pip is available
pip --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] pip not found!
    pause
    exit /b 1
)

echo [2/4] pip detected...
echo.

REM Install dependencies
echo [3/4] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo [WARNING] Some packages may have failed to install
    echo Continuing anyway...
)
echo.

REM Check if dependencies installed
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Flask installation failed!
    echo Trying alternative installation...
    pip install flask flask-cors requests python-dotenv --user
)

echo [4/4] Setup complete!
echo.
echo ========================================
echo  READY TO LAUNCH
echo ========================================
echo.
echo Choose an option:
echo.
echo 1. Start Cortex Server (Python)
echo 2. Open Web Interface
echo 3. Both (Server + Web)
echo 4. View Documentation
echo 5. Exit
echo.

set /p choice="Enter choice (1-5): "

if "%choice%"=="1" goto server
if "%choice%"=="2" goto web
if "%choice%"=="3" goto both
if "%choice%"=="4" goto docs
if "%choice%"=="5" exit /b 0

:server
echo.
echo Starting Cortex Server...
echo [Press CTRL+C to stop]
echo.
python cortex_server.py
pause
exit /b 0

:web
echo.
echo Opening web interface...
start cortex-desktop-bridge.html
echo.
echo Remember to start the server with:
echo   python cortex_server.py
echo.
pause
exit /b 0

:both
echo.
echo Starting server in background...
start /B python cortex_server.py
timeout /t 3 /nobreak >nul
echo Opening web interface...
start cortex-desktop-bridge.html
echo.
echo ========================================
echo  CORTEX DESKTOP IS RUNNING!
echo ========================================
echo.
echo Server: http://localhost:5000
echo Web Interface: Opened in browser
echo.
echo Press any key to stop server...
pause >nul
taskkill /F /IM python.exe /FI "WINDOWTITLE eq cortex_server*" >nul 2>&1
echo Server stopped.
exit /b 0

:docs
echo.
echo Opening documentation...
start CORTEX_DESKTOP_README.md
start CORTEX_SETUP_GUIDE.md
pause
exit /b 0
