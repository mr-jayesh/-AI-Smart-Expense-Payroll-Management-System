import express from 'express';
import cors from 'cors';
import { PayrollService } from './services/payrollService';
import { pool, checkDatabaseConnection } from './config/db';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Check DB Connection on startup
checkDatabaseConnection();

// Payroll Service Instance
const payrollService = new PayrollService();

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'Payroll API' });
});

// Root Route
app.get('/', (req, res) => {
    res.send('AI Finance Backend is Running!');
});

/**
 * API: Get Dashboard Stats
 * GET /api/dashboard/stats
 */
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const { rows: payrollRows }: any = await pool.query("SELECT SUM(net_salary) as total_payroll FROM payroll WHERE status = 'Paid' OR status = 'Approved'");
        const totalPayroll = payrollRows[0].total_payroll || 0;

        const { rows: expenseRows }: any = await pool.query("SELECT SUM(amount) as total_expenses FROM expenses WHERE status = 'Approved'");
        const totalExpenses = expenseRows[0].total_expenses || 0;

        // Burn Rate = Payroll + Expenses (simplified)
        const burnRate = parseFloat(totalPayroll) + parseFloat(totalExpenses);

        const { rows: empRows }: any = await pool.query("SELECT COUNT(*) as active_count FROM employees WHERE status = 'Active'");
        const activeEmployees = empRows[0].active_count || 0;

        // Mock Health Score logic
        const healthScore = 88;

        // Recent Alerts
        const { rows: alertRows }: any = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC LIMIT 3');

        // Cash Flow Mock Data (Hard to generate from limited seed data, so keeping mock but structured)
        const cashFlow = [
            { name: 'Jan', income: 4000, expense: 2400 },
            { name: 'Feb', income: 3000, expense: 1398 },
            { name: 'Mar', income: 2000, expense: 9800 },
            { name: 'Apr', income: 2780, expense: 3908 },
            { name: 'May', income: 1890, expense: 4800 },
            { name: 'Jun', income: 2390, expense: 3800 },
            { name: 'Jul', income: 3490, expense: 4300 },
        ];

        res.json({
            totalPayroll,
            burnRate,
            activeEmployees,
            healthScore,
            alerts: alertRows,
            cashFlow
        });
    } catch (error) {
        console.error('Dashboard Stats Error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

/**
 * API: Calculate Payroll
 * POST /api/payroll/calculate
 * Body: { employee: {...}, overtimeHours: 5, unpaidLeaves: 1 }
 */
app.post('/api/payroll/calculate', (req, res) => {
    try {
        const { employee, overtimeHours, unpaidLeaves, monthYear } = req.body;

        // Validate Input (Basic validation)
        if (!employee || !employee.baseSalary) {
            return res.status(400).json({ error: 'Invalid Employee Data' });
        }

        const result = payrollService.calculateMonthlyPayroll({
            employee,
            overtimeHours: overtimeHours || 0,
            unpaidLeaves: unpaidLeaves || 0,
            monthYear: new Date(monthYear || Date.now())
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

/**
 * API: Get All Employees
 * GET /api/employees
 */
app.get('/api/employees', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM employees ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

/**
 * API: Add New Employee
 * POST /api/employees
 */
app.post('/api/employees', async (req, res) => {
    try {
        const { full_name, email, role, department, base_salary, join_date, bank_account_no, bank_ifsc } = req.body;

        // Basic Validation
        if (!full_name || !email || !base_salary) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const id = uuidv4();

        await pool.query(
            `INSERT INTO employees (id, full_name, email, role, department, base_salary, join_date, status, bank_account_no, bank_ifsc) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'Active', $8, $9)`,
            [id, full_name, email, role || 'Employee', department, base_salary, join_date || new Date(), bank_account_no, bank_ifsc]
        );

        res.status(201).json({ message: 'Employee added successfully', id });
    } catch (error: any) {
        console.error('Error adding employee:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: `Email ${req.body.email} already exists` });
        }
        res.status(500).json({ error: error.message || 'Failed to add employee' });
    }
});

/**
 * API: Delete Employee
 * DELETE /api/employees/:id
 */
app.delete('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM employees WHERE id = $1', [id]);
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ error: 'Failed to delete employee' });
    }
});

/**
 * API: Update Employee
 * PUT /api/employees/:id
 */
app.put('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, role, department, base_salary, join_date, status, bank_account_no, bank_ifsc } = req.body;

        if (!full_name || !email || !base_salary) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        await pool.query(
            `UPDATE employees 
             SET full_name = $1, email = $2, role = $3, department = $4, base_salary = $5, 
                 join_date = $6, status = $7, bank_account_no = $8, bank_ifsc = $9
             WHERE id = $10`,
            [full_name, email, role, department, base_salary, join_date, status || 'Active', bank_account_no, bank_ifsc, id]
        );

        res.json({ message: 'Employee updated successfully' });
    } catch (error: any) {
        console.error('Error updating employee:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: `Email ${req.body.email} already exists` });
        }
        res.status(500).json({ error: error.message || 'Failed to update employee' });
    }
});

/**
 * API: Get All Payroll Records
 * GET /api/payroll
 */
app.get('/api/payroll', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT p.*, e.full_name as employee_name 
            FROM payroll p 
            JOIN employees e ON p.employee_id = e.id 
            ORDER BY p.month_year DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching payroll:', error);
        res.status(500).json({ error: 'Failed to fetch payroll records' });
    }
});

