import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/auth.api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                const response = await authAPI.getProfile();
                setUser(response.data);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.clear();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { user, accessToken, refreshToken } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setUser(user);

            toast.success('Login successful!');
            return user;
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { user, accessToken, refreshToken } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setUser(user);

            toast.success('Registration successful!');
            return user;
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            throw error;
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        toast.success('Logged out successfully');
    };

    const updateUserProfile = async (profileData) => {
        try {
            const response = await authAPI.updateProfile(profileData);
            setUser(response.data);
            toast.success('Profile updated successfully!');
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || 'Profile update failed';
            toast.error(message);
            throw error;
        }
    };

    const isAdmin = () => user?.role === 'ADMIN';
    const isAgent = () => user?.role === 'AGENT';
    const isClient = () => user?.role === 'CLIENT';
    const canManageCars = () => user?.role === 'ADMIN' || user?.role === 'AGENT';

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        isAdmin,
        isAgent,
        isClient,
        canManageCars,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
