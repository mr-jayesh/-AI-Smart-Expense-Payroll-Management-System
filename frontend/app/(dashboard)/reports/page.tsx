"use client";
import React from 'react';
import { FileText, TrendingUp, TrendingDown, BarChart3, Download } from 'lucide-react';

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="w-8 h-8 text-green-600" />
                    Financial Reports
                </h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                    <Download className="w-4 h-4" />
                    Generate New Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg"><TrendingUp className="w-5 h-5 text-blue-600" /></div>
                        <h3 className="font-semibold text-gray-800">Income Summary</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">$124,500</p>
                    <p className="text-sm text-green-600 mt-2">+12% from last month</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg"><TrendingDown className="w-5 h-5 text-red-600" /></div>
                        <h3 className="font-semibold text-gray-800">Expense Summary</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">$84,200</p>
                    <p className="text-sm text-red-600 mt-2">+5% from last month</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg"><BarChart3 className="w-5 h-5 text-purple-600" /></div>
                        <h3 className="font-semibold text-gray-800">Net Runway</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">18 Months</p>
                    <p className="text-sm text-gray-500 mt-2">Based on current burn rate</p>
                </div>
            </div>

            <div className="bg-white rounded-xl border p-8 text-center">
                <div className="max-w-md mx-auto">
                    <BarChart3 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Detailed Analytics</h3>
                    <p className="text-gray-500 mb-6">Generate a comprehensive report to see deep insights into your payroll and expense trends.</p>
                    <button className="text-blue-600 font-semibold hover:underline">View Historical Reports</button>
                </div>
            </div>
        </div>
    );
}
