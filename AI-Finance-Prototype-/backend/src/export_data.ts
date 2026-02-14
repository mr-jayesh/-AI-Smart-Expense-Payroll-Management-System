import { pool } from './config/db';
import fs from 'fs';
import path from 'path';

const exportDir = path.join(__dirname, '../../data_view');

async function exportTable(tableName: string) {
    try {
        const { rows } = await pool.query(`SELECT * FROM ${tableName}`);
        if (rows.length === 0) {
            fs.writeFileSync(path.join(exportDir, `${tableName}.md`), `# ${tableName}\n\nNo data found.`);
            return;
        }

        const headers = Object.keys(rows[0]);
        let md = `# ${tableName}\n\n`;
        md += `| ${headers.join(' | ')} |\n`;
        md += `| ${headers.map(() => '---').join(' | ')} |\n`;

        rows.forEach((row: any) => {
            const values = headers.map(h => {
                const val = row[h];
                if (val instanceof Date) return val.toISOString().split('T')[0];
                return val === null ? 'NULL' : String(val).replace(/\|/g, '\\|');
            });
            md += `| ${values.join(' | ')} |\n`;
        });

        fs.writeFileSync(path.join(exportDir, `${tableName}.md`), md);
        console.log(`Exported ${tableName} to data_view/${tableName}.md`);
    } catch (error) {
        console.error(`Error exporting ${tableName}:`, error);
    }
}

async function runExport() {
    if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir);
    }

    const tables = ['employees', 'categories', 'expenses', 'payroll', 'alerts', 'financial_reports'];
    for (const table of tables) {
        await exportTable(table);
    }
    process.exit(0);
}

runExport();
