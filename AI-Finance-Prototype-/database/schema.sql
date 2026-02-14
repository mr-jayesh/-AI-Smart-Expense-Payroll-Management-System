-- AI Smart Expense & Payroll Management System
-- MySQL Database Schema

-- 1. Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id CHAR(36) PRIMARY KEY, -- UUID stored as CHAR(36)
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role ENUM('Admin', 'HR', 'Employee') NOT NULL,
    department VARCHAR(100),
    base_salary DECIMAL(12, 2) NOT NULL,
    join_date DATE NOT NULL,
    status ENUM('Active', 'On Leave', 'Terminated') DEFAULT 'Active',
    bank_account_no VARCHAR(50),
    bank_ifsc VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Categories Table (for Expenses)
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    budget_limit DECIMAL(10, 2) DEFAULT 0.00,
    description TEXT
);

-- 3. Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36),
    amount DECIMAL(10, 2) NOT NULL,
    category_id INT,
    description TEXT,
    receipt_url VARCHAR(255),
    date_incurred DATE NOT NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    ai_flag_anomaly BOOLEAN DEFAULT FALSE,
    anomaly_score DECIMAL(5, 4), -- Store the AI confidence/severity score
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 4. Payroll Table
CREATE TABLE IF NOT EXISTS payroll (
    id CHAR(36) PRIMARY KEY,
    employee_id CHAR(36),
    month_year DATE NOT NULL, -- Stored as first day of month, e.g., '2023-10-01'
    
    -- Earnings
    basic_pay DECIMAL(10, 2) NOT NULL,
    hra DECIMAL(10, 2) NOT NULL,
    special_allowance DECIMAL(10, 2) NOT NULL,
    overtime_pay DECIMAL(10, 2) DEFAULT 0.00,
    bonus DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Deductions
    pf DECIMAL(10, 2) DEFAULT 0.00,
    professional_tax DECIMAL(10, 2) DEFAULT 0.00,
    tds DECIMAL(10, 2) DEFAULT 0.00,
    leave_deduction DECIMAL(10, 2) DEFAULT 0.00,
    
    net_salary DECIMAL(10, 2) NOT NULL,
    
    status ENUM('Draft', 'Approved', 'Paid') DEFAULT 'Draft',
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_payroll (employee_id, month_year),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 5. Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id CHAR(36) PRIMARY KEY,
    type ENUM('Budget_Overrun', 'Low_Runway', 'Anomaly', 'Payroll_Action') NOT NULL,
    message TEXT NOT NULL,
    severity ENUM('Low', 'Medium', 'High', 'Critical') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Financial Reports Table
CREATE TABLE IF NOT EXISTS financial_reports (
    id CHAR(36) PRIMARY KEY,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_income DECIMAL(12, 2) DEFAULT 0.00,
    total_expense DECIMAL(12, 2) NOT NULL,
    net_burn DECIMAL(12, 2) NOT NULL,
    runway_months DECIMAL(5, 1),
    health_score DECIMAL(5, 2),
    report_url VARCHAR(255), -- Link to PDF
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_expenses_user ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date_incurred);
CREATE INDEX idx_payroll_emp_month ON payroll(employee_id, month_year);
