// Asteroid card for the feed/dashboard section
import { Eye, ArrowRight } from "lucide-react";
import type { Asteroid } from "@/types/asteroid";
import { getRiskLevel, getRiskBgColor } from "@/types/asteroid";

interface AsteroidCardProps {
  asteroid: Asteroid;
  onSelect: (asteroid: Asteroid) => void;
}

export function AsteroidCard({ asteroid, onSelect }: AsteroidCardProps) {
  const risk = getRiskLevel(asteroid);

  return (
    <button
      onClick={() => onSelect(asteroid)}
      className="glass rounded-xl p-4 text-left w-full hover:border-primary/30 transition-all duration-300 group hover:glow-primary"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {asteroid.name}
          </h4>
          <p className="text-[11px] font-mono text-muted-foreground">
            {asteroid.nasa_id}
          </p>
        </div>
        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getRiskBgColor(risk)}`}>
          {risk}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Distance</p>
          <p className="text-sm font-mono text-foreground">
            {(asteroid.miss_distance_km / 1000000).toFixed(2)}M km
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase text-muted-foreground tracking-wider">Velocity</p>
          <p className="text-sm font-mono text-foreground">
            {asteroid.relative_velocity_kms.toFixed(1)} km/s
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-1 text-muted-foreground text-[11px]">
          <Eye size={12} />
          <span>{asteroid.view_count?.toLocaleString() || 0}</span>
        </div>
        <span className="text-xs text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          View in 3D <ArrowRight size={12} />
        </span>
      </div>
    </button>
  );
}
