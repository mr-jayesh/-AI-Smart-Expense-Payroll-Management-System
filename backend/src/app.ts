import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { supabase, checkDatabaseConnection, seedIfEmpty, createDemoUsers } from './config/db';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Startup Sequence ────────────────────────────────────────────────────────
(async () => {
    await checkDatabaseConnection();
    await seedIfEmpty();
    await createDemoUsers();
})();

// ─── Auth Routes ─────────────────────────────────────────────────────────────

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

        // Sign in via Supabase Auth (server-side using admin client still works)
        const { createClient } = await import('@supabase/supabase-js');
        const anonClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
        const { data, error } = await anonClient.auth.signInWithPassword({ email, password });

        if (error || !data.user) {
            return res.status(401).json({ error: error?.message || 'Invalid credentials' });
        }

        // Fetch role from profiles table
        const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', data.user.id).single();
        const role = profile?.role || data.user.user_metadata?.role || 'employee';
        const full_name = profile?.full_name || data.user.user_metadata?.full_name || email;

        res.json({
            access_token: data.session?.access_token,
            user: { id: data.user.id, email: data.user.email, full_name, role },
        });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/auth/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ error: 'No token' });

        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data.user) return res.status(401).json({ error: 'Invalid token' });

        const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', data.user.id).single();
        res.json({ user: { id: data.user.id, email: data.user.email, ...profile } });
    } catch {
        res.status(500).json({ error: 'Auth check failed' });
    }
});

// ─── Health ───────────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'AI Payroll API (Supabase)', timestamp: new Date().toISOString() }));
app.get('/', (_req, res) => res.send('AI Finance Backend running on Supabase!'));

// ─── Dashboard ────────────────────────────────────────────────────────────────

app.get('/api/dashboard/stats', async (_req, res) => {
    try {
        const [{ data: payrollData }, { data: expenseData }, { count: activeEmployees }, { data: alertRows }] = await Promise.all([
            supabase.from('payroll').select('net_salary').in('status', ['Paid', 'Approved']),
            supabase.from('expenses').select('amount').eq('status', 'Approved'),
            supabase.from('employees').select('id', { count: 'exact', head: true }).eq('status', 'Active'),
            supabase.from('alerts').select('*').order('created_at', { ascending: false }).limit(3),
        ]);

        const totalPayroll = payrollData?.reduce((sum, r) => sum + parseFloat(r.net_salary), 0) || 0;
        const totalExpenses = expenseData?.reduce((sum, r) => sum + parseFloat(r.amount), 0) || 0;
        const burnRate = totalPayroll + totalExpenses;

        res.json({
            totalPayroll,
            burnRate,
            activeEmployees: activeEmployees || 0,
            healthScore: 88,
            alerts: alertRows || [],
            cashFlow: [
                { name: 'Jan', income: 4000, expense: 2400 },
                { name: 'Feb', income: 3000, expense: 1398 },
                { name: 'Mar', income: 2000, expense: 9800 },
                { name: 'Apr', income: 2780, expense: 3908 },
                { name: 'May', income: 1890, expense: 4800 },
                { name: 'Jun', income: 2390, expense: 3800 },
                { name: 'Jul', income: 3490, expense: 4300 },
            ],
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
});

// ─── Employees ────────────────────────────────────────────────────────────────

app.get('/api/employees', async (_req, res) => {
    const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/employees', async (req, res) => {
    const { full_name, email, role, department, base_salary, join_date, bank_account_no, bank_ifsc } = req.body;
    if (!full_name || !email || !base_salary) return res.status(400).json({ error: 'Missing required fields' });

    const { data, error } = await supabase.from('employees').insert({
        full_name, email, role: role || 'Employee', department, base_salary,
        join_date: join_date || new Date().toISOString(), status: 'Active', bank_account_no, bank_ifsc,
    }).select('id').single();

    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: 'Employee added successfully', id: data.id });
});

app.put('/api/employees/:id', async (req, res) => {
    const { full_name, email, role, department, base_salary, join_date, status, bank_account_no, bank_ifsc } = req.body;
    if (!full_name || !email || !base_salary) return res.status(400).json({ error: 'Missing required fields' });

    const { error } = await supabase.from('employees').update({
        full_name, email, role, department, base_salary, join_date, status: status || 'Active', bank_account_no, bank_ifsc,
    }).eq('id', req.params.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Employee updated successfully' });
});

app.delete('/api/employees/:id', async (req, res) => {
    const { error } = await supabase.from('employees').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Employee deleted successfully' });
});

// ─── Payroll ──────────────────────────────────────────────────────────────────

app.get('/api/payroll', async (_req, res) => {
    const { data, error } = await supabase
        .from('payroll')
        .select('*, employees(full_name)')
        .order('month_year', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    // Flatten employees relation
    const flat = data?.map(r => ({ ...r, employee_name: (r.employees as any)?.full_name })) || [];
    res.json(flat);
});

// ─── Expenses ─────────────────────────────────────────────────────────────────

app.get('/api/expenses', async (_req, res) => {
    const { data, error } = await supabase
        .from('expenses')
        .select('*, employees(full_name), categories(name)')
        .order('date_incurred', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    const flat = data?.map(r => ({ ...r, employee_name: (r.employees as any)?.full_name, category_name: (r.categories as any)?.name })) || [];
    res.json(flat);
});

app.post('/api/expenses', async (req, res) => {
    const { user_id, amount, category_id, description, date_incurred } = req.body;
    if (!user_id || !amount || !category_id) return res.status(400).json({ error: 'Missing required fields' });

    let status = 'Pending';
    try {
        const aiResponse = await fetch('http://localhost:8000/predict/anomaly', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: parseFloat(amount), category_id: parseInt(category_id), day_of_week: 0, role_encoded: 1 }),
        });
        if (aiResponse.ok) {
            const ai: any = await aiResponse.json();
            if (ai.is_anomaly) {
                status = 'Flagged';
                await supabase.from('alerts').insert({ type: 'Expense Anomaly', message: `Expense of ₹${amount} flagged by AI.`, severity: 'High' });
            }
        }
    } catch { /* AI engine offline, skip */ }

    const { error } = await supabase.from('expenses').insert({ user_id, amount, category_id, description, date_incurred: date_incurred || new Date().toISOString(), status });
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: 'Expense added successfully' });
});

// ─── Categories ───────────────────────────────────────────────────────────────

app.get('/api/categories', async (_req, res) => {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// ─── Alerts ───────────────────────────────────────────────────────────────────

app.get('/api/alerts', async (_req, res) => {
    const { data, error } = await supabase.from('alerts').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
