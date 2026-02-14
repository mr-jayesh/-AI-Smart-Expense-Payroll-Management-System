"use client";
import React, { useEffect, useState } from 'react';
import { AlertTriangle, Bell, CheckCircle, Info } from 'lucide-react';

export default function AlertsPage() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/alerts');
            if (response.ok) {
                const data = await response.json();
                setAlerts(data);
            }
        } catch (error) {
            console.error('Failed to fetch alerts', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'Critical': return 'text-red-600 bg-red-100 border-red-200';
            case 'High': return 'text-orange-600 bg-orange-100 border-orange-200';
            case 'Medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
            default: return 'text-blue-600 bg-blue-100 border-blue-200';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <AlertTriangle className="w-8 h-8 text-yellow-600" />
                    System Alerts
                </h2>
                <button className="text-sm text-blue-600 hover:underline">Mark all as read</button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="p-8 text-center text-gray-500 bg-white rounded-xl border">Loading alerts...</div>
                ) : alerts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 bg-white rounded-xl border">No active alerts.</div>
                ) : (
                    alerts.map((alert) => (
                        <div key={alert.id} className={`p-4 rounded-xl border flex gap-4 ${getSeverityColor(alert.severity)}`}>
                            <div className="mt-1">
                                {alert.severity === 'Critical' ? <AlertTriangle className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold uppercase text-xs tracking-wider">{alert.type}</span>
                                    <span className="text-xs opacity-70">{new Date(alert.created_at).toLocaleString()}</span>
                                </div>
                                <p className="font-medium">{alert.message}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
