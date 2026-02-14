"use client";
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, trend, index }: any) => (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -4, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
        className="card p-6"
    >
        <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
                <p className="text-sm font-medium text-text-muted mb-2">{title}</p>
                <motion.p
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
                    className="text-3xl font-bold text-text-primary"
                >
                    {value}
                </motion.p>
            </div>
            <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`p-3 rounded-xl ${trend === 'up'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-cyan-100 text-cyan-600'
                    }`}
            >
                <Icon className="w-6 h-6" />
            </motion.div>
        </div>
        <div className="flex items-center text-sm">
            {trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-purple-500 mr-1" />
            ) : (
                <ArrowDownRight className="w-4 h-4 text-cyan-500 mr-1" />
            )}
            <span className={`font-medium ${trend === 'up' ? 'text-purple-500' : 'text-cyan-500'}`}>
                {change}
            </span>
            <span className="text-text-muted ml-2">vs last month</span>
        </div>
    </motion.div>
);

const DashboardStats = ({ stats }: { stats: any[] }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} index={index} />
            ))}
        </div>
    );
};

export default DashboardStats;
