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
        return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;
    }

    // Default data if API fails or returns partial
    const chartData = dashboardData?.cashFlow || [];
    const recentAlerts = dashboardData?.alerts || [];

    // Map API data to Stats format
    const statsConfig = [
        {
            title: 'Total Payroll',
            value: `₹${dashboardData?.totalPayroll?.toLocaleString() || '0'}`,
            change: '+0%', // Dynamic change logic would require historical data
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
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <div className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
            </div>

            {/* Stats Cards */}
            <DashboardStats stats={statsConfig} />

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cash Flow Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Cash Flow Analysis</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="income" stroke="#8884d8" fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="#82ca9d" fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity / Alerts */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Alerts</h3>
                    <div className="space-y-4">
                        {recentAlerts.length > 0 ? (
                            recentAlerts.map((alert: any) => (
                                <div key={alert.id} className={`flex items-start p-3 rounded-lg ${alert.severity === 'High' ? 'bg-red-50' : 'bg-blue-50'}`}>
                                    <div className={`w-2 h-2 mt-2 rounded-full mr-3 ${alert.severity === 'High' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{alert.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{alert.type}</p>
                                        <p className="text-xs text-gray-400 mt-2">{new Date(alert.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">No recent alerts.</p>
                        )}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                        View All Alerts
                    </button>
                </div>
            </div>
        </div>
    )
}
