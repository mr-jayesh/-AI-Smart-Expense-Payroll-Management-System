import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

// Dashboard route group layout — wraps all dashboard pages with sidebar + header
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
