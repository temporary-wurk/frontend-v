// API service layer – connects to backend, never directly to NASA API.
// Backend uses database-first caching with NASA API fallback.

import axios from "axios";
import type { Asteroid, AsteroidDetailResponse, AsteroidFeedResponse } from "@/types/asteroid";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetch categorized feed with all asteroids.
 * Database-first: Returns cached data, syncs with NASA as needed.
 */
export async function fetchAsteroidFeed(): Promise<AsteroidFeedResponse> {
  try {
    // Try to get all asteroids first
    const { data } = await api.get("/asteroids");
    
    return {
      count: data.count || data.asteroids?.length || 0,
      last_synced: data.last_synced || new Date().toISOString(),
      asteroids: data.asteroids || data || [],
    };
  } catch (error) {
    console.warn("Backend unhealthy, using mock data", error);
    return getMockFeed();
  }
}

/**
 * Fetch trending asteroids with categorization.
 */
export async function fetchTrendingAsteroids(limit: number = 10) {
  try {
    const { data } = await api.get("/feed/trending", { params: { limit } });
    return data;
  } catch (error) {
    console.warn("Could not fetch trending asteroids", error);
    return getMockFeed().asteroids.slice(0, limit);
  }
}

/**
 * Fetch categorized feed by risk level.
 */
export async function fetchCategorizedFeed() {
  try {
    const { data } = await api.get("/feed");
    return data;
  } catch (error) {
    console.warn("Could not fetch categorized feed", error);
    return getCategorizedMockFeed();
  }
}

/**
 * Fetch single asteroid details from backend.
 */
export async function fetchAsteroidDetail(id: string): Promise<AsteroidDetailResponse> {
  try {
    const { data } = await api.get(`/asteroids/${id}`);
    return data.asteroid || data;
  } catch (error) {
    console.warn("Backend unavailable for detail, using mock", error);
    return getMockDetail(id);
  }
}

/**
 * Get hazardous asteroids only.
 */
export async function fetchHazardousAsteroids() {
  try {
    const { data } = await api.get("/asteroids/hazardous-only");
    return data.asteroids || [];
  } catch (error) {
    console.warn("Could not fetch hazardous asteroids", error);
    return getMockFeed().asteroids.filter(a => a.is_potentially_hazardous);
  }
}

/**
 * Get asteroids approaching in upcoming days.
 */
export async function fetchUpcomingAsteroids(days: number = 7) {
  try {
    const { data } = await api.get("/feed/upcoming", { params: { days } });
    return data.asteroids || [];
  } catch (error) {
    console.warn("Could not fetch upcoming asteroids", error);
    return getMockFeed().asteroids;
  }
}

// ─── Mock data for development / demo ────────────────────────────

function getMockFeed(): AsteroidFeedResponse {
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
        name: "99942 Apophis",
        estimated_diameter_min_km: 0.31,
        estimated_diameter_max_km: 0.45,
        is_potentially_hazardous: true,
        close_approach_date: "2026-02-09",
        miss_distance_km: 6078000,
        miss_distance_lunar: 15.81,
        relative_velocity_kmh: 30700,
        relative_velocity_kms: 8.53,
        orbiting_body: "Earth",
        absolute_magnitude_h: 19.7,
        risk_level: "MEDIUM",
        view_count: 9400,
      },
      {
        id: "5",
        nasa_id: "2101955",
        name: "Bennu",
        estimated_diameter_min_km: 0.49,
        estimated_diameter_max_km: 0.51,
        is_potentially_hazardous: true,
        close_approach_date: "2026-02-10",
        miss_distance_km: 7500000,
        miss_distance_lunar: 19.5,
        relative_velocity_kmh: 28000,
        relative_velocity_kms: 7.78,
        orbiting_body: "Earth",
        absolute_magnitude_h: 20.19,
        risk_level: "MEDIUM",
        view_count: 7800,
      },
      {
        id: "6",
        nasa_id: "3840283",
        name: "2019 OK",
        estimated_diameter_min_km: 0.057,
        estimated_diameter_max_km: 0.13,
        is_potentially_hazardous: false,
        close_approach_date: "2026-02-07",
        miss_distance_km: 12340000,
        miss_distance_lunar: 32.1,
        relative_velocity_kmh: 88500,
        relative_velocity_kms: 24.58,
        orbiting_body: "Earth",
        absolute_magnitude_h: 25.6,
        risk_level: "LOW",
        view_count: 120,
      },
      {
        id: "7",
        nasa_id: "2004953",
        name: "1990 MU",
        estimated_diameter_min_km: 2.0,
        estimated_diameter_max_km: 4.4,
        is_potentially_hazardous: true,
        close_approach_date: "2026-02-11",
        miss_distance_km: 3200000,
        miss_distance_lunar: 8.32,
        relative_velocity_kmh: 95200,
        relative_velocity_kms: 26.44,
        orbiting_body: "Earth",
        absolute_magnitude_h: 17.2,
        risk_level: "HIGH",
        view_count: 3100,
      },
      {
        id: "8",
        nasa_id: "3456789",
        name: "2024 FG3",
        estimated_diameter_min_km: 0.02,
        estimated_diameter_max_km: 0.045,
        is_potentially_hazardous: false,
        close_approach_date: "2026-02-07",
        miss_distance_km: 18900000,
        miss_distance_lunar: 49.15,
        relative_velocity_kmh: 15300,
        relative_velocity_kms: 4.25,
        orbiting_body: "Earth",
        absolute_magnitude_h: 27.3,
        risk_level: "LOW",
        view_count: 45,
      },
    ],
  };
}

function getMockDetail(id: string): AsteroidDetailResponse {
  const feed = getMockFeed();
  const asteroid = feed.asteroids.find((a) => a.id === id) || feed.asteroids[0];
  return {
    ...asteroid,
    close_approach_count: 12,
    hazardous_explanation: asteroid.is_potentially_hazardous
      ? "This asteroid's orbit brings it within close range of Earth periodically. While no immediate impact threat exists, its size and trajectory warrant monitoring."
      : "This asteroid poses no significant threat to Earth. Its orbit keeps it at a safe distance during close approaches.",
  };
}

function getCategorizedMockFeed() {
  const feed = getMockFeed();
  return {
    safe: feed.asteroids.filter(a => a.risk_level === "SAFE" || a.risk_level === "LOW"),
    problematic: feed.asteroids.filter(a => a.risk_level === "PROBLEMATIC" || a.risk_level === "MEDIUM"),
    hazardous: feed.asteroids.filter(a => a.risk_level === "HAZARDOUS" || a.risk_level === "HIGH"),
    dangerous: feed.asteroids.filter(a => a.risk_level === "DANGEROUS"),
    summary: {
      total: feed.asteroids.length,
      riskBreakdown: {
        SAFE: feed.asteroids.filter(a => a.risk_level === "SAFE" || a.risk_level === "LOW").length,
        PROBLEMATIC: feed.asteroids.filter(a => a.risk_level === "PROBLEMATIC" || a.risk_level === "MEDIUM").length,
        HAZARDOUS: feed.asteroids.filter(a => a.risk_level === "HAZARDOUS" || a.risk_level === "HIGH").length,
        DANGEROUS: feed.asteroids.filter(a => a.risk_level === "DANGEROUS").length,
      }
    }
  };
}