/**
 * API: Get All Expenses
 * GET /api/expenses
 */
app.get('/api/expenses', async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT ex.*, e.full_name as employee_name, c.name as category_name 
            FROM expenses ex 
            LEFT JOIN employees e ON ex.user_id = e.id 
            LEFT JOIN categories c ON ex.category_id = c.id 
            ORDER BY ex.date_incurred DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ error: 'Failed to fetch expenses' });
    }
});

/**
 * API: Get All Expense Categories
 * GET /api/categories
 */
app.get('/api/categories', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

/**
 * API: Add New Expense
 * POST /api/expenses
 */
app.post('/api/expenses', async (req, res) => {
    try {
        const { user_id, amount, category_id, description, date_incurred } = req.body;

        if (!user_id || !amount || !category_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const id = uuidv4();

        // --- AI ANOMALY CHECK Integration ---
        let status = 'Pending';
        let aiFlag = false;
        let aiConfidence = 0;

        try {
            // 1. Get Employee Role
            const empRes: any = await pool.query('SELECT role FROM employees WHERE id = $1', [user_id]);
            const role = empRes.rows[0]?.role || 'Employee';
            const roleEncoded = role === 'Manager' ? 2 : 1;

            // 2. Day of Week (0=Mon, 6=Sun)
            const date = new Date(date_incurred || Date.now());
            const dayOfWeek = (date.getDay() + 6) % 7;

            // 3. Call AI Engine
            const aiResponse = await fetch('http://localhost:8000/predict/anomaly', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    category_id: parseInt(category_id),
                    day_of_week: dayOfWeek,
                    role_encoded: roleEncoded
                })
            });

            if (aiResponse.ok) {
                const aiResult: any = await aiResponse.json();
                if (aiResult.is_anomaly) {
                    status = 'Flagged';
                    aiFlag = true;
                    aiConfidence = parseFloat(aiResult.confidence);
                    console.log(`[AI Alert] Expense ${id} flagged as anomaly. Confidence: ${aiConfidence}`);

                    // Optional: Insert into alerts table
                    await pool.query(
                        `INSERT INTO alerts (id, type, message, severity, created_at) VALUES ($1, $2, $3, $4, NOW())`,
                        [uuidv4(), 'Expense Anomaly', `Expense of ₹${amount} flagged by AI.`, 'High']
                    );
                }
            }
        } catch (aiError) {
            console.error('AI Service Error:', aiError);
            // Fallback: Proceed without AI check, log warning
        }

        await pool.query(
            `INSERT INTO expenses (id, user_id, amount, category_id, description, date_incurred, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [id, user_id, amount, category_id, description || '', date_incurred || new Date(), status]
        );

        res.status(201).json({ message: 'Expense added successfully', id });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ error: 'Failed to add expense' });
    }
});

/**
 * API: Get All System Alerts
 * GET /api/alerts
 */
app.get('/api/alerts', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching alerts:', error);
        res.status(500).json({ error: 'Failed to fetch alerts' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
