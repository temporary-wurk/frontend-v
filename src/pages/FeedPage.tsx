// Full asteroid feed page with filters and sorting
import { useState, useMemo } from "react";
import { useAsteroidFeed } from "@/hooks/useAsteroids";
import { AsteroidCard } from "@/components/AsteroidCard";
import { AsteroidDetailModal } from "@/components/AsteroidDetailModal";
import type { Asteroid, RiskLevel } from "@/types/asteroid";
import { Search, SlidersHorizontal, Zap, TrendingDown } from "lucide-react";

type SortMode = "nearest" | "riskiest" | "fastest" | "viewed";

export default function FeedPage() {
  const { data, isLoading } = useAsteroidFeed();
  const asteroids = data?.asteroids || [];

  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<SortMode>("nearest");
  const [detailId, setDetailId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...asteroids];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.name.toLowerCase().includes(q) || a.nasa_id.includes(q));
    }

    if (riskFilter !== "ALL") {
      result = result.filter((a) => a.risk_level === riskFilter);
    }

    switch (sortBy) {
      case "nearest":
        result.sort((a, b) => a.miss_distance_km - b.miss_distance_km);
        break;
      case "riskiest":
        const riskOrder: Record<RiskLevel, number> = { DANGEROUS: 0, HAZARDOUS: 1, PROBLEMATIC: 2, SAFE: 3 };
        result.sort((a, b) => riskOrder[a.risk_level] - riskOrder[b.risk_level]);
        break;
      case "fastest":
        result.sort((a, b) => b.relative_velocity_kms - a.relative_velocity_kms);
        break;
      case "viewed":
        result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        break;
    }

    return result;
  }, [asteroids, search, riskFilter, sortBy]);

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Asteroid Feed</h1>
          <p className="text-muted-foreground text-sm">
            {asteroids.length} asteroids tracked • Filter and sort by risk, distance, and velocity
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or NASA ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Risk filter + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <SlidersHorizontal size={14} /> Risk:
              </span>
              {(["ALL", "SAFE", "PROBLEMATIC", "HAZARDOUS", "DANGEROUS"] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setRiskFilter(level)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    riskFilter === level
                      ? "bg-primary/20 text-primary border border-primary/50"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-border/50"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Zap size={14} /> Sort:
              </span>
              {(["nearest", "riskiest", "fastest", "viewed"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortBy(mode)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    sortBy === mode
                      ? "bg-primary/20 text-primary border border-primary/50"
                      : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-border/50"
                  }`}
                >
                  {mode === "nearest" && "📍 Nearest"}
                  {mode === "riskiest" && "⚠️ Riskiest"}
                  {mode === "fastest" && "🚀 Fastest"}
                  {mode === "viewed" && "👁️ Trending"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">Loading asteroids…</p>
            </div>
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-6">Showing {filtered.length} of {asteroids.length} asteroids</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((asteroid, i) => (
                <div key={asteroid.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <AsteroidCard 
                    asteroid={asteroid} 
                    onSelect={() => setDetailId(asteroid.id)}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <TrendingDown size={32} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No asteroids match your filters.</p>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detailId && (
        <AsteroidDetailModal asteroidId={detailId} onClose={() => setDetailId(null)} />
      )}
    </div>
  );
}
