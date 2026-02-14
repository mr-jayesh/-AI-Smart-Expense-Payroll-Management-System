import Link from 'next/link';
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
        <div className="flex flex-col w-64 h-screen bg-gray-900 text-white shadow-lg">
            <div className="flex items-center justify-center h-20 border-b border-gray-800">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                    AI-Payroll
                </h1>
            </div>
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <Link href={item.path} className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                                <item.icon className="w-5 h-5 mr-3" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-gray-800">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                        AD
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-gray-500">admin@company.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
