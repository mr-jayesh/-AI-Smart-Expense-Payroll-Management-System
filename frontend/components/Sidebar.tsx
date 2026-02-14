"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Banknote,
    PieChart,
    AlertTriangle,
    FileText,
    Settings
} from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Employees', icon: Users, path: '/employees' },
        { name: 'Payroll', icon: Banknote, path: '/payroll' },
        { name: 'Expenses', icon: PieChart, path: '/expenses' },
        { name: 'Alerts', icon: AlertTriangle, path: '/alerts' },
        { name: 'Reports', icon: FileText, path: '/reports' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col w-64 h-screen bg-white border-r border-gray-200 shadow-sm"
        >
            {/* Logo Section */}
            <div className="flex items-center justify-center h-20 border-b border-gray-200">
                <h1 className="text-2xl font-bold bg-gradient-purple bg-clip-text text-transparent">
                    AI-Payroll
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item, index) => (
                        <motion.li
                            key={item.name}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                        >
                            <Link
                                href={item.path}
                                className="flex items-center px-4 py-3 text-text-secondary hover:text-purple-500 hover:bg-purple-50 rounded-xl transition-all duration-200 group"
                            >
                                <item.icon className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        </motion.li>
                    ))}
                </ul>
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-purple flex items-center justify-center text-sm font-bold text-white shadow-md">
                        AD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">Admin User</p>
                        <p className="text-xs text-text-muted truncate">admin@company.com</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;
