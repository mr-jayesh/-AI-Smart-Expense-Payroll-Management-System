"use client";
import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Search, UserPlus, Edit2 } from 'lucide-react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'Employee',
    department: '',
    base_salary: '',
    join_date: '',
    status: 'Active',
    bank_account_no: '',
    bank_ifsc: ''
  });

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/employees');
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Failed to fetch employees', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      try {
        await fetch(`http://localhost:5000/api/employees/${id}`, { method: 'DELETE' });
        fetchEmployees(); // Refresh list
      } catch (error) {
        console.error('Failed to delete employee', error);
      }
    }
  };

  const handleEdit = (emp: any) => {
    setIsEditing(true);
    setEditingId(emp.id);
    setFormData({
      full_name: emp.full_name,
      email: emp.email,
      role: emp.role,
      department: emp.department || '',
      base_salary: emp.base_salary,
      join_date: emp.join_date ? emp.join_date.split('T')[0] : '',
      status: emp.status || 'Active',
      bank_account_no: emp.bank_account_no || '',
      bank_ifsc: emp.bank_ifsc || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing
        ? `http://localhost:5000/api/employees/${editingId}`
        : 'http://localhost:5000/api/employees';

      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setIsEditing(false);
        setEditingId(null);
        setFormData({
          full_name: '', email: '', role: 'Employee', department: '',
          base_salary: '', join_date: '', status: 'Active', bank_account_no: '', bank_ifsc: ''
        });
        fetchEmployees();
      } else {
        const errorData = await response.json();
        alert(`Failed to ${isEditing ? 'update' : 'add'} employee: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error processing employee', error);
      alert('Error processing employee. Check console for details.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      full_name: '', email: '', role: 'Employee', department: '',
      base_salary: '', join_date: '', status: 'Active', bank_account_no: '', bank_ifsc: ''
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Employee Management</h2>
        <button
          onClick={() => {
            setIsEditing(false);
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Employee
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">S.No</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Role</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Department</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Salary</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading...</td></tr>
              ) : employees.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-gray-500">No employees found. Add one to get started.</td></tr>
              ) : (
                employees.map((emp, index) => (
                  <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm text-gray-500 font-medium">{index + 1}</td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{emp.full_name}</div>
                      <div className="text-xs text-gray-500">{emp.email}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{emp.role}</td>
                    <td className="p-4 text-sm text-gray-600">{emp.department}</td>
                    <td className="p-4 text-sm text-gray-600 font-mono">₹{Number(emp.base_salary).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(emp)}
                          className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit Employee"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(emp.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Employee"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Employee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                {isEditing ? 'Edit Employee' : 'Add New Employee'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required name="full_name" value={formData.full_name} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="john@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                    <option value="HR">HR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input required name="department" value={formData.department} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Engineering" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary (Annual)</label>
                  <input required type="number" name="base_salary" value={formData.base_salary} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="50000" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                  <input required type="date" name="join_date" value={formData.join_date} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                      <option value="Terminated">Terminated</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">Bank Details (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                    <input name="bank_account_no" value={formData.bank_account_no} onChange={handleInputChange} className="w-full p-2 border rounded-lg outline-none" placeholder="1234567890" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                    <input name="bank_ifsc" value={formData.bank_ifsc} onChange={handleInputChange} className="w-full p-2 border rounded-lg outline-none" placeholder="BANK0001234" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors">
                  {isEditing ? 'Update Employee' : 'Create Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
