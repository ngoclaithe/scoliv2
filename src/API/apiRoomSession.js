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

const RoomSessionAPI = {
  getRoomSessions: async () => {
    try {
      const response = await api.get('/room-sessions');
      return response.data;
    } catch (error) {
      throw RoomSessionAPI.handleError(error);
    }
  },

  getRoomSessionById: async (id) => {
    try {
      const response = await api.get(`/room-sessions/${id}`);
      return response.data;
    } catch (error) {
      throw RoomSessionAPI.handleError(error);
    }
  },

  getRoomSessionsByAccessCode: async (code) => {
    try {
      const response = await api.get(`/room-sessions/access-code/${code}`);
      return response.data;
    } catch (error) {
      throw RoomSessionAPI.handleError(error);
    }
  },
  getRoomSessionById: async (id) => {
    try {
      const response = await api.get(`/room-sessions/${id}`);
      return response.data;
    } catch (error) {
      throw RoomSessionAPI.handleError(error);
    }
  },
  deleteRoomSessionById: async (id) => {
    try {
      const response = await api.delete(`/room-sessions/${id}`);
      return response.data;
    } catch (error) {
      throw RoomSessionAPI.handleError(error);
    }
  },
  disconnectClient: async (idClient) => {
    try {
      const response = await api.post(`/room-sessions/disconnect-client/${idClient}`);
      return response.data;
    } catch (error) {
      throw RoomSessionAPI.handleError(error);
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

export default RoomSessionAPI;
