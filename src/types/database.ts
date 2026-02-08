// Database Types for 4-table schema
// Tables: users, asteroid_detail, watchlist, alert

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
  preferences?: {
    theme?: 'light' | 'dark';
    notifications_enabled?: boolean;
  };
}

export interface AsteroidDetail {
  id: string;
  nasa_id: string;
  name: string;
  estimated_diameter_min_km: number;
  estimated_diameter_max_km: number;
  is_potentially_hazardous: boolean;
  close_approach_date: string;
  miss_distance_km: number;
  miss_distance_lunar: number;
  relative_velocity_kmh: number;
  relative_velocity_kms: number;
  orbiting_body: string;
  absolute_magnitude_h: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  orbital_data?: {
    orbit_id: string;
    orbit_determination_date: string;
    eccentricity: string;
    semi_major_axis: string;
    inclination: string;
    orbital_period: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Watchlist {
  id: string;
  user_id: string;
  asteroid_id: string;
  asteroid_detail?: AsteroidDetail;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  asteroid_id: string;
  alert_type: 'high_risk' | 'close_approach' | 'watchlist_update' | 'custom';
  message: string;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  read_at?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

// Request/Create Types
export interface CreateUserRequest {
  username: string;
  email: string;
  password?: string;
  preferences?: User['preferences'];
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  preferences?: User['preferences'];
}

export interface CreateWatchlistRequest {
  user_id: string;
  asteroid_id: string;
  notes?: string;
}

export interface CreateAlertRequest {
  user_id: string;
  asteroid_id: string;
  alert_type: Alert['alert_type'];
  message: string;
  priority?: Alert['priority'];
}
