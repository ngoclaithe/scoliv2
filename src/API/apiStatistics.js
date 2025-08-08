import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://192.168.31.186:5000/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const StatisticsAPI = {
    getTotalAccessCodes: async () => {
        try {
            const response = await api.get('/statistics/access-codes/count');
            return response.data;
        } catch (error) {
            throw StatisticsAPI.handleError(error);
        }
    },

    getTotalUsers: async () => {
        try {
            const response = await api.get(`/statistics/users/count`);
            return response.data;
        } catch (error) {
            throw StatisticsAPI.handleError(error);
        }
    },
    getTotalPaymentRequests: async () => {
        try {
            const response = await api.get('/statistics/payment-requests/count');
            return response.data;
        } catch (error) {
            throw StatisticsAPI.handleError(error);
        }
    },

    getActiveRoomSessionsCount: async () => {
        try {
            const response = await api.get(`/statistics/room-sessions/active/count`);
            return response.data;
        } catch (error) {
            throw StatisticsAPI.handleError(error);
        }
    },

    handleError: (error) => {
        if (error.response) {
            const { status, data } = error.response;
            const message = data?.message || 'An error occurred';
            return new Error(`API Error (${status}): ${message}`);
        } else if (error.request) {
            return new Error('No response from server. Please check your connection.');
        } else {
            return new Error(`Request error: ${error.message}`);
        }
    },
};

export default StatisticsAPI;
