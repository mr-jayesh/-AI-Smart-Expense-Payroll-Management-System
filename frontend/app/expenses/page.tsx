"use client";
import React, { useEffect, useState } from 'react';
import { PieChart, Plus, Search, Tag, DollarSign, Calendar } from 'lucide-react';

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        user_id: '',
        amount: '',
        category_id: '',
        description: '',
        date_incurred: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        try {
            const [expRes, catRes, empRes] = await Promise.all([
                fetch('http://localhost:5000/api/expenses'),
                fetch('http://localhost:5000/api/categories'),
                fetch('http://localhost:5000/api/employees')
            ]);

            if (expRes.ok) setExpenses(await expRes.json());
            if (catRes.ok) setCategories(await catRes.json());
            if (empRes.ok) setEmployees(await empRes.json());
        } catch (error) {
            console.error('Failed to fetch expense data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setShowModal(false);
                setFormData({
                    user_id: '',
                    amount: '',
                    category_id: '',
                    description: '',
                    date_incurred: new Date().toISOString().split('T')[0]
                });
                fetchData();
            } else {
                const err = await response.json();
                alert(`Error: ${err.error}`);
            }
        } catch (error) {
            console.error('Error adding expense', error);
        }
    };

    const handleInputChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <PieChart className="w-8 h-8 text-purple-600" />
                    Expense Management
                </h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Expense
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-600">Description</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Employee</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Category</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Amount</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading Expenses...</td></tr>
                            ) : expenses.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No expenses found.</td></tr>
                            ) : (
                                expenses.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-gray-900">{exp.description}</div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">{exp.employee_name || 'System'}</td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Tag className="w-3 h-3" />
                                                {exp.category_name}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-gray-900 font-mono">₹{Number(exp.amount).toLocaleString()}</td>
                                        <td className="p-4 text-sm text-gray-500">{new Date(exp.date_incurred).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${exp.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                exp.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {exp.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-800">Add New Expense</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                                <select required name="user_id" value={formData.user_id} onChange={handleInputChange} className="w-full p-2 border rounded-lg outline-none">
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.full_name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select required name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full p-2 border rounded-lg outline-none">
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                <input required type="number" name="amount" value={formData.amount} onChange={handleInputChange} className="w-full p-2 border rounded-lg outline-none" placeholder="100.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input required type="date" name="date_incurred" value={formData.date_incurred} onChange={handleInputChange} className="w-full p-2 border rounded-lg outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea required name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border rounded-lg outline-none" placeholder="Travel expenses to client site" rows={3} />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors">Submit Expense</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
