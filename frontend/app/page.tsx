"use client";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import DashboardStats from '@/components/DashboardStats';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { IndianRupee, Wallet, Users, Activity } from 'lucide-react';

// Memoized loading component
const LoadingState = React.memo(() => (
    <div className="flex items-center justify-center min-h-screen">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-8"
        >
            <div className="animate-pulse text-text-secondary">Loading Dashboard...</div>
        </motion.div>
    </div>
));
LoadingState.displayName = 'LoadingState';

// Memoized custom tooltip
const CustomTooltip = React.memo(({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                <p className="text-sm font-medium text-text-primary">{payload[0].payload.name}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: ₹{entry.value?.toLocaleString()}
                    </p>
                ))}
            </div>
        );
    }
    return null;
});
CustomTooltip.displayName = 'CustomTooltip';

export default function Home() {
    const [dashboardData, setDashboardData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard/stats');
                if (response.ok) {
                    const data = await response.json();
                    setDashboardData(data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Memoize stats config to prevent recalculation
    const statsConfig = useMemo(() => [
        {
            title: 'Total Payroll',
            value: `₹${dashboardData?.totalPayroll?.toLocaleString() || '0'}`,
            change: '+8.2%',
            icon: IndianRupee,
            trend: 'up',
        },
        {
            title: 'Monthly Burn Rate',
            value: `₹${dashboardData?.burnRate?.toLocaleString() || '0'}`,
            change: '+3.1%',
            icon: Wallet,
            trend: 'up',
        },
        {
            title: 'Active Employees',
            value: dashboardData?.activeEmployees?.toString() || '0',
            change: '+2',
            icon: Users,
            trend: 'up',
        },
        {
            title: 'Financial Health',
            value: `${dashboardData?.healthScore || 0}/100`,
            change: '+5',
            icon: Activity,
            trend: 'up',
        },
    ], [dashboardData]);

    // Memoize chart data
    const chartData = useMemo(() => dashboardData?.cashFlow || [], [dashboardData]);
    const recentAlerts = useMemo(() => dashboardData?.alerts || [], [dashboardData]);

    if (loading) {
        return <LoadingState />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h2 className="text-3xl font-bold text-text-primary mb-1">Dashboard Overview</h2>
                    <p className="text-text-secondary">Real-time financial insights and analytics</p>
                </div>
                <div className="card px-4 py-2">
                    <p className="text-xs text-text-muted">Last updated</p>
                    <p className="text-sm font-medium text-text-primary">{new Date().toLocaleTimeString()}</p>
                </div>
            </motion.div>

            {/* Stats Cards with Mini Charts */}
            <DashboardStats stats={statsConfig} />

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cash Flow Area Chart */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="lg:col-span-2 card p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-text-primary">Cash Flow Analysis</h3>
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-chart-purple"></div>
                                <span className="text-text-secondary">Income</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-chart-pink"></div>
                                <span className="text-text-secondary">Expense</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.05} />
                                    </linearGradient>
                                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#EC4899" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#EC4899" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#9CA3AF"
                                    style={{ fontSize: '12px' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="#9CA3AF"
                                    style={{ fontSize: '12px' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    stroke="#8B5CF6"
                                    strokeWidth={2}
                                    fill="url(#incomeGradient)"
                                    animationDuration={1500}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="#EC4899"
                                    strokeWidth={2}
                                    fill="url(#expenseGradient)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Recent Alerts */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="card p-6"
                >
                    <h3 className="text-lg font-semibold text-text-primary mb-6">Recent Alerts</h3>
                    <div className="space-y-3">
                        {recentAlerts.length > 0 ? (
                            recentAlerts.map((alert: any, index: number) => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className={`p-3 rounded-lg border ${alert.severity === 'High'
                                            ? 'bg-red-50 border-red-200'
                                            : 'bg-purple-50 border-purple-200'
                                        }`}
                                >
                                    <div className="flex items-start gap-2">
                                        <div className={`w-2 h-2 mt-1.5 rounded-full ${alert.severity === 'High' ? 'bg-red-500' : 'bg-purple-500'
                                            }`}></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-text-primary truncate">{alert.message}</p>
                                            <p className="text-xs text-text-muted mt-0.5">{alert.type}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-text-muted">No recent alerts.</p>
                            </div>
                        )}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-6 py-2.5 text-sm font-medium text-chart-purple hover:bg-purple-50 rounded-lg transition-all duration-200 border border-purple-200"
                    >
                        View All Alerts
                    </motion.button>
                </motion.div>
            </div>
        </div>
    )
}
