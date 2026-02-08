// Feed/dashboard section with tabbed asteroid categories
import { useState } from "react";
import type { Asteroid } from "@/types/asteroid";
import { AsteroidCard } from "./AsteroidCard";

type FeedTab = "trending" | "safe" | "problematic" | "hazardous" | "dangerous";

interface AsteroidFeedProps {
  asteroids: Asteroid[];
  onSelectAsteroid: (asteroid: Asteroid) => void;
}

const tabs: { key: FeedTab; label: string; emoji: string }[] = [
  { key: "trending", label: "Trending", emoji: "🔥" },
  { key: "safe", label: "Safe", emoji: "🟢" },
  { key: "problematic", label: "Problematic", emoji: "🟡" },
  { key: "hazardous", label: "Hazardous", emoji: "🟠" },
  { key: "dangerous", label: "Dangerous", emoji: "🔴" },
];

function filterAsteroids(asteroids: Asteroid[], tab: FeedTab): Asteroid[] {
  switch (tab) {
    case "safe":
      return asteroids.filter((a) => a.risk_level === "SAFE");
    case "problematic":
      return asteroids.filter((a) => a.risk_level === "PROBLEMATIC");
    case "hazardous":
      return asteroids.filter((a) => a.risk_level === "HAZARDOUS");
    case "dangerous":
      return asteroids.filter((a) => a.risk_level === "DANGEROUS");
    case "trending":
      return [...asteroids].sort((a, b) => {
        const scoreA = (a.view_count || 0) + (1 / (a.miss_distance_km || 1)) * 1e9;
        const scoreB = (b.view_count || 0) + (1 / (b.miss_distance_km || 1)) * 1e9;
        return scoreB - scoreA;
      });
  }
}

export function AsteroidFeed({ asteroids, onSelectAsteroid }: AsteroidFeedProps) {
  const [activeTab, setActiveTab] = useState<FeedTab>("trending");
  const filtered = filterAsteroids(asteroids, activeTab);

  return (
    <section className="w-full max-w-5xl mx-auto px-4 pb-16">
      {/* Section heading */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Asteroid Feed
        </h2>
        <p className="text-muted-foreground text-sm">
          Real-time asteroid data from the database • Updated every 60s
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
              activeTab === tab.key
                ? "bg-primary/15 border-primary/40 text-primary glow-primary"
                : "bg-secondary/50 border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <span className="mr-1.5">{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((asteroid, i) => (
            <div key={asteroid.id} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
              <AsteroidCard asteroid={asteroid} onSelect={onSelectAsteroid} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No asteroids in this category right now.</p>
        </div>
      )}
    </section>
  );
}
