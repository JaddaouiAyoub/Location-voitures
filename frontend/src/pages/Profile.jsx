import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/auth.api';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const [editing, setEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.phone || ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: ''
    });

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await updateUserProfile(profileData);
            setEditing(false);
        } catch (error) {
            // Error handled in context
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            await authAPI.changePassword(passwordData);
            toast.success('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    return (
        <div className="fade-in max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">Paramètres du Profil</h1>

            {/* Profile Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Informations Personnelles</h2>
                        <p className="text-sm text-gray-500 mt-1">Mettez à jour vos coordonnées et détails de compte.</p>
                    </div>
                    <button
                        onClick={() => setEditing(!editing)}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${editing ? 'text-gray-500 hover:text-gray-700 bg-gray-50' : 'text-primary-600 hover:text-primary-700 bg-primary-50'
                            }`}
                    >
                        {editing ? 'Annuler' : 'Modifier'}
                    </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Nom Complet</label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                disabled={!editing}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Rôle</label>
                            <input
                                type="text"
                                value={user?.role === 'ADMIN' ? 'Administrateur' : user?.role === 'AGENT' ? 'Agent' : 'Client'}
                                disabled
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Adresse Email</label>
                        <input
                            type="email"
                            value={user?.email}
                            disabled
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Téléphone</label>
                        <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            disabled={!editing}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none disabled:bg-gray-50 disabled:text-gray-500"
                            placeholder="+33 6 00 00 00 00"
                        />
                    </div>

                    {editing && (
                        <button
                            type="submit"
                            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 shadow-lg hover:shadow-primary-100 transition-all"
                        >
                            Enregistrer les Modifications
                        </button>
                    )}
                </form>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900">Sécurité</h2>
                    <p className="text-sm text-gray-500 mt-1">Changez votre mot de passe pour sécuriser votre compte.</p>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe actuel</label>
                        <input
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Nouveau mot de passe</label>
                        <input
                            type="password"
                            minLength={6}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-2">Le mot de passe doit contenir au moins 6 caractères.</p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black shadow-lg transition-all"
                    >
                        Changer le mot de passe
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
