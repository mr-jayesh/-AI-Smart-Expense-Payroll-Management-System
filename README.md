# AI Smart Expense & Payroll Management System - Setup Guide

This guide explains how to set up and run the entire system (Database, Backend, AI Engine, and Frontend).

## Prerequisites

Ensure you have the following installed:
-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [Python](https://www.python.org/) (v3.9 or higher)
-   [PostgreSQL](https://www.postgresql.org/) (v14 or higher)

---

## 1. Database Setup (PostgreSQL)

1.  Open your terminal or `psql` shell.
2.  Create a new database named `ai_payroll`:
    ```sql
    CREATE DATABASE ai_payroll;
    ```
3.  Load the schema from `database/schema.sql`:
    ```bash
    psql -U postgres -d ai_payroll -f database/schema.sql
    ```
    *(Alternatively, you can open `database/schema.sql` in pgAdmin and run the script manually against the `ai_payroll` database).*

---

## 2. Backend Setup (Node.js)

The Backend handles the core logic and payroll calculations.

1.  Navigate to the directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```
    -   The server will run on `http://localhost:3000`.
    -   Test Endpoint: `POST http://localhost:3000/api/payroll/calculate`

---

## 3. AI Engine Setup (Python)

The AI Engine handles Anomaly Detection and Predictions.

1.  Navigate to the directory:
    ```bash
    cd ai_engine
    ```
2.  (Optional) Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use: venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Start the AI Service (FastAPI):
    ```bash
    uvicorn api:app --reload
    ```
    -   The service will run on `http://localhost:8000`.
    -   Docs/Swagger UI: `http://localhost:8000/docs`

---

## 4. Frontend Setup (Next.js)

The Frontend provides the User Interface (Dashboard).

1.  Navigate to the directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Next.js development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and go to:
    ```
    http://localhost:3001
    ```
    *(Note: If port 3000 is taken by the backend, Next.js will usually prompt to use 3001 or another port automatically).*

---

## Project Structure Overview

-   `database/schema.sql`: Contains all SQL tables (Employees, Payroll, Expenses).
-   `backend/src/services/payrollService.ts`: Contains the complex payroll calculation logic.
-   `ai_engine/anomaly_detector.py`: Contains the machine learning model logic.
-   `frontend/app/page.tsx`: The main Dashboard page.
