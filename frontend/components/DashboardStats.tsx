"use client";
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

// Generate sample mini chart data
const generateMiniChartData = () => {
    return Array.from({ length: 7 }, (_, i) => ({
        value: Math.floor(Math.random() * 100) + 50
    }));
};

const StatCard = ({ title, value, change, icon: Icon, trend, index, chartColor }: any) => {
    const miniData = generateMiniChartData();

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
            className="card p-6"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <p className="text-sm font-medium text-text-muted mb-1">{title}</p>
                    <motion.p
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                        className="text-2xl font-bold text-text-primary"
                    >
                        {value}
                    </motion.p>
                    <div className="flex items-center text-sm mt-2">
                        {trend === 'up' ? (
                            <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                            <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                        )}
                        <span className={`font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {change}
                        </span>
                    </div>
                </div>
            </div>

            {/* Mini Area Chart */}
            <div className="h-16 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={miniData}>
                        <defs>
                            <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={chartColor} stopOpacity={0.3} />
                                <stop offset="100%" stopColor={chartColor} stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={chartColor}
                            strokeWidth={2}
                            fill={`url(#gradient-${index})`}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};

const DashboardStats = ({ stats }: { stats: any[] }) => {
    // Chart colors matching reference
    const chartColors = ['#8B5CF6', '#EC4899', '#06B6D4', '#F59E0B'];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatCard
                    key={index}
                    {...stat}
                    index={index}
                    chartColor={chartColors[index % chartColors.length]}
                />
            ))}
        </div>
    );
};

export default DashboardStats;
