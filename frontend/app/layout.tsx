import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Smart Payroll',
    description: 'Expense & Payroll Management System',
};

// Bare root layout — sidebar is handled by the (dashboard) route group layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
