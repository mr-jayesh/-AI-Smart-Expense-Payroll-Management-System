"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardStats from '@/components/DashboardStats';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { IndianRupee, Wallet, Users, Activity } from 'lucide-react';

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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card p-8"
                >
                    <div className="animate-pulse text-text-secondary">Loading Dashboard...</div>
                </motion.div>
            </div>
        );
    }

    // Default data if API fails or returns partial
    const chartData = dashboardData?.cashFlow || [];
    const recentAlerts = dashboardData?.alerts || [];

    // Map API data to Stats format
    const statsConfig = [
        {
            title: 'Total Payroll',
            value: `₹${dashboardData?.totalPayroll?.toLocaleString() || '0'}`,
            change: '+0%',
            icon: IndianRupee,
            trend: 'up',
        },
        {
            title: 'Monthly Burn Rate',
            value: `₹${dashboardData?.burnRate?.toLocaleString() || '0'}`,
            change: '+0%',
            icon: Wallet,
            trend: 'down',
        },
        {
            title: 'Active Employees',
            value: dashboardData?.activeEmployees?.toString() || '0',
            change: '+0',
            icon: Users,
            trend: 'up',
        },
        {
            title: 'Financial Health',
            value: `${dashboardData?.healthScore || 0}/100`,
            change: '+0',
            icon: Activity,
            trend: 'up',
        },
    ];

    // Vibrant colors for bars
    const barColors = ['#6366F1', '#8B5CF6', '#06B6D4', '#14B8A6'];

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center"
            >
                <div>
                    <h2 className="text-3xl font-bold text-text-primary mb-2">Dashboard Overview</h2>
                    <p className="text-text-secondary">Real-time financial insights and analytics</p>
                </div>
                <div className="card px-4 py-2">
                    <p className="text-sm text-text-muted">Last updated</p>
                    <p className="text-sm font-medium text-text-primary">{new Date().toLocaleTimeString()}</p>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <DashboardStats stats={statsConfig} />

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cash Flow Chart */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="lg:col-span-2 card p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-text-primary">Cash Flow Analysis</h3>
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-text-secondary">Income</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                                <span className="text-text-secondary">Expense</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
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
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    }}
                                    cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                                />
                                <Bar
                                    dataKey="income"
                                    fill="url(#purpleGradient)"
                                    radius={[8, 8, 0, 0]}
                                    animationDuration={1000}
                                />
                                <Bar
                                    dataKey="expense"
                                    fill="url(#cyanGradient)"
                                    radius={[8, 8, 0, 0]}
                                    animationDuration={1000}
                                />
                                <defs>
                                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366F1" />
                                        <stop offset="100%" stopColor="#8B5CF6" />
                                    </linearGradient>
                                    <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#06B6D4" />
                                        <stop offset="100%" stopColor="#14B8A6" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Recent Activity / Alerts */}
                <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="card p-6"
                >
                    <h3 className="text-xl font-semibold text-text-primary mb-6">Recent Alerts</h3>
                    <div className="space-y-4">
                        {recentAlerts.length > 0 ? (
                            recentAlerts.map((alert: any, index: number) => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className={`p-4 rounded-xl border ${alert.severity === 'High'
                                            ? 'bg-red-50 border-red-200'
                                            : 'bg-purple-50 border-purple-200'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 mt-2 rounded-full ${alert.severity === 'High' ? 'bg-red-500' : 'bg-purple-500'
                                            }`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-text-primary">{alert.message}</p>
                                            <p className="text-xs text-text-muted mt-1">{alert.type}</p>
                                            <p className="text-xs text-text-muted mt-2">
                                                {new Date(alert.created_at).toLocaleDateString()}
                                            </p>
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
                        className="w-full mt-6 py-3 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 border border-purple-200"
                    >
                        View All Alerts
                    </motion.button>
                </motion.div>
            </div>
        </div>
    )
}
