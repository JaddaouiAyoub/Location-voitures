import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { carAPI } from '../api/car.api';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CarMap = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCarLocations();
        const interval = setInterval(fetchCarLocations, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const fetchCarLocations = async () => {
        try {
            const response = await carAPI.getLocations();
            setCars(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Erreur lors du chargement des positions GPS');
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96">Chargement de la carte...</div>;
    }

    return (
        <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Suivi de la Flotte</h1>
                <p className="text-gray-600 mt-2">Position GPS en temps réel de nos véhicules</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden" style={{ height: '700px' }}>
                <MapContainer
                    center={[48.8566, 2.3522]} // Paris center
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {cars.map((car) => (
                        <Marker key={car.id} position={[car.latitude, car.longitude]}>
                            <Popup>
                                <div className="p-2">
                                    <h3 className="font-bold text-gray-900">{car.brand} {car.model}</h3>
                                    <p className="text-xs text-gray-500">{car.year}</p>
                                    <p className="text-sm font-bold text-primary-600 mt-1">€{car.price_per_day} / jour</p>
                                    <span className={`inline-block mt-3 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${car.status === 'Available' ? 'bg-green-100 text-green-800' :
                                        car.status === 'Rented' ? 'bg-blue-100 text-blue-800' :
                                            'bg-orange-100 text-orange-800'
                                        }`}>
                                        {car.status === 'Available' ? 'Disponible' : car.status === 'Rented' ? 'Loué' : 'Maintenance'}
                                    </span>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default CarMap;
