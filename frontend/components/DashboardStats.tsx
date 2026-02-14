import { ArrowUpRight, ArrowDownRight, IndianRupee, Wallet, Users, Activity } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
    <div className="glass-card p-6 hover:shadow-glow transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
                <p className="text-sm font-medium text-text-muted mb-2">{title}</p>
                <p className="text-3xl font-bold text-text-primary">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${trend === 'up'
                    ? 'bg-accent-secondary/20 text-accent-secondary'
                    : 'bg-accent-pink/20 text-accent-pink'
                } group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        <div className="flex items-center text-sm">
            {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-accent-secondary mr-1" />
            ) : (
                <ArrowDownRight className="w-4 h-4 text-accent-pink mr-1" />
            )}
            <span className={trend === 'up' ? 'text-accent-secondary font-medium' : 'text-accent-pink font-medium'}>
                {change}
            </span>
            <span className="text-text-muted ml-2">vs last month</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayStats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
};

export default DashboardStats;
