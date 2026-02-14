@echo off
TITLE AI Smart Expense & Payroll System - Setup

echo ===================================================
echo AI Smart Expense & Payroll Management System - Setup
echo ===================================================
echo.

echo 1. Installing Backend Dependencies...
cd backend
call npm install
cd ..
echo Done.

echo.
echo 2. Installing AI Engine Dependencies...
cd ai_engine
python -m pip install --upgrade pip
pip install -r requirements.txt
cd ..
echo Done.

echo.
echo 3. Installing Frontend Dependencies...
cd frontend
call npm install
cd ..
echo Done.

echo.
echo Setup Complete! You can now run 'run_project.bat'.
pause
