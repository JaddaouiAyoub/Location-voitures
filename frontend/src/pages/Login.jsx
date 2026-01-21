import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData);
            navigate('/');
        } catch (error) {
            // Error handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
            style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Overlay sombre avec flou */}
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>

            <div className="max-w-md w-full p-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl relative z-10 border border-white/20 fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Bon retour !</h1>
                    <p className="text-gray-600">Connectez-vous pour gérer vos locations</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Adresse Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Mot de passe</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 shadow-lg hover:shadow-primary-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <span>Se connecter</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-600">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="text-primary-600 font-bold hover:underline">
                        Créez-en un ici
                    </Link>
                </p>

                <div className="mt-8 p-4 bg-primary-50 rounded-xl border border-primary-100">
                    <p className="text-xs font-bold text-primary-900 mb-2 uppercase tracking-widest">Comptes Démo :</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <p className="text-[10px] text-primary-700"><span className="font-bold">Admin:</span> admin@carrental.com</p>
                        <p className="text-[10px] text-primary-700"><span className="font-bold">Agent:</span> agent@carrental.com</p>
                        <p className="text-[10px] text-primary-700"><span className="font-bold">Client:</span> client@carrental.com</p>
                        <p className="text-[10px] text-primary-800 font-bold italic">Pass: password123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
