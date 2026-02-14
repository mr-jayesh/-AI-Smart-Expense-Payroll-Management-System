import './globals.css'
import type { Metadata } from 'next'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export const metadata: Metadata = {
    title: 'AI Smart Payroll',
    description: 'Expense & Payroll Management System',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <div className="flex h-screen">
                    {/* Sidebar */}
                    <Sidebar />

                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Header */}
                        <Header />

                        {/* Main Content */}
                        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    )
}
