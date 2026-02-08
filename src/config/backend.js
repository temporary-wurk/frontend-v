// Backend Configuration
// Update these values to match your backend deployment

export const BACKEND_CONFIG = {
  // Base API URL - change this to your deployed backend
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  
  // API version
  API_VERSION: 'v1',
  
  // Request timeout (ms)
  REQUEST_TIMEOUT: 15000,
  
  // Polling intervals
  POLLING_INTERVALS: {
    ALERTS: 30000, // 30 seconds
    ASTEROIDS: 60000, // 1 minute
    DASHBOARD: 120000, // 2 minutes
  },
  
  // Pagination
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },

  // Feature flags
  FEATURES: {
    ENABLE_3D_ASTEROIDS: true,
    ENABLE_REAL_TIME_ALERTS: true,
    ENABLE_COMMUNITY_FEATURES: true,
    ENABLE_WATCHLIST: true,
  },

  // Database table names (for reference)
  TABLES: {
    USERS: 'users',
    ASTEROID_DETAIL: 'asteroid_detail',
    WATCHLIST: 'watchlist',
    ALERT: 'alert',
  },

  // API Endpoints - auto-constructed based on BASE_URL
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      REFRESH: '/auth/refresh',
      VERIFY: '/auth/verify',
    },
    USERS: {
      GET_USER: '/users/:userId',
      GET_PROFILE: '/users/profile',
      CREATE_USER: '/users',
      UPDATE_USER: '/users/:userId',
      DELETE_USER: '/users/:userId',
      GET_ALL: '/users',
    },
    ASTEROIDS: {
      GET_ALL: '/asteroids',
      GET_ONE: '/asteroids/:asteroidId',
      GET_BY_NASA_ID: '/asteroids/nasa/:nasaId',
      CREATE: '/asteroids',
      UPDATE: '/asteroids/:asteroidId',
      DELETE: '/asteroids/:asteroidId',
      SEARCH: '/asteroids/search',
      HIGH_RISK: '/asteroids/filter/high-risk',
      CLOSE_APPROACHING: '/asteroids/filter/close-approaching',
      FEED: '/asteroids/feed',
      SYNC: '/users/:userId/sync-asteroids',
    },
    WATCHLIST: {
      GET_USER_WATCHLIST: '/users/:userId/watchlist',
      GET_ITEM: '/watchlist/:watchlistId',
      ADD: '/users/:userId/watchlist',
      REMOVE: '/watchlist/:watchlistId',
      UPDATE: '/watchlist/:watchlistId',
      CHECK: '/users/:userId/watchlist/check/:asteroidId',
      GET_ALL: '/watchlist',
    },
    ALERTS: {
      GET_USER_ALERTS: '/users/:userId/alerts',
      GET_ALERT: '/alerts/:alertId',
      CREATE: '/alerts',
      MARK_READ: '/alerts/:alertId/read',
      MARK_ALL_READ: '/users/:userId/alerts/read-all',
      DELETE: '/alerts/:alertId',
      UNREAD_COUNT: '/users/:userId/alerts/unread-count',
    },
    DASHBOARD: {
      GET: '/users/:userId/dashboard',
    },
    HEALTH: '/health',
  },
};

export default BACKEND_CONFIG;
