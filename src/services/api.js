// API service layer – connects to YOUR backend for NASA data
// Updated to support both legacy API calls and new database operations

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Fetch asteroid feed from backend.
 * Backend handles NASA sync + database caching.
 */
export async function fetchAsteroidFeed() {
  try {
    const { data } = await api.get("/asteroids/feed");
    return data;
  } catch (error) {
    console.warn("Backend unavailable, using mock data", error);
    return getMockFeed();
  }
}

/**
 * Fetch single asteroid details from backend.
 */
export async function fetchAsteroidDetail(id) {
  try {
    const { data } = await api.get(`/asteroids/${id}`);
    return data;
  } catch (error) {
    console.warn("Backend unavailable, using mock detail", error);
    return getMockDetail(id);
  }
}

// ─── Mock data for development / demo ────────────────────────────

function getMockFeed() {
  return {
    count: 8,
    last_synced: new Date().toISOString(),
    asteroids: [
      {
        id: "1",
        nasa_id: "3542519",
        name: "2010 PK9",
        estimated_diameter_min_km: 0.13,
        estimated_diameter_max_km: 0.29,
        is_potentially_hazardous: false,
        close_approach_date: "2026-02-07",
        miss_distance_km: 4523890,
        miss_distance_lunar: 11.76,
        relative_velocity_kmh: 48250,
        relative_velocity_kms: 13.4,
        orbiting_body: "Earth",
        absolute_magnitude_h: 23.5,
        risk_level: "LOW",
        view_count: 342,
      },
      {
        id: "2",
        nasa_id: "2277475",
        name: "2005 YY128",
        estimated_diameter_min_km: 0.58,
        estimated_diameter_max_km: 1.3,
        is_potentially_hazardous: true,
        close_approach_date: "2026-02-08",
        miss_distance_km: 2145600,
        miss_distance_lunar: 5.58,
        relative_velocity_kmh: 72100,
        relative_velocity_kms: 20.03,
        orbiting_body: "Earth",
        absolute_magnitude_h: 20.1,
        risk_level: "HIGH",
        view_count: 1205,
      },
      {
        id: "3",
        nasa_id: "54321098",
        name: "2023 BU",
        estimated_diameter_min_km: 0.004,
        estimated_diameter_max_km: 0.008,
        is_potentially_hazardous: false,
        close_approach_date: "2026-02-07",
        miss_distance_km: 3560,
        miss_distance_lunar: 0.01,
        relative_velocity_kmh: 33400,
        relative_velocity_kms: 9.28,
        orbiting_body: "Earth",
        absolute_magnitude_h: 32.1,
        risk_level: "LOW",
        view_count: 5820,
      },
      {
        id: "4",
        nasa_id: "2099942",
        name: "Apophis",
        estimated_diameter_min_km: 0.3,
        estimated_diameter_max_km: 0.53,
        is_potentially_hazardous: true,
        close_approach_date: "2029-04-13",
        miss_distance_km: 31600,
        miss_distance_lunar: 0.082,
        relative_velocity_kmh: 8400,
        relative_velocity_kms: 2.33,
        orbiting_body: "Earth",
        absolute_magnitude_h: 19.7,
        risk_level: "HIGH",
        view_count: 8450,
      },
    ],
  };
}

function getMockDetail(id) {
  const mockData = {
    id: id,
    nasa_id: "2099942",
    name: "Apophis",
    estimated_diameter_min_km: 0.3,
    estimated_diameter_max_km: 0.53,
    is_potentially_hazardous: true,
    close_approach_date: "2029-04-13",
    miss_distance_km: 31600,
    miss_distance_lunar: 0.082,
    relative_velocity_kmh: 8400,
    relative_velocity_kms: 2.33,
    orbiting_body: "Earth",
    absolute_magnitude_h: 19.7,
    risk_level: "HIGH",
    close_approach_count: 12,
    hazardous_explanation:
      "This asteroid has a very small miss distance on April 13, 2029",
    orbital_data: {
      orbit_id: "1",
      orbit_determination_date: "2021-05-13",
      eccentricity: "0.19",
      semi_major_axis: "0.92",
      inclination: "3.35",
      orbital_period: "323.64",
    },
  };

  return mockData;
}

export default api;
