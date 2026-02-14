-- AI Smart Expense & Payroll Management System
-- PostgreSQL Database Schema

-- Enable UUID extension if needed, though Postgres has native UUID type
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Employees Table
DO $$ BEGIN
    CREATE TYPE role_enum AS ENUM ('Admin', 'HR', 'Employee');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE status_enum AS ENUM ('Active', 'On Leave', 'Terminated');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role role_enum NOT NULL,
    department VARCHAR(100),
    base_salary DECIMAL(12, 2) NOT NULL,
    join_date DATE NOT NULL,
    status status_enum DEFAULT 'Active',
    bank_account_no VARCHAR(50),
    bank_ifsc VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 2. Categories Table (for Expenses)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    budget_limit DECIMAL(10, 2) DEFAULT 0.00,
    description TEXT
);

-- 3. Expenses Table
DO $$ BEGIN
    CREATE TYPE expense_status_enum AS ENUM ('Pending', 'Approved', 'Rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY,
    user_id UUID,
    amount DECIMAL(10, 2) NOT NULL,
    category_id INT,
    description TEXT,
    receipt_url VARCHAR(255),
    date_incurred DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    status expense_status_enum DEFAULT 'Pending',
    ai_flag_anomaly BOOLEAN DEFAULT FALSE,
    anomaly_score DECIMAL(5, 4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 4. Payroll Table
DO $$ BEGIN
    CREATE TYPE payroll_status_enum AS ENUM ('Draft', 'Approved', 'Paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS payroll (
    id UUID PRIMARY KEY,
    employee_id UUID,
    month_year DATE NOT NULL,
    basic_pay DECIMAL(10, 2) NOT NULL,
    hra DECIMAL(10, 2) NOT NULL,
    special_allowance DECIMAL(10, 2) NOT NULL,
    overtime_pay DECIMAL(10, 2) DEFAULT 0.00,
    bonus DECIMAL(10, 2) DEFAULT 0.00,
    pf DECIMAL(10, 2) DEFAULT 0.00,
    professional_tax DECIMAL(10, 2) DEFAULT 0.00,
    tds DECIMAL(10, 2) DEFAULT 0.00,
    leave_deduction DECIMAL(10, 2) DEFAULT 0.00,
    net_salary DECIMAL(10, 2) NOT NULL,
    status payroll_status_enum DEFAULT 'Draft',
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (employee_id, month_year),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 5. Alerts Table
DO $$ BEGIN
    CREATE TYPE alert_type_enum AS ENUM ('Budget_Overrun', 'Low_Runway', 'Anomaly', 'Payroll_Action');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE severity_enum AS ENUM ('Low', 'Medium', 'High', 'Critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY,
    type alert_type_enum NOT NULL,
    message TEXT NOT NULL,
    severity severity_enum NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Financial Reports Table
CREATE TABLE IF NOT EXISTS financial_reports (
    id UUID PRIMARY KEY,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_income DECIMAL(12, 2) DEFAULT 0.00,
    total_expense DECIMAL(12, 2) NOT NULL,
    net_burn DECIMAL(12, 2) NOT NULL,
    runway_months DECIMAL(5, 1),
    health_score DECIMAL(5, 2),
    report_url VARCHAR(255),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date_incurred);
CREATE INDEX idx_payroll_emp_month ON payroll(employee_id, month_year);
