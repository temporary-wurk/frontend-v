// Database Schema Documentation
// This file documents the 4-table database schema

/**
 * ===== USERS TABLE =====
 * Stores user account information
 * 
 * Fields:
 * - id: string (UUID, Primary Key)
 * - username: string (Unique)
 * - email: string (Unique)
 * - password_hash: string (Hashed password, never sent to frontend)
 * - preferences: JSON (User preferences like theme, notifications)
 * - created_at: timestamp
 * - updated_at: timestamp
 * 
 * Relationships:
 * - hasMany: watchlist (via user_id)
 * - hasMany: alerts (via user_id)
 */

/**
 * ===== ASTEROID_DETAIL TABLE =====
 * Stores detailed information about asteroids
 * 
 * Fields:
 * - id: string (UUID, Primary Key)
 * - nasa_id: string (External NASA identifier)
 * - name: string
 * - estimated_diameter_min_km: float
 * - estimated_diameter_max_km: float
 * - is_potentially_hazardous: boolean
 * - close_approach_date: date
 * - miss_distance_km: float
 * - miss_distance_lunar: float
 * - relative_velocity_kmh: float
 * - relative_velocity_kms: float
 * - orbiting_body: string (e.g., "Earth")
 * - absolute_magnitude_h: float
 * - risk_level: enum ('LOW', 'MEDIUM', 'HIGH')
 * - orbital_data: JSON (Optional orbital mechanics data)
 * - created_at: timestamp
 * - updated_at: timestamp
 * 
 * Relationships:
 * - hasMany: watchlist_items (via asteroid_id)
 * - hasMany: alerts (via asteroid_id)
 */

/**
 * ===== WATCHLIST TABLE =====
 * Stores user's watched asteroids
 * 
 * Fields:
 * - id: string (UUID, Primary Key)
 * - user_id: string (Foreign Key -> users.id)
 * - asteroid_id: string (Foreign Key -> asteroid_detail.id)
 * - notes: string (Optional user notes)
 * - created_at: timestamp
 * - updated_at: timestamp
 * 
 * Constraints:
 * - Unique constraint: (user_id, asteroid_id)
 * 
 * Relationships:
 * - belongsTo: user (via user_id)
 * - belongsTo: asteroid_detail (via asteroid_id)
 */

/**
 * ===== ALERT TABLE =====
 * Stores alerts/notifications for users about asteroids
 * 
 * Fields:
 * - id: string (UUID, Primary Key)
 * - user_id: string (Foreign Key -> users.id)
 * - asteroid_id: string (Foreign Key -> asteroid_detail.id)
 * - alert_type: enum ('high_risk', 'close_approach', 'watchlist_update', 'custom')
 * - message: string
 * - is_read: boolean (Default: false)
 * - read_at: timestamp (Optional, when user read the alert)
 * - priority: enum ('low', 'medium', 'high') (Default: 'medium')
 * - created_at: timestamp
 * - updated_at: timestamp
 * 
 * Relationships:
 * - belongsTo: user (via user_id)
 * - belongsTo: asteroid_detail (via asteroid_id)
 */

/**
 * ===== EXPECTED BACKEND ENDPOINTS =====
 * 
 * Verify your backend implements these endpoints for full functionality:
 * 
 * USERS:
 * - GET    /api/users/:userId
 * - GET    /api/users/profile
 * - POST   /api/users
 * - PUT    /api/users/:userId
 * - DELETE /api/users/:userId
 * 
 * ASTEROIDS:
 * - GET    /api/asteroids
 * - GET    /api/asteroids/:id
 * - GET    /api/asteroids/nasa/:nasaId
 * - POST   /api/asteroids
 * - PUT    /api/asteroids/:id
 * - DELETE /api/asteroids/:id
 * - GET    /api/asteroids/search?q=query
 * - GET    /api/asteroids/filter/high-risk
 * - GET    /api/asteroids/filter/close-approaching
 * 
 * WATCHLIST:
 * - GET    /api/users/:userId/watchlist
 * - POST   /api/users/:userId/watchlist
 * - DELETE /api/watchlist/:id
 * - GET    /api/users/:userId/watchlist/check/:asteroidId
 * 
 * ALERTS:
 * - GET    /api/users/:userId/alerts
 * - POST   /api/alerts
 * - PUT    /api/alerts/:id/read
 * - DELETE /api/alerts/:id
 * - GET    /api/users/:userId/alerts/unread-count
 * 
 * AUTH:
 * - POST   /api/auth/login
 * - POST   /api/auth/register
 * - POST   /api/auth/logout
 * - GET    /api/auth/verify
 */

// Example database initialization SQL (PostgreSQL):
/*
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE asteroid_detail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nasa_id VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  estimated_diameter_min_km FLOAT,
  estimated_diameter_max_km FLOAT,
  is_potentially_hazardous BOOLEAN DEFAULT FALSE,
  close_approach_date DATE,
  miss_distance_km FLOAT,
  miss_distance_lunar FLOAT,
  relative_velocity_kmh FLOAT,
  relative_velocity_kms FLOAT,
  orbiting_body VARCHAR(255),
  absolute_magnitude_h FLOAT,
  risk_level VARCHAR(20) CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH')),
  orbital_data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asteroid_id UUID NOT NULL REFERENCES asteroid_detail(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, asteroid_id)
);

CREATE TABLE alert (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asteroid_id UUID NOT NULL REFERENCES asteroid_detail(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) CHECK (alert_type IN ('high_risk', 'close_approach', 'watchlist_update', 'custom')) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  priority VARCHAR(20) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_asteroid_detail_nasa_id ON asteroid_detail(nasa_id);
CREATE INDEX idx_watchlist_user_id ON watchlist(user_id);
CREATE INDEX idx_alert_user_id ON alert(user_id);
CREATE INDEX idx_alert_is_read ON alert(is_read);
*/

export default {};
