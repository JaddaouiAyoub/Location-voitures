import { useState, useEffect } from 'react';
import { carAPI } from '../api/car.api';
import { rentalAPI } from '../api/rental.api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import Modal from '../components/Modal';

const Cars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCar, setSelectedCar] = useState(null);
    const [showRentalModal, setShowRentalModal] = useState(false);
    const [rentalDates, setRentalDates] = useState({ start_date: '', end_date: '' });
    const { canManageCars } = useAuth();

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await carAPI.getAll();
            setCars(response.data);
        } catch (error) {
            toast.error('Failed to load cars');
        } finally {
            setLoading(false);
        }
    };

    const handleRentCar = (car) => {
        setSelectedCar(car);
        setShowRentalModal(true);
    };

    const submitRental = async (e) => {
        e.preventDefault();
        try {
            await rentalAPI.create({
                car_id: selectedCar.id,
                ...rentalDates
            });
            toast.success('Rental created successfully!');
            setShowRentalModal(false);
            fetchCars();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create rental');
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Available Cars</h1>
                <p className="text-gray-600 mt-2">Browse and rent our premium vehicles</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cars.map((car) => (
                    <div key={car.id} className="bg-white rounded-xl shadow-md overflow-hidden card-hover">
                        <img
                            src={car.image_url}
                            alt={`${car.brand} ${car.model}`}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {car.brand} {car.model}
                            </h3>
                            <p className="text-gray-600 text-sm">{car.year}</p>

                            <div className="mt-4 flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-primary-600">€{car.price_per_day}</p>
                                    <p className="text-sm text-gray-500">per day</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${car.status === 'Available' ? 'bg-green-100 text-green-800' :
                                        car.status === 'Rented' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {car.status}
                                </span>
                            </div>

                            {car.status === 'Available' && (
                                <button
                                    onClick={() => handleRentCar(car)}
                                    className="mt-4 w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                                >
                                    Rent Now
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Rental Modal */}
            <Modal
                isOpen={showRentalModal}
                onClose={() => setShowRentalModal(false)}
                title={`Rent ${selectedCar?.brand} ${selectedCar?.model}`}
            >
                <form onSubmit={submitRental} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            value={rentalDates.start_date}
                            onChange={(e) => setRentalDates({ ...rentalDates, start_date: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input
                            type="date"
                            required
                            min={rentalDates.start_date || new Date().toISOString().split('T')[0]}
                            value={rentalDates.end_date}
                            onChange={(e) => setRentalDates({ ...rentalDates, end_date: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700"
                    >
                        Confirm Rental
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Cars;
