import { Bell, Search } from 'lucide-react';

const Header = () => {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
            <div className="flex items-center">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="w-5 h-5 text-gray-400" />
                    </span>
                    <input
                        className="w-64 pl-10 pr-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Search..."
                    />
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
