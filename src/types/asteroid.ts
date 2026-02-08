// Types for asteroid data from the backend API

export type RiskLevel = "SAFE" | "PROBLEMATIC" | "HAZARDOUS" | "DANGEROUS";

export interface Asteroid {
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
  risk_level: RiskLevel;
  view_count?: number;
}

export interface AsteroidFeedResponse {
  count: number;
  asteroids: Asteroid[];
  last_synced: string;
}

export interface AsteroidDetailResponse extends Asteroid {
  close_approach_count: number;
  hazardous_explanation: string;
  orbital_data?: {
    orbit_id: string;
    orbit_determination_date: string;
    eccentricity: string;
    semi_major_axis: string;
    inclination: string;
    orbital_period: string;
  };
}

// Helper to compute risk level from asteroid data (frontend fallback)
export function getRiskLevel(asteroid: Asteroid): RiskLevel {
  if (asteroid.risk_level) return asteroid.risk_level;
  if (asteroid.is_potentially_hazardous && asteroid.miss_distance_km < 500000) return "DANGEROUS";
  if (asteroid.is_potentially_hazardous) return "HAZARDOUS";
  if (asteroid.miss_distance_km < 5000000) return "PROBLEMATIC";
  return "SAFE";
}

// Risk level color mapping
export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case "DANGEROUS": return "text-destructive";
    case "HAZARDOUS": return "text-orange-500";
    case "PROBLEMATIC": return "text-warning";
    default: return "text-safe"; // SAFE
  }
}

export function getRiskBgColor(level: RiskLevel): string {
  switch (level) {
    case "DANGEROUS": return "bg-destructive/20 text-destructive border-destructive/30";
    case "HAZARDOUS": return "bg-orange-500/20 text-orange-500 border-orange-500/30";
    case "PROBLEMATIC": return "bg-warning/20 text-warning border-warning/30";
    default: return "bg-safe/20 text-safe border-safe/30"; // SAFE
  }
}
