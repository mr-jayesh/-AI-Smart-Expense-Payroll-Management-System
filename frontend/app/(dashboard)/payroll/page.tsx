"use client";
import React, { useEffect, useState } from 'react';
import { Banknote, Download, Filter, Search } from 'lucide-react';

export default function PayrollPage() {
    const [payroll, setPayroll] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPayroll = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/payroll');
            if (response.ok) {
                const data = await response.json();
                setPayroll(data);
            }
        } catch (error) {
            console.error('Failed to fetch payroll', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayroll();
    }, []);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Banknote className="w-8 h-8 text-blue-600" />
                    Payroll Management
                </h2>
                <div className="flex gap-3">
                    <button className="bg-white border text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-600">Employee</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Period</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Basic Pay</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Net Salary</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Payment Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading Payroll...</td></tr>
                            ) : payroll.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No payroll records found.</td></tr>
                            ) : (
                                payroll.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{record.employee_name}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{formatDate(record.month_year)}</td>
                                        <td className="p-4 text-sm text-gray-600 font-mono">₹{Number(record.basic_pay).toLocaleString()}</td>
                                        <td className="p-4 text-sm font-bold text-gray-900 font-mono">₹{Number(record.net_salary).toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${record.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                record.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-gray-100 text-gray-700'
                                                }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-500">
                                            {record.payment_date ? new Date(record.payment_date).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
