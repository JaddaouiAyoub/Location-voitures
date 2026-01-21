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
            toast.error('Failed to load car locations');
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-96">Loading map...</div>;
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Car Locations</h1>
                <p className="text-gray-600 mt-2">Real-time GPS tracking of our fleet</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
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
                                    <h3 className="font-bold">{car.brand} {car.model}</h3>
                                    <p className="text-sm text-gray-600">{car.year}</p>
                                    <p className="text-sm font-semibold text-primary-600">€{car.price_per_day}/day</p>
                                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${car.status === 'Available' ? 'bg-green-100 text-green-800' :
                                            car.status === 'Rented' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {car.status}
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
