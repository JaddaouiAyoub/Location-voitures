import { useState, useEffect } from 'react';
import { dashboardAPI } from '../api/dashboard.api';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await dashboardAPI.getStatistics();
            setStats(response.data);
        } catch (error) {
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader fullScreen />;

    const carStatusData = {
        labels: ['Available', 'Rented', 'Maintenance'],
        datasets: [{
            data: [
                stats?.cars.statusDistribution.Available || 0,
                stats?.cars.statusDistribution.Rented || 0,
                stats?.cars.statusDistribution.Maintenance || 0
            ],
            backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
        }]
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="text-sm text-gray-600 mb-2">Total Cars</div>
                    <div className="text-3xl font-bold text-gray-900">{stats?.cars.total}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="text-sm text-gray-600 mb-2">Available Cars</div>
                    <div className="text-3xl font-bold text-green-600">{stats?.cars.available}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="text-sm text-gray-600 mb-2">Active Rentals</div>
                    <div className="text-3xl font-bold text-blue-600">{stats?.rentals.active}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <div className="text-sm text-gray-600 mb-2">Total Revenue</div>
                    <div className="text-3xl font-bold text-primary-600">€{stats?.rentals.revenue.toFixed(2)}</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Car Status Distribution</h3>
                    <Doughnut data={carStatusData} />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Rentals</h3>
                <div className="space-y-3">
                    {stats?.recentActivity.slice(0, 5).map((rental) => (
                        <div key={rental.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                                <div className="font-medium">{rental.user_name}</div>
                                <div className="text-sm text-gray-600">{rental.brand} {rental.model}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold text-primary-600">€{rental.total_price}</div>
                                <div className="text-xs text-gray-500">{rental.status}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
