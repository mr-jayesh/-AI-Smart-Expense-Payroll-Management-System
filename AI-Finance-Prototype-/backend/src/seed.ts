import { pool } from './config/db';
import { v4 as uuidv4 } from 'uuid';

const seedData = async () => {
    const client = await pool.connect();
    try {
        console.log('Connected to PostgreSQL...');

        // Clear existing data
        await client.query('TRUNCATE TABLE financial_reports, alerts, payroll, expenses, employees, categories CASCADE');
        console.log('Cleared existing data.');

        // 1. Seed Categories
        await client.query('ALTER SEQUENCE categories_id_seq RESTART WITH 1');

        const categories = [
            ['Infrastructure', 5000, 'Server costs'],
            ['Meals', 1000, 'Team lunch'],
            ['Software', 2000, 'Licenses'],
            ['Travel', 10000, 'Client visits'],
            ['Office', 500, 'Supplies'],
            ['Miscellaneous', 500, 'Other']
        ];

        for (const cat of categories) {
            await client.query('INSERT INTO categories (name, budget_limit, description) VALUES ($1, $2, $3)', cat);
        }
        console.log('Seeded Categories.');

        // 2. Seed Employees
        const employees = [
            { id: uuidv4(), name: "Arjun Mehta", email: "arjun.mehta@company.com", role: "Employee", dept: "Engineering", salary: 72000, join_date: "2023-03-15" },
            { id: uuidv4(), name: "Priya Sharma", email: "priya.sharma@company.com", role: "Admin", dept: "Operations", salary: 88000, join_date: "2022-11-20" },
            { id: uuidv4(), name: "Rohan Verma", email: "rohan.verma@company.com", role: "Employee", dept: "Marketing", salary: 65000, join_date: "2023-06-10" },
            { id: uuidv4(), name: "Sneha Kapoor", email: "sneha.kapoor@company.com", role: "Employee", dept: "Finance", salary: 78000, join_date: "2021-09-05" },
            { id: uuidv4(), name: "Vikram Rao", email: "vikram.rao@company.com", role: "Employee", dept: "HR", salary: 60000, join_date: "2022-02-18" },
            { id: uuidv4(), name: "Ananya Gupta", email: "ananya.gupta@company.com", role: "Employee", dept: "Design", salary: 68000, join_date: "2023-01-12" },
            { id: uuidv4(), name: "Karan Malhotra", email: "karan.malhotra@company.com", role: "Admin", dept: "Engineering", salary: 95000, join_date: "2020-07-22" },
            { id: uuidv4(), name: "Meera Iyer", email: "meera.iyer@company.com", role: "Employee", dept: "Sales", salary: 73000, join_date: "2023-08-01" },
            { id: uuidv4(), name: "Rahul Nair", email: "rahul.nair@company.com", role: "Employee", dept: "Engineering", salary: 71000, join_date: "2022-04-11" },
            { id: uuidv4(), name: "Divya Singh", email: "divya.singh@company.com", role: "Employee", dept: "Finance", salary: 82000, join_date: "2021-12-09" },
            { id: uuidv4(), name: "Amit Kulkarni", email: "amit.kulkarni@company.com", role: "Employee", dept: "Operations", salary: 69000, join_date: "2023-05-03" },
            { id: uuidv4(), name: "Neha Reddy", email: "neha.reddy@company.com", role: "Employee", dept: "Marketing", salary: 67000, join_date: "2022-09-14" },
            { id: uuidv4(), name: "Siddharth Jain", email: "siddharth.jain@company.com", role: "Admin", dept: "Finance", salary: 98000, join_date: "2020-01-28" },
            { id: uuidv4(), name: "Pooja Menon", email: "pooja.menon@company.com", role: "Employee", dept: "HR", salary: 64000, join_date: "2023-02-19" },
            { id: uuidv4(), name: "Harsh Patel", email: "harsh.patel@company.com", role: "Employee", dept: "Engineering", salary: 76000, join_date: "2022-06-07" },
            { id: uuidv4(), name: "Ishita Roy", email: "ishita.roy@company.com", role: "Employee", dept: "Design", salary: 70000, join_date: "2023-04-16" },
            { id: uuidv4(), name: "Nikhil Arora", email: "nikhil.arora@company.com", role: "Employee", dept: "Sales", salary: 72000, join_date: "2021-11-23" },
            { id: uuidv4(), name: "Tanvi Desai", email: "tanvi.desai@company.com", role: "Employee", dept: "Marketing", salary: 66000, join_date: "2022-08-30" },
            { id: uuidv4(), name: "Aditya Bhatt", email: "aditya.bhatt@company.com", role: "Employee", dept: "Engineering", salary: 81000, join_date: "2021-10-10" },
            { id: uuidv4(), name: "Shruti Bose", email: "shruti.bose@company.com", role: "Employee", dept: "Finance", salary: 74000, join_date: "2023-07-05" },
            { id: uuidv4(), name: "Manish Yadav", email: "manish.yadav@company.com", role: "Employee", dept: "Operations", salary: 68000, join_date: "2022-03-17" },
            { id: uuidv4(), name: "Kavya Nair", email: "kavya.nair@company.com", role: "Employee", dept: "Design", salary: 72000, join_date: "2023-01-29" },
            { id: uuidv4(), name: "Ritesh Sinha", email: "ritesh.sinha@company.com", role: "Admin", dept: "HR", salary: 92000, join_date: "2020-05-21" },
            { id: uuidv4(), name: "Simran Kaur", email: "simran.kaur@company.com", role: "Employee", dept: "Sales", salary: 69000, join_date: "2023-09-11" },
            { id: uuidv4(), name: "Akash Tiwari", email: "akash.tiwari@company.com", role: "Employee", dept: "Engineering", salary: 83000, join_date: "2021-06-14" },
            { id: uuidv4(), name: "Riya Chatterjee", email: "riya.chatterjee@company.com", role: "Employee", dept: "Marketing", salary: 71000, join_date: "2022-10-08" },
            { id: uuidv4(), name: "Deepak Kumar", email: "deepak.kumar@company.com", role: "Employee", dept: "Operations", salary: 65000, join_date: "2023-03-03" },
            { id: uuidv4(), name: "Naina Joshi", email: "naina.joshi@company.com", role: "Employee", dept: "Finance", salary: 77000, join_date: "2021-08-19" },
            { id: uuidv4(), name: "Yash Agarwal", email: "yash.agarwal@company.com", role: "Employee", dept: "Engineering", salary: 88000, join_date: "2020-12-12" },
            { id: uuidv4(), name: "Komal Bansal", email: "komal.bansal@company.com", role: "Employee", dept: "HR", salary: 62000, join_date: "2023-05-27" },
            { id: uuidv4(), name: "Varun Saxena", email: "varun.saxena@company.com", role: "Employee", dept: "Design", salary: 74000, join_date: "2022-01-18" },
            { id: uuidv4(), name: "Shreya Pillai", email: "shreya.pillai@company.com", role: "Employee", dept: "Sales", salary: 69000, join_date: "2023-04-09" },
            { id: uuidv4(), name: "Gaurav Mishra", email: "gaurav.mishra@company.com", role: "Admin", dept: "Engineering", salary: 99000, join_date: "2019-11-01" },
            { id: uuidv4(), name: "Tanya Bhatia", email: "tanya.bhatia@company.com", role: "Employee", dept: "Marketing", salary: 72000, join_date: "2022-07-25" },
            { id: uuidv4(), name: "Mohit Shah", email: "mohit.shah@company.com", role: "Employee", dept: "Finance", salary: 76000, join_date: "2021-03-14" },
            { id: uuidv4(), name: "Alok Pradhan", email: "alok.pradhan@company.com", role: "Employee", dept: "Operations", salary: 70000, join_date: "2023-02-02" },
            { id: uuidv4(), name: "Pallavi Rao", email: "pallavi.rao@company.com", role: "Employee", dept: "HR", salary: 63000, join_date: "2022-05-16" },
            { id: uuidv4(), name: "Rohit Das", email: "rohit.das@company.com", role: "Employee", dept: "Engineering", salary: 82000, join_date: "2021-09-30" },
            { id: uuidv4(), name: "Snehal Patil", email: "snehal.patil@company.com", role: "Employee", dept: "Design", salary: 71000, join_date: "2023-06-21" },
            { id: uuidv4(), name: "Arnav Kapoor", email: "arnav.kapoor@company.com", role: "Employee", dept: "Sales", salary: 75000, join_date: "2022-04-04" },
            { id: uuidv4(), name: "Diya Verma", email: "diya.verma@company.com", role: "Employee", dept: "Marketing", salary: 67000, join_date: "2023-08-12" },
            { id: uuidv4(), name: "Kunal Mehra", email: "kunal.mehra@company.com", role: "Employee", dept: "Finance", salary: 79000, join_date: "2021-12-01" },
            { id: uuidv4(), name: "Ankit Roy", email: "ankit.roy@company.com", role: "Employee", dept: "Engineering", salary: 86000, join_date: "2020-06-06" },
            { id: uuidv4(), name: "Bhavna Iyer", email: "bhavna.iyer@company.com", role: "Employee", dept: "Operations", salary: 69000, join_date: "2023-03-25" },
            { id: uuidv4(), name: "Rajat Chawla", email: "rajat.chawla@company.com", role: "Employee", dept: "HR", salary: 64000, join_date: "2022-09-09" },
            { id: uuidv4(), name: "Sakshi Dubey", email: "sakshi.dubey@company.com", role: "Employee", dept: "Design", salary: 72000, join_date: "2023-01-05" },
            { id: uuidv4(), name: "Pranav Joshi", email: "pranav.joshi@company.com", role: "Employee", dept: "Engineering", salary: 90000, join_date: "2020-02-20" },
            { id: uuidv4(), name: "Aarushi Sharma", email: "aarushi.sharma@company.com", role: "Employee", dept: "Marketing", salary: 68000, join_date: "2022-12-18" },
            { id: uuidv4(), name: "Dev Malhotra", email: "dev.malhotra@company.com", role: "Employee", dept: "Sales", salary: 74000, join_date: "2023-07-30" }
        ];

        for (const emp of employees) {
            await client.query(
                `INSERT INTO employees (id, full_name, email, role, department, base_salary, join_date, status) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, 'Active')`,
                [emp.id, emp.name, emp.email, emp.role, emp.dept, emp.salary, emp.join_date]
            );
        }
        console.log(`Seeded ${employees.length} employees.`);

        // 3. Seed Payroll (Last Month)
        const payrolls = [];
        for (const emp of employees) {
            const net_pay = emp.salary * 0.85;
            // Month 1
            payrolls.push({
                id: uuidv4(),
                emp_id: emp.id,
                month: '2023-09-01',
                basic: emp.salary,
                net: net_pay,
                status: 'Approved'
            });
            // Month 2
            payrolls.push({
                id: uuidv4(),
                emp_id: emp.id,
                month: '2023-08-01',
                basic: emp.salary,
                net: net_pay,
                status: 'Paid'
            });
        }

        for (const pay of payrolls) {
            await client.query(
                `INSERT INTO payroll (id, employee_id, month_year, basic_pay, hra, special_allowance, net_salary, status, payment_date)
                 VALUES ($1, $2, $3, $4, 0, 0, $5, $6, NOW())`,
                [pay.id, pay.emp_id, pay.month, pay.basic, pay.net, pay.status]
            );
        }
        console.log(`Seeded ${payrolls.length} payroll records.`);

        // 4. Seed Expenses
        const expenses = [
            { desc: 'AWS Server Cost', amount: 150.00, cat: 1, status: 'Approved' },
            { desc: 'Team Lunch', amount: 200.50, cat: 2, status: 'Approved' },
            { desc: 'Software License (Adobe)', amount: 59.99, cat: 3, status: 'Pending' },
            { desc: 'Travel to Client', amount: 450.00, cat: 4, status: 'Approved' },
            { desc: 'Office Supplies', amount: 120.00, cat: 5, status: 'Approved' },
            { desc: 'Unknown Charge', amount: 999.00, cat: 6, status: 'Pending' },
        ];

        for (const exp of expenses) {
            const randomEmp = employees[Math.floor(Math.random() * employees.length)];
            await client.query(
                `INSERT INTO expenses (id, user_id, description, amount, category_id, status, date_incurred, receipt_url)
                 VALUES ($1, $2, $3, $4, $5, $6, NOW(), 'http://example.com/receipt.jpg')`,
                [uuidv4(), randomEmp.id, exp.desc, exp.amount, exp.cat, exp.status]
            );
        }
        console.log(`Seeded ${expenses.length} expenses.`);

        // 5. Seed Alerts
        const alerts = [
            { type: 'Anomaly', msg: 'Unusual high expense detected: ₹999.00 for Unknown Charge', severity: 'High' },
            { type: 'Budget_Overrun', msg: 'Marketing budget 85% utilized.', severity: 'Medium' },
            { type: 'Payroll_Action', msg: 'Payroll processing due for October.', severity: 'Low' },
        ];

        for (const alert of alerts) {
            await client.query(
                `INSERT INTO alerts (id, type, message, severity, created_at)
                 VALUES ($1, $2, $3, $4, NOW())`,
                [uuidv4(), alert.type, alert.msg, alert.severity]
            );
        }
        console.log(`Seeded ${alerts.length} alerts.`);

        console.log('Database seeding completed successfully!');

    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        client.release();
        await pool.end();
    }
};

seedData();
