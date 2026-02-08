// Database Service - Handles all database operations via backend API
import axios from 'axios';

// Configure API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== USER OPERATIONS =====
export const userService = {
  getUser: (userId) => api.get(`/users/${userId}`),
  getUserProfile: () => api.get('/users/profile'),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  getAllUsers: (page = 1, limit = 10) =>
    api.get('/users', { params: { page, limit } }),
};

// ===== ASTEROID DETAIL OPERATIONS =====
export const asteroidDetailService = {
  getAsteroid: (asteroidId) => api.get(`/asteroids/${asteroidId}`),
  getAllAsteroids: (page = 1, limit = 20, filters = {}) =>
    api.get('/asteroids', { params: { page, limit, ...filters } }),
  getAsteroidByNasaId: (nasaId) =>
    api.get(`/asteroids/nasa/${nasaId}`),
  createAsteroid: (asteroidData) => api.post('/asteroids', asteroidData),
  updateAsteroid: (asteroidId, asteroidData) =>
    api.put(`/asteroids/${asteroidId}`, asteroidData),
  deleteAsteroid: (asteroidId) => api.delete(`/asteroids/${asteroidId}`),
  searchAsteroids: (query) =>
    api.get('/asteroids/search', { params: { q: query } }),
  getHighRiskAsteroids: (limit = 10) =>
    api.get('/asteroids/filter/high-risk', { params: { limit } }),
  getCloseApproaching: (limit = 10) =>
    api.get('/asteroids/filter/close-approaching', { params: { limit } }),
};

// ===== WATCHLIST OPERATIONS =====
export const watchlistService = {
  getWatchlist: (userId, page = 1, limit = 20) =>
    api.get(`/users/${userId}/watchlist`, { params: { page, limit } }),
  getWatchlistItem: (watchlistId) =>
    api.get(`/watchlist/${watchlistId}`),
  addToWatchlist: (userId, asteroidId, notes = '') =>
    api.post(`/users/${userId}/watchlist`, {
      asteroid_id: asteroidId,
      notes,
    }),
  removeFromWatchlist: (watchlistId) =>
    api.delete(`/watchlist/${watchlistId}`),
  updateWatchlistNote: (watchlistId, notes) =>
    api.put(`/watchlist/${watchlistId}`, { notes }),
  isInWatchlist: (userId, asteroidId) =>
    api.get(`/users/${userId}/watchlist/check/${asteroidId}`),
  getAllWatchlistItems: () =>
    api.get('/watchlist'),
};

// ===== ALERT OPERATIONS =====
export const alertService = {
  getUserAlerts: (userId, page = 1, limit = 20, unreadOnly = false) =>
    api.get(`/users/${userId}/alerts`, {
      params: { page, limit, unread_only: unreadOnly },
    }),
  getAlert: (alertId) =>
    api.get(`/alerts/${alertId}`),
  createAlert: (userId, asteroidId, alertType, message, priority = 'medium') =>
    api.post('/alerts', {
      user_id: userId,
      asteroid_id: asteroidId,
      alert_type: alertType,
      message,
      priority,
    }),
  markAsRead: (alertId) =>
    api.put(`/alerts/${alertId}/read`, {}),
  markAllAsRead: (userId) =>
    api.put(`/users/${userId}/alerts/read-all`, {}),
  deleteAlert: (alertId) =>
    api.delete(`/alerts/${alertId}`),
  createCustomAlert: (userId, asteroidId, message, priority = 'medium') =>
    api.post('/alerts', {
      user_id: userId,
      asteroid_id: asteroidId,
      alert_type: 'custom',
      message,
      priority,
    }),
  getUnreadCount: (userId) =>
    api.get(`/users/${userId}/alerts/unread-count`),
};

// ===== COMBINED/UTILITY OPERATIONS =====
export const databaseService = {
  // Sync nearby asteroids for a user
  syncUserAsteroids: (userId) =>
    api.post(`/users/${userId}/sync-asteroids`, {}),

  // Get dashboard data for user
  getDashboard: (userId) =>
    api.get(`/users/${userId}/dashboard`, {}),

  // Bulk operations
  bulkCreateAsteroids: (asteroidsData) =>
    api.post('/asteroids/bulk', { asteroids: asteroidsData }),

  // Health check
  healthCheck: () =>
    api.get('/health'),

  // Error handler middleware
  handleError: (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('API Error:', error.response.status, error.response.data);
      return {
        status: error.response.status,
        message: error.response.data?.message || 'An error occurred',
        data: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response
      console.error('No response:', error.request);
      return {
        status: 0,
        message: 'No response from server. Check backend connection.',
        data: null,
      };
    } else {
      // Error in request setup
      console.error('Error:', error.message);
      return {
        status: -1,
        message: error.message,
        data: null,
      };
    }
  },
};

export default api;
