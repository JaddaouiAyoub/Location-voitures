import axios from './axios';

/**
 * Dashboard API
 */
export const dashboardAPI = {
    // Get dashboard statistics (ADMIN only)
    getStatistics: async () => {
        const response = await axios.get('/dashboard/stats');
        return response.data;
    },
};
