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
    const [showManageModal, setShowManageModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [rentalDates, setRentalDates] = useState({ start_date: '', end_date: '' });
    const [carForm, setCarForm] = useState({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price_per_day: '',
        image_url: '',
        status: 'Available'
    });

    const { canManageCars, isAdmin } = useAuth();

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const response = await carAPI.getAll();
            setCars(response.data);
        } catch (error) {
            toast.error('Erreur lors du chargement des véhicules');
        } finally {
            setLoading(false);
        }
    };

    const handleRentCar = (car) => {
        setSelectedCar(car);
        setShowRentalModal(true);
    };

    const handleManageCar = (car = null) => {
        if (car) {
            setIsEditing(true);
            setSelectedCar(car);
            setCarForm({
                brand: car.brand,
                model: car.model,
                year: car.year,
                price_per_day: car.price_per_day,
                image_url: car.image_url,
                status: car.status
            });
        } else {
            setIsEditing(false);
            setCarForm({
                brand: '',
                model: '',
                year: new Date().getFullYear(),
                price_per_day: '',
                image_url: '',
                status: 'Available'
            });
        }
        setShowManageModal(true);
    };

    const submitRental = async (e) => {
        e.preventDefault();
        try {
            await rentalAPI.create({
                car_id: selectedCar.id,
                ...rentalDates
            });
            toast.success('Réservation confirmée ! Consultez "Mes Locations" pour plus de détails.');
            setShowRentalModal(false);
            setRentalDates({ start_date: '', end_date: '' });
            fetchCars();
        } catch (error) {
            const message = error.response?.status === 409
                ? 'Ce véhicule est déjà réservé pour les dates sélectionnées.'
                : (error.response?.data?.message || 'Erreur lors de la réservation');
            toast.error(message);
        }
    };

    const submitCarForm = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await carAPI.update(selectedCar.id, carForm);
                toast.success('Véhicule mis à jour avec succès');
            } else {
                await carAPI.create(carForm);
                toast.success('Véhicule ajouté avec succès');
            }
            setShowManageModal(false);
            fetchCars();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'enregistrement');
        }
    };

    const handleDeleteCar = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) return;
        try {
            await carAPI.delete(id);
            toast.success('Véhicule supprimé');
            fetchCars();
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Notre Flotte Premium</h1>
                    <p className="text-lg text-gray-600 mt-3">Sélectionnez le véhicule idéal pour votre voyage. Vérifiez la disponibilité et réservez instantanément.</p>
                </div>
                {canManageCars() && (
                    <button
                        onClick={() => handleManageCar()}
                        className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-primary-200 transition-all flex items-center gap-2"
                    >
                        <span>+ Ajouter un Véhicule</span>
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cars.map((car) => (
                    <div key={car.id} className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover flex flex-col">
                        <div className="relative h-56 overflow-hidden">
                            <img
                                src={car.image_url}
                                alt={`${car.brand} ${car.model}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${car.status === 'Available' ? 'bg-green-500 text-white' :
                                    car.status === 'Rented' ? 'bg-blue-500 text-white' :
                                        'bg-orange-500 text-white'
                                    }`}>
                                    {car.status === 'Available' ? 'Disponible' : car.status === 'Rented' ? 'Loué' : 'Maintenance'}
                                </span>
                            </div>

                            {canManageCars() && (
                                <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                                    <button
                                        onClick={() => handleManageCar(car)}
                                        className="flex-1 bg-white/90 backdrop-blur-md text-gray-900 py-2 rounded-lg font-bold text-xs shadow-lg hover:bg-white"
                                    >
                                        Modifier
                                    </button>
                                    {isAdmin() && (
                                        <button
                                            onClick={() => handleDeleteCar(car.id)}
                                            className="bg-red-500/90 backdrop-blur-md text-white px-3 rounded-lg font-bold text-xs shadow-lg hover:bg-red-600"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {car.brand} <span className="text-primary-600">{car.model}</span>
                                </h3>
                                <span className="text-sm font-medium text-gray-400">{car.year}</span>
                            </div>

                            <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm">
                                <span className="flex items-center gap-1">📍 Paris, France</span>
                                <span className="flex items-center gap-1">🛋️ 5 Sièges</span>
                            </div>

                            <div className="mt-8 flex items-center justify-between border-t border-gray-50 pt-6">
                                <div>
                                    <span className="text-3xl font-extrabold text-gray-900">€{car.price_per_day}</span>
                                    <span className="text-sm text-gray-500 font-medium ml-1">/ jour</span>
                                </div>
                                <button
                                    onClick={() => handleRentCar(car)}
                                    disabled={car.status === 'Maintenance'}
                                    className={`px-6 py-2.5 rounded-xl font-bold transition-all ${car.status === 'Maintenance'
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-primary-100'
                                        }`}
                                >
                                    {car.status === 'Maintenance' ? 'En Atelier' : 'Réserver'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Réservation */}
            <Modal
                isOpen={showRentalModal}
                onClose={() => setShowRentalModal(false)}
                title={`Réservation Sécurisée : ${selectedCar?.brand} ${selectedCar?.model}`}
            >
                <div className="mb-6 p-4 bg-primary-50 rounded-xl flex items-center gap-4 border border-primary-100">
                    <img src={selectedCar?.image_url} alt="Car" className="w-20 h-14 object-cover rounded-lg shadow-sm" />
                    <div>
                        <p className="font-bold text-gray-900">{selectedCar?.brand} {selectedCar?.model}</p>
                        <p className="text-sm text-primary-600 font-semibold">€{selectedCar?.price_per_day} par jour</p>
                    </div>
                </div>

                <form onSubmit={submitRental} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Date de Prise en Charge</label>
                            <input
                                type="date"
                                required
                                min={new Date().toISOString().split('T')[0]}
                                value={rentalDates.start_date}
                                onChange={(e) => setRentalDates({ ...rentalDates, start_date: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Date de Retour</label>
                            <input
                                type="date"
                                required
                                min={rentalDates.start_date || new Date().toISOString().split('T')[0]}
                                value={rentalDates.end_date}
                                onChange={(e) => setRentalDates({ ...rentalDates, end_date: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Tarif de Location de Base</span>
                            <span>€{selectedCar?.price_per_day} x jours</span>
                        </div>
                        <div className="flex justify-between mt-2 font-bold text-lg text-gray-900 border-t border-gray-200 pt-2">
                            <span>Total Estimé</span>
                            <span className="text-primary-600">
                                {selectedCar && rentalDates.start_date && rentalDates.end_date
                                    ? `€${(Math.max(1, Math.ceil((new Date(rentalDates.end_date) - new Date(rentalDates.start_date)) / (1000 * 60 * 60 * 24))) * selectedCar.price_per_day).toLocaleString()}`
                                    : '---'}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 shadow-lg hover:shadow-primary-100 transition-all flex items-center justify-center gap-2"
                    >
                        <span>Confirmer la Réservation</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </form>
            </Modal>

            {/* Modal de Gestion (Ajout/Modif) */}
            <Modal
                isOpen={showManageModal}
                onClose={() => setShowManageModal(false)}
                title={isEditing ? 'Modifier le Véhicule' : 'Ajouter un Nouveau Véhicule'}
            >
                <form onSubmit={submitCarForm} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Marque</label>
                            <input
                                type="text"
                                required
                                value={carForm.brand}
                                onChange={(e) => setCarForm({ ...carForm, brand: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="ex: Tesla"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Modèle</label>
                            <input
                                type="text"
                                required
                                value={carForm.model}
                                onChange={(e) => setCarForm({ ...carForm, model: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="ex: Model 3"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Année</label>
                            <input
                                type="number"
                                required
                                value={carForm.year}
                                onChange={(e) => setCarForm({ ...carForm, year: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Prix / Jour (€)</label>
                            <input
                                type="number"
                                required
                                value={carForm.price_per_day}
                                onChange={(e) => setCarForm({ ...carForm, price_per_day: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="75"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">URL de l'image</label>
                        <input
                            type="url"
                            required
                            value={carForm.image_url}
                            onChange={(e) => setCarForm({ ...carForm, image_url: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="https://images.unsplash.com/..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Statut</label>
                        <select
                            value={carForm.status}
                            onChange={(e) => setCarForm({ ...carForm, status: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="Available">Disponible</option>
                            <option value="Rented">Loué</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 shadow-lg transition-all"
                        >
                            {isEditing ? 'Enregistrer les modifications' : 'Ajouter au catalogue'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Cars;
