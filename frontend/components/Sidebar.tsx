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
        <div className="flex flex-col w-64 h-screen glass-card border-r border-glass-border">
            {/* Logo Section */}
            <div className="flex items-center justify-center h-20 border-b border-glass-border">
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    AI-Payroll
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-2 px-3">
                    {menuItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.path}
                                className="flex items-center px-4 py-3 text-text-secondary hover:text-text-primary hover:bg-accent-primary/10 rounded-lg transition-all duration-200 group"
                            >
                                <item.icon className="w-5 h-5 mr-3 group-hover:text-accent-primary transition-colors" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* User Profile Section */}
            <div className="p-4 border-t border-glass-border">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-glass-bg transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold shadow-glow">
                        AD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">Admin User</p>
                        <p className="text-xs text-text-muted truncate">admin@company.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
