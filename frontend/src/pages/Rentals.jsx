import { useState, useEffect } from 'react';
import { rentalAPI } from '../api/rental.api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Rentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRentals();
    }, []);

    const fetchRentals = async () => {
        try {
            const response = await rentalAPI.getMyRentals();
            setRentals(response.data);
        } catch (error) {
            toast.error('Failed to load rentals');
        } finally {
            setLoading(false);
        }
    };

    const downloadInvoice = (rentalId) => {
        const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/invoices/${rentalId}`;
        const token = localStorage.getItem('accessToken');

        fetch(url, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `invoice-${rentalId}.pdf`;
                a.click();
                toast.success('Invoice downloaded!');
            })
            .catch(() => toast.error('Failed to download invoice'));
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Rentals</h1>
                <p className="text-gray-600 mt-2">View your rental history and invoices</p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Car</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rentals.map((rental) => (
                            <tr key={rental.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{rental.brand} {rental.model}</div>
                                    <div className="text-sm text-gray-500">{rental.year}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {format(new Date(rental.start_date), 'MMM dd, yyyy')} - {format(new Date(rental.end_date), 'MMM dd, yyyy')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                    €{rental.total_price}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${rental.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                                            rental.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {rental.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => downloadInvoice(rental.id)}
                                        className="text-primary-600 hover:text-primary-700 font-medium"
                                    >
                                        Download Invoice
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rentals.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No rentals found. Start by renting a car!
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rentals;
