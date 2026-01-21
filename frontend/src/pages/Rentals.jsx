import { useState, useEffect } from 'react';
import { rentalAPI } from '../api/rental.api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';

const Rentals = () => {
    const [rentals, setRentals] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user, canManageCars } = useAuth();

    useEffect(() => {
        fetchRentals();
    }, []);

    const fetchRentals = async () => {
        try {
            const response = canManageCars()
                ? await rentalAPI.getAll()
                : await rentalAPI.getMyRentals();
            setRentals(response.data);
        } catch (error) {
            toast.error('Erreur lors du chargement des locations');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (rentalId, newStatus) => {
        try {
            await rentalAPI.updateStatus(rentalId, newStatus);
            toast.success(`Statut mis à jour : ${newStatus}`);
            fetchRentals();
        } catch (error) {
            toast.error('Erreur lors de la mise à jour du statut');
        }
    };

    const downloadInvoice = async (rentalId) => {
        const toastId = toast.loading('Préparation de votre facture...');
        try {
            const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/invoices/${rentalId}`;
            const token = localStorage.getItem('accessToken');

            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Échec du téléchargement');

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = `facture-${rentalId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            toast.success('Facture téléchargée avec succès !', { id: toastId });
        } catch (error) {
            toast.error('Impossible de générer la facture. Veuillez réessayer plus tard.', { id: toastId });
        }
    };

    if (loading) return <Loader fullScreen />;

    return (
        <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        {canManageCars() ? 'Gestion des Locations' : 'Mon Historique de Location'}
                    </h1>
                    <p className="text-lg text-gray-500 mt-2">
                        {canManageCars()
                            ? 'Gérez toutes les réservations du système et mettez à jour leurs statuts.'
                            : 'Consultez vos réservations passées et à venir, et téléchargez vos factures.'}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500 tracking-wider">
                            <tr>
                                {canManageCars() && <th className="px-6 py-5 text-left">Client</th>}
                                <th className="px-8 py-5 text-left">Détails du Véhicule</th>
                                <th className="px-6 py-5 text-left">Période</th>
                                <th className="px-6 py-5 text-left">Montant Total</th>
                                <th className="px-6 py-5 text-left">Statut</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100 text-sm">
                            {rentals.map((rental) => (
                                <tr key={rental.id} className="hover:bg-gray-50 transition-colors">
                                    {canManageCars() && (
                                        <td className="px-6 py-6">
                                            <div className="font-bold text-gray-900">{rental.user_name}</div>
                                            <div className="text-gray-400 text-xs">{rental.user_email}</div>
                                        </td>
                                    )}
                                    <td className="px-8 py-6">
                                        <div className="flex items-center">
                                            <div className="h-12 w-16 flex-shrink-0">
                                                <img className="h-full w-full object-cover rounded-lg shadow-sm" src={rental.image_url} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="font-bold text-gray-900 text-base">{rental.brand} {rental.model}</div>
                                                <div className="text-gray-400">{rental.year}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                {format(new Date(rental.start_date), 'dd MMM yyyy', { locale: fr })}
                                            </span>
                                            <span className="text-gray-400 text-xs mt-1">au {format(new Date(rental.end_date), 'dd MMM yyyy', { locale: fr })}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-bold text-lg text-primary-600">
                                        €{Number(rental.total_price).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${rental.status === 'Active' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                rental.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                    'bg-red-50 text-red-600 border border-red-100'
                                            }`}>
                                            {rental.status === 'Active' ? 'Actif' : rental.status === 'Completed' ? 'Terminé' : 'Annulé'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2">
                                            {canManageCars() && rental.status === 'Active' && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(rental.id, 'Completed')}
                                                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-all"
                                                    >
                                                        Terminer
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(rental.id, 'Cancelled')}
                                                        className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-all"
                                                    >
                                                        Annuler
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => downloadInvoice(rental.id)}
                                                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-bold py-2 px-4 rounded-xl hover:bg-primary-50 transition-all border border-transparent hover:border-primary-100"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
                                                Facture
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {rentals.length === 0 && (
                    <div className="text-center py-24 bg-gray-50/50">
                        <div className="text-6xl mb-4">🚗</div>
                        <h3 className="text-xl font-bold text-gray-900">Aucune location trouvée</h3>
                        <p className="text-gray-500 mt-2">
                            {canManageCars() ? "Il n'y a pas encore de réservations dans le système." : "Vous n'avez pas encore de réservations. Réservez votre première voiture dès maintenant !"}
                        </p>
                        {!canManageCars() && (
                            <Link to="/cars" className="mt-8 inline-block bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all">Explorer la Flotte</Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rentals;
