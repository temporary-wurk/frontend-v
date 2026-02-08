// Authentication Service
import api from './database';

export const authService = {
  // Login user
  login: (email, password) =>
    api.post('/auth/login', { email, password }).then((response) => {
      if (response.data.data.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data.data;
    }),

  // Register new user
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }).then((response) => {
      if (response.data.data.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data.data;
    }),

  // Logout user
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  // Refresh token
  refreshToken: () =>
    api.post('/auth/refresh', {}).then((response) => {
      if (response.data.data.token) {
        localStorage.setItem('auth_token', response.data.data.token);
      }
      return response.data.data;
    }),

  // Verify token
  verifyToken: () =>
    api.get('/auth/verify', {}).catch(() => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      return false;
    }),
};

export default authService;
