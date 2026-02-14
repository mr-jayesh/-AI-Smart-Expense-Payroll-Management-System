import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

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
            <body className={inter.className}>
                <div className="flex h-screen bg-gray-50">
                    {/* Sidebar */}
                    <Sidebar />

                    <div className="flex-1 flex flex-col overflow-hidden">
                        {/* Header */}
                        <Header />

                        {/* Main Content */}
                        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    )
}
