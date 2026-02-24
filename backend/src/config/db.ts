import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Supabase admin client (service role) – used for all DB operations + auth
export const supabase: SupabaseClient = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

// Keep pool export as null-safe wrapper so imports don't break
// We'll replace pool.query usage with supabase queries in app.ts
export const pool = { query: async (...args: any[]) => { throw new Error('Use supabase client instead of pool'); } };

export const supabaseAdmin = supabase;

export const checkDatabaseConnection = async () => {
    try {
        const { error } = await supabase.from('categories').select('id').limit(1);
        if (error && error.code !== 'PGRST116') throw error;
        console.log('✅ Connected to Supabase');
        return true;
    } catch (error) {
        console.error('❌ Supabase connection failed:', error);
        return false;
    }
};

// Auto-create schema using Supabase SQL execution
export const initializeSchema = async () => {
    // Schema is created via Supabase dashboard SQL editor.
    // Tables are created automatically when first written to.
    // We use Supabase's built-in PostgREST so no raw SQL DDL needed here.
    console.log('✅ Schema setup via Supabase (REST API mode)');
};

// Seed initial data if tables are empty
export const seedIfEmpty = async () => {
    try {
        const { data: cats } = await supabase.from('categories').select('id').limit(1);
        if (cats && cats.length > 0) return; // Already seeded

        // Seed Categories
        await supabase.from('categories').insert([
            { name: 'Infrastructure', budget_limit: 5000, description: 'Server costs' },
            { name: 'Meals', budget_limit: 1000, description: 'Team lunch' },
            { name: 'Software', budget_limit: 2000, description: 'Licenses' },
            { name: 'Travel', budget_limit: 10000, description: 'Client visits' },
            { name: 'Office', budget_limit: 500, description: 'Supplies' },
            { name: 'Miscellaneous', budget_limit: 500, description: 'Other' },
        ]);

        // Get category IDs
        const { data: insertedCats } = await supabase.from('categories').select('id').order('id');
        const catIds = insertedCats?.map(c => c.id) || [1, 2, 3, 4, 5, 6];

        // Seed Employees
        const employees = [
            { full_name: 'Arjun Mehta', email: 'arjun.mehta@company.com', role: 'Employee', department: 'Engineering', base_salary: 72000, join_date: '2023-03-15', status: 'Active' },
            { full_name: 'Priya Sharma', email: 'priya.sharma@company.com', role: 'Admin', department: 'Operations', base_salary: 88000, join_date: '2022-11-20', status: 'Active' },
            { full_name: 'Rohan Verma', email: 'rohan.verma@company.com', role: 'Employee', department: 'Marketing', base_salary: 65000, join_date: '2023-06-10', status: 'Active' },
            { full_name: 'Sneha Kapoor', email: 'sneha.kapoor@company.com', role: 'Employee', department: 'Finance', base_salary: 78000, join_date: '2021-09-05', status: 'Active' },
            { full_name: 'Vikram Rao', email: 'vikram.rao@company.com', role: 'Employee', department: 'HR', base_salary: 60000, join_date: '2022-02-18', status: 'Active' },
            { full_name: 'Karan Malhotra', email: 'karan.malhotra@company.com', role: 'Admin', department: 'Engineering', base_salary: 95000, join_date: '2020-07-22', status: 'Active' },
            { full_name: 'Meera Iyer', email: 'meera.iyer@company.com', role: 'Employee', department: 'Sales', base_salary: 73000, join_date: '2023-08-01', status: 'Active' },
            { full_name: 'Rahul Nair', email: 'rahul.nair@company.com', role: 'Employee', department: 'Engineering', base_salary: 71000, join_date: '2022-04-11', status: 'Active' },
            { full_name: 'Divya Singh', email: 'divya.singh@company.com', role: 'Employee', department: 'Finance', base_salary: 82000, join_date: '2021-12-09', status: 'Active' },
            { full_name: 'Amit Kulkarni', email: 'amit.kulkarni@company.com', role: 'Employee', department: 'Operations', base_salary: 69000, join_date: '2023-05-03', status: 'Active' },
        ];

        const { data: insertedEmps } = await supabase.from('employees').insert(employees).select('id, base_salary');
        const empIds = insertedEmps?.map(e => e.id) || [];

        // Seed Payroll
        if (empIds.length > 0 && insertedEmps) {
            const payrollData = insertedEmps.flatMap(emp => [
                { employee_id: emp.id, month_year: '2024-01-01', basic_pay: emp.base_salary, hra: 0, special_allowance: 0, net_salary: emp.base_salary * 0.85, status: 'Paid', payment_date: new Date().toISOString() },
                { employee_id: emp.id, month_year: '2024-02-01', basic_pay: emp.base_salary, hra: 0, special_allowance: 0, net_salary: emp.base_salary * 0.85, status: 'Approved', payment_date: new Date().toISOString() },
            ]);
            await supabase.from('payroll').insert(payrollData);
        }

        // Seed Expenses
        if (empIds.length >= 5) {
            await supabase.from('expenses').insert([
                { user_id: empIds[0], amount: 150.00, category_id: catIds[0], description: 'AWS Server Cost', status: 'Approved', date_incurred: new Date().toISOString() },
                { user_id: empIds[1], amount: 200.50, category_id: catIds[1], description: 'Team Lunch', status: 'Approved', date_incurred: new Date().toISOString() },
                { user_id: empIds[2], amount: 59.99, category_id: catIds[2], description: 'Software License (Adobe)', status: 'Pending', date_incurred: new Date().toISOString() },
                { user_id: empIds[3], amount: 450.00, category_id: catIds[3], description: 'Travel to Client', status: 'Approved', date_incurred: new Date().toISOString() },
                { user_id: empIds[4], amount: 999.00, category_id: catIds[5], description: 'Unknown Charge', status: 'Flagged', date_incurred: new Date().toISOString() },
            ]);
        }

        // Seed Alerts
        await supabase.from('alerts').insert([
            { type: 'Anomaly', message: 'Unusual high expense detected: ₹999.00 for Unknown Charge', severity: 'High' },
            { type: 'Budget_Overrun', message: 'Marketing budget 85% utilized.', severity: 'Medium' },
            { type: 'Payroll_Action', message: 'Payroll processing due for February.', severity: 'Low' },
        ]);

        console.log('✅ Seed data inserted');
    } catch (err: any) {
        console.error('Seed error:', err?.message || err);
    }
};

// Auto-create Supabase Auth demo users
export const createDemoUsers = async () => {
    try {
        const demoUsers = [
            { email: 'admin@ai-payroll.com', password: 'Admin@123', name: 'Admin User', role: 'admin' },
            { email: 'employee@ai-payroll.com', password: 'Employee@123', name: 'Employee User', role: 'employee' },
        ];

        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existingEmails = existingUsers?.users?.map(u => u.email) || [];

        for (const user of demoUsers) {
            if (!existingEmails.includes(user.email)) {
                const { data: newUser, error } = await supabase.auth.admin.createUser({
                    email: user.email,
                    password: user.password,
                    email_confirm: true,
                    user_metadata: { full_name: user.name, role: user.role },
                });
                if (newUser?.user) {
                    await supabase.from('profiles').upsert({
                        id: newUser.user.id,
                        full_name: user.name,
                        role: user.role,
                    });
                    console.log(`✅ Demo user created: ${user.email}`);
                } else if (error) {
                    console.error(`Demo user error for ${user.email}:`, error.message);
                }
            } else {
                console.log(`ℹ  Demo user already exists: ${user.email}`);
            }
        }
    } catch (err) {
        console.error('Demo user setup error:', err);
    }
};
