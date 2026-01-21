import axios from './axios';

/**
 * Authentication API
 */
export const authAPI = {
    // Register new user
    register: async (userData) => {
        const response = await axios.post('/auth/register', userData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await axios.post('/auth/login', credentials);
        return response.data;
    },

    // Refresh access token
    refreshToken: async (refreshToken) => {
        const response = await axios.post('/auth/refresh', { refreshToken });
        return response.data;
    },

    // Get current user profile
    getProfile: async () => {
        const response = await axios.get('/auth/me');
        return response.data;
    },

    // Update user profile
    updateProfile: async (profileData) => {
        const response = await axios.put('/auth/profile', profileData);
        return response.data;
    },

    // Change password
    changePassword: async (passwordData) => {
        const response = await axios.put('/auth/password', passwordData);
        return response.data;
    },
};
