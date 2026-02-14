import { ArrowUpRight, ArrowDownRight, IndianRupee, Wallet, Users, Activity } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
            ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                {change}
            </span>
            <span className="text-gray-400 ml-2">vs last month</span>
        </div>
    </div>
);

const DashboardStats = ({ stats }: { stats: any[] }) => {
    // If no stats, use defaults or skeleton
    const displayStats = stats && stats.length > 0 ? stats : [
        {
            title: 'Total Payroll',
            value: '₹0',
            change: '+0%',
            icon: IndianRupee,
            trend: 'up',
        },
        {
            title: 'Monthly Burn Rate',
            value: '₹0',
            change: '+0%',
            icon: Wallet,
            trend: 'down',
        },
        {
            title: 'Active Employees',
            value: '0',
            change: '+0',
            icon: Users,
            trend: 'up',
        },
        {
            title: 'Financial Health',
            value: '0/100',
            change: '+0',
            icon: Activity,
            trend: 'up',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {displayStats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default DashboardStats;
