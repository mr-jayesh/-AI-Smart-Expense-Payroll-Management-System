"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Employees', icon: Users, path: '/employees' },
        { name: 'Payroll', icon: Banknote, path: '/payroll' },
        { name: 'Expenses', icon: PieChart, path: '/expenses' },
        { name: 'Alerts', icon: AlertTriangle, path: '/alerts' },
        { name: 'Reports', icon: FileText, path: '/reports' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col w-64 h-screen bg-sidebar"
        >
            {/* Logo Section */}
            <div className="flex items-center justify-center h-20 border-b border-sidebar-hover">
                <h1 className="text-2xl font-bold text-white">
                    AI-Payroll
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-1 px-3">
                    {menuItems.map((item, index) => {
                        const active = isActive(item.path);
                        return (
                            <motion.li
                                key={item.name}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05, duration: 0.3 }}
                            >
                                <Link
                                    href={item.path}
                                    className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${active
                                            ? 'bg-chart-purple text-white shadow-lg'
                                            : 'text-gray-400 hover:text-white hover:bg-sidebar-hover'
                                        }`}
                                >
                                    {/* Active indicator */}
                                    {active && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}

                                    <item.icon className={`w-5 h-5 mr-3 transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'
                                        }`} />
                                    <span className="font-medium">{item.name}</span>

                                    {/* Pulse animation for active item */}
                                    {active && (
                                        <motion.div
                                            className="absolute right-3 w-2 h-2 bg-white rounded-full"
                                            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    )}
                                </Link>
                            </motion.li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-sidebar-hover">
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-sidebar-hover transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-chart-cyan flex items-center justify-center text-sm font-bold text-white shadow-md">
                        AD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">Admin User</p>
                        <p className="text-xs text-gray-400 truncate">admin@company.com</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Sidebar;
