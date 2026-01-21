import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout, isAdmin, canManageCars } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { name: 'Dashboard', path: '/', icon: '🏠', roles: ['ADMIN'] },
        { name: 'Cars', path: '/cars', icon: '🚗', roles: ['ADMIN', 'AGENT', 'CLIENT'] },
        { name: 'Map', path: '/map', icon: '🗺️', roles: ['ADMIN', 'AGENT', 'CLIENT'] },
        { name: 'Rentals', path: '/rentals', icon: '📋', roles: ['ADMIN', 'AGENT', 'CLIENT'] },
        { name: 'Profile', path: '/profile', icon: '👤', roles: ['ADMIN', 'AGENT', 'CLIENT'] },
    ];

    const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
                <div className="p-6">
                    <h1 className={`font-bold text-primary-600 ${sidebarOpen ? 'text-2xl' : 'text-lg'}`}>
                        {sidebarOpen ? '🚗 CarRental' : '🚗'}
                    </h1>
                </div>

                <nav className="px-4 space-y-2">
                    {filteredMenuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                            <span className="text-xl">{item.icon}</span>
                            {sidebarOpen && <span className="font-medium">{item.name}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="absolute bottom-0 w-full p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <span className="text-xl">🚪</span>
                        {sidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="font-semibold text-gray-900">{user?.name}</p>
                                <p className="text-sm text-gray-500">{user?.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
