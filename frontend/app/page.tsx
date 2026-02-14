"use client";
import React, { useEffect, useState } from 'react';
import DashboardStats from '@/components/DashboardStats';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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
                <div className="glass-card p-8">
                    <div className="animate-pulse text-text-secondary">Loading Dashboard...</div>
                </div>
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

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary mb-2">Dashboard Overview</h2>
                    <p className="text-text-secondary">Real-time financial insights and analytics</p>
                </div>
                <div className="glass-card px-4 py-2">
                    <p className="text-sm text-text-muted">Last updated</p>
                    <p className="text-sm font-medium text-text-primary">{new Date().toLocaleTimeString()}</p>
                </div>
            </div>

            {/* Stats Cards */}
            <DashboardStats stats={statsConfig} />

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cash Flow Chart */}
                <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-text-primary">Cash Flow Analysis</h3>
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-accent-primary"></div>
                                <span className="text-text-secondary">Income</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-accent-secondary"></div>
                                <span className="text-text-secondary">Expense</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    stroke="#64748b"
                                    style={{ fontSize: '12px' }}
                                />
                                <YAxis
                                    stroke="#64748b"
                                    style={{ fontSize: '12px' }}
                                />
                                <CartesianGrid strokeDasharray="3 3" stroke="#1a1f3a" vertical={false} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 14, 26, 0.95)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        color: '#ffffff'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorIncome)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="#14b8a6"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorExpense)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity / Alerts */}
                <div className="glass-card p-6">
                    <h3 className="text-xl font-semibold text-text-primary mb-6">Recent Alerts</h3>
                    <div className="space-y-4">
                        {recentAlerts.length > 0 ? (
                            recentAlerts.map((alert: any) => (
                                <div
                                    key={alert.id}
                                    className={`p-4 rounded-lg border ${alert.severity === 'High'
                                            ? 'bg-red-500/10 border-red-500/30'
                                            : 'bg-accent-primary/10 border-accent-primary/30'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 mt-2 rounded-full ${alert.severity === 'High' ? 'bg-red-500' : 'bg-accent-primary'
                                            }`}></div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-text-primary">{alert.message}</p>
                                            <p className="text-xs text-text-muted mt-1">{alert.type}</p>
                                            <p className="text-xs text-text-muted mt-2">
                                                {new Date(alert.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-sm text-text-muted">No recent alerts.</p>
                            </div>
                        )}
                    </div>
                    <button className="w-full mt-6 py-3 text-sm font-medium text-accent-primary hover:bg-accent-primary/10 rounded-lg transition-all duration-200 border border-accent-primary/30">
                        View All Alerts
                    </button>
                </div>
            </div>
        </div>
    )
}
