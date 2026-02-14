"use client";
import React from 'react';
import { Settings, User, Bell, Shield, Database, Globe } from 'lucide-react';

export default function SettingsPage() {
    const sections = [
        { name: 'Profile Settings', icon: User, desc: 'Manage your account details and preferences' },
        { name: 'Notifications', icon: Bell, desc: 'Configure how you receive system alerts' },
        { name: 'Security', icon: Shield, desc: 'Update passwords and two-factor authentication' },
        { name: 'Database Config', icon: Database, desc: 'Manage database connection and backup schedules' },
        { name: 'Regional', icon: Globe, desc: 'Set currency, timezone, and language' },
    ];

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Settings className="w-8 h-8 text-gray-600" />
                    Settings
                </h2>
                <p className="text-gray-500 mt-1">Configure your AI Smart Payroll & Expense System</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y">
                {sections.map((section) => (
                    <div key={section.name} className="p-6 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                <section.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">{section.name}</h3>
                                <p className="text-sm text-gray-500">{section.desc}</p>
                            </div>
                        </div>
                        <button className="text-gray-400 group-hover:text-blue-600">
                            <Globe className="w-5 h-5 rotate-90" /> {/* Just using as an arrow icon for demo */}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
                <Info className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-700">
                    Settings are currently in <strong>Demo Mode</strong>. Changes made here will not be persisted to the database.
                </p>
            </div>
        </div>
    );
}

const Info = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)
