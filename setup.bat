@echo off
echo ========================================
echo SevaNagar Health Dashboard Setup
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found: 
node --version

echo.
echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo Starting SevaNagar Health Dashboard...
echo.
echo The dashboard will be available at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call npm start

pause