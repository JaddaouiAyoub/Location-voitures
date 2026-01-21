import axios from './axios';

/**
 * Car API
 */
export const carAPI = {
    // Get all cars with optional filters
    getAll: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.brand) params.append('brand', filters.brand);
        if (filters.status) params.append('status', filters.status);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.available) params.append('available', filters.available);

        const response = await axios.get(`/cars?${params.toString()}`);
        return response.data;
    },

    // Get car by ID
    getById: async (id) => {
        const response = await axios.get(`/cars/${id}`);
        return response.data;
    },

    // Create new car (ADMIN/AGENT only)
    create: async (carData) => {
        const response = await axios.post('/cars', carData);
        return response.data;
    },

    // Update car (ADMIN/AGENT only)
    update: async (id, carData) => {
        const response = await axios.put(`/cars/${id}`, carData);
        return response.data;
    },

    // Delete car (ADMIN only)
    delete: async (id) => {
        const response = await axios.delete(`/cars/${id}`);
        return response.data;
    },

    // Get cars with GPS locations for map
    getLocations: async () => {
        const response = await axios.get('/cars/map/locations');
        return response.data;
    },

    // Check car availability
    checkAvailability: async (id, dates) => {
        const response = await axios.post(`/cars/${id}/check-availability`, dates);
        return response.data;
    },
};
