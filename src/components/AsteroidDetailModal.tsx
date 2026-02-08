// Asteroid detail modal
import { X, AlertTriangle, Shield, Activity, Calendar, BarChart3, Bookmark, Check, Loader2, Play } from "lucide-react";
import type { Asteroid, RiskLevel } from "@/types/asteroid";
import { getRiskLevel, getRiskBgColor, getRiskColor } from "@/types/asteroid";
import { useAsteroidDetail } from "@/hooks/useAsteroids";
import { useCurrentUser, useAddToWatchlist, useRemoveFromWatchlist, useWatchlist, useIsInWatchlist } from "@/hooks/useDatabaseHook";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface AsteroidDetailModalProps {
  asteroidId: string;
  onClose: () => void;
}

export function AsteroidDetailModal({ asteroidId, onClose }: AsteroidDetailModalProps) {
  const { data: detail, isLoading } = useAsteroidDetail(asteroidId);
  const { user } = useCurrentUser();
  const navigate = useNavigate();
  
  // Watchlist logic
  const { isInWatchlist, loading: checkLoading } = useIsInWatchlist(user?._id || "", asteroidId);
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  // Find the specific watchlist ID if it exists (inefficient but works for now without rewriting hook)
  // Ideally useIsInWatchlist should return the watchlist ID too
  const { watchlist } = useWatchlist(user?._id || "", 1, 100);
  const watchlistId = watchlist.find((w: any) => w.asteroid._id === asteroidId || w.asteroid.id === asteroidId)?._id;

  const handleWatchlistToggle = async () => {
    if (!user) {
      navigate("/profile");
      return;
    }

    if (isInWatchlist && watchlistId) {
      removeFromWatchlist.mutate(watchlistId);
    } else {
      addToWatchlist.mutate({
        userId: user._id, 
        asteroidId: asteroidId,
        notes: "Added from detail view"
      });
    }
  };

  const isPending = addToWatchlist.isPending || removeFromWatchlist.isPending;

  if (isLoading || !detail) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        <div className="glass rounded-2xl p-8 w-full max-w-lg animate-fade-in">
          <div className="flex justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const risk = getRiskLevel(detail);
  const riskPercent = risk === "DANGEROUS" ? 100 : risk === "HAZARDOUS" ? 75 : risk === "PROBLEMATIC" ? 50 : 15;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="glass rounded-2xl p-6 w-full max-w-lg animate-fade-in space-y-5 max-h-[85vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">{detail.name}</h2>
            <p className="text-xs font-mono text-muted-foreground">NASA ID: {detail.nasa_id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Risk meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Activity size={14} /> Risk Level
            </span>
            <span className={`font-bold ${getRiskColor(risk)}`}>{risk}</span>
          </div>
          <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                risk === "DANGEROUS" || risk === "HAZARDOUS"
                  ? "bg-destructive"
                  : risk === "PROBLEMATIC"
                  ? "bg-warning"
                  : "bg-safe"
              }`}
              style={{ width: `${riskPercent}%` }}
            />
          </div>
        </div>

        {/* Risk badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getRiskBgColor(risk)}`}>
          {risk === "DANGEROUS" || risk === "HAZARDOUS" ? <AlertTriangle size={12} /> : <Shield size={12} />}
          {detail.is_potentially_hazardous ? "Potentially Hazardous" : "Safe Object"}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <StatBlock icon={<Calendar size={14} />} label="Close Approach" value={detail.close_approach_date} />
          <StatBlock icon={<BarChart3 size={14} />} label="Approach Count" value={`${detail.close_approach_count || 0} recorded`} />
          <StatBlock label="Miss Distance" value={`${(detail.miss_distance_km / 1000000).toFixed(2)}M km`} />
          <StatBlock label="Velocity" value={`${detail.relative_velocity_kms.toFixed(1)} km/s`} />
          <StatBlock label="Diameter" value={`${(detail.estimated_diameter_max_km * 1000).toFixed(0)} m`} />
          <StatBlock label="Magnitude" value={`${detail.absolute_magnitude_h} H`} />
        </div>

        {/* Explanation */}
        <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
          <p className="text-sm text-secondary-foreground leading-relaxed">
            {detail.hazardous_explanation}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex gap-3">
           <button 
            onClick={handleWatchlistToggle}
            disabled={isPending || checkLoading}
            className={`flex-1 py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
              isInWatchlist 
                ? "bg-secondary text-foreground hover:bg-secondary/80 border border-border" 
                : "bg-primary text-primary-foreground hover:opacity-90"
            }`}
          >
            {isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isInWatchlist ? (
              <>
                <Check size={16} /> In Watchlist
              </>
            ) : (
              <>
                <Bookmark size={16} /> {user ? "Add to Watchlist" : "Login to Track"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold font-mono text-foreground">{value}</p>
    </div>
  );
}
