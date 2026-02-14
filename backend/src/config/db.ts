import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'ai_payroll',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 30000,
});

export const checkDatabaseConnection = async () => {
    try {
        const client = await pool.connect();
        console.log('Successfully connected to PostgreSQL database');
        client.release();
        return true;
    } catch (error) {
        console.error('Database connection failed:', error);
        return false;
    }
};
