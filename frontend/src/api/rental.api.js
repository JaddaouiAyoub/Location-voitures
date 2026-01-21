import axios from './axios';

/**
 * Rental API
 */
export const rentalAPI = {
    // Create new rental
    create: async (rentalData) => {
        const response = await axios.post('/rentals', rentalData);
        return response.data;
    },

    // Get all rentals (admin sees all, users see their own)
    getAll: async (status = null) => {
        const params = status ? `?status=${status}` : '';
        const response = await axios.get(`/rentals${params}`);
        return response.data;
    },

    // Get rental by ID
    getById: async (id) => {
        const response = await axios.get(`/rentals/${id}`);
        return response.data;
    },

    // Update rental status
    updateStatus: async (id, status) => {
        const response = await axios.put(`/rentals/${id}/status`, { status });
        return response.data;
    },

    // Get user's rental history
    getMyRentals: async () => {
        const response = await axios.get('/rentals/my/history');
        return response.data;
    },
};
