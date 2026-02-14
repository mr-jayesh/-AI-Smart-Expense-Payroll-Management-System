@echo off

TITLE AI Smart Expense ^& Payroll System - Launcher

echo ===================================================
echo AI Smart Expense ^& Payroll Management System
echo ===================================================
echo.
echo Starting all services...

:: 1. Backend Service
echo Starting Backend Service (Port 5000)...
start "Backend Service" cmd /k "cd backend && npm start"

:: 2. AI Engine Service
echo Starting AI Engine Service (Port 8000)...
start "AI Engine Service" cmd /k "cd ai_engine && python -m uvicorn api:app --host 0.0.0.0 --port 8000 --reload"

:: 3. Frontend Service
echo Starting Frontend Dashboard (Port 3001)...
start "Frontend Dashboard" cmd /k "cd frontend && npm run dev"

echo.
echo All services are launching in separate windows.
echo - Backend: http://localhost:5000
echo - AI Engine: http://localhost:8000
echo - Frontend: http://localhost:3001
echo.
pause
