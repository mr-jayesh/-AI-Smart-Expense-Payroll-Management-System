"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabase';
import {
    LayoutDashboard,
    Users,
    Banknote,
    PieChart,
    AlertTriangle,
    FileText,
    Settings,
    LogOut,
    ShieldCheck,
    User
} from 'lucide-react';

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [userName, setUserName] = useState('Loading...');
    const [userEmail, setUserEmail] = useState('');
    const [userRole, setUserRole] = useState('employee');

    useEffect(() => {
        const supabase = createSupabaseClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUserEmail(user.email || '');
                setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
                setUserRole(user.user_metadata?.role || 'employee');
            }
        });
    }, []);

    const handleLogout = async () => {
        const supabase = createSupabaseClient();
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { name: 'Employees', icon: Users, path: '/employees' },
        { name: 'Payroll', icon: Banknote, path: '/payroll' },
        { name: 'Expenses', icon: PieChart, path: '/expenses' },
        { name: 'Alerts', icon: AlertTriangle, path: '/alerts' },
        { name: 'Reports', icon: FileText, path: '/reports' },
        { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    const isActive = (path: string) => pathname === path;

    const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col w-64 h-screen bg-sidebar"
        >
            {/* Logo */}
            <div className="flex items-center justify-center h-20 border-b border-sidebar-hover">
                <h1 className="text-2xl font-bold text-white">AI-Payroll</h1>
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
                                        ? 'bg-slate-700 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-white hover:bg-sidebar-hover'
                                        }`}
                                >
                                    {active && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                                            initial={false}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <item.icon className={`w-5 h-5 mr-3 transition-transform ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    <span className="font-medium">{item.name}</span>
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

            {/* User Profile + Logout */}
            <div className="p-4 border-t border-sidebar-hover space-y-2">
                {/* Role Badge */}
                <div className="flex items-center justify-center">
                    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${userRole === 'admin'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-blue-500/20 text-blue-300'
                        }`}>
                        {userRole === 'admin'
                            ? <><ShieldCheck className="w-3 h-3" /> Admin</>
                            : <><User className="w-3 h-3" /> Employee</>
                        }
                    </span>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-sidebar-hover transition-colors">
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-sm font-bold text-white shadow-md flex-shrink-0">
                        {initials || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{userName}</p>
                        <p className="text-xs text-gray-400 truncate">{userEmail}</p>
                    </div>
                </div>

                {/* Logout Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 text-sm font-medium"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </motion.button>
            </div>
        </motion.div>
    );
};

export default Sidebar;
