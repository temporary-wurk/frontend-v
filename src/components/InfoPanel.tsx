// Floating info panel – shows selected asteroid details
import { X, AlertTriangle, Shield, Zap, Ruler, Globe } from "lucide-react";
import type { Asteroid } from "@/types/asteroid";
import { getRiskLevel, getRiskBgColor } from "@/types/asteroid";

interface InfoPanelProps {
  asteroid: Asteroid;
  onClose: () => void;
}

export function InfoPanel({ asteroid, onClose }: InfoPanelProps) {
  const risk = getRiskLevel(asteroid);

  return (
    <div className="glass rounded-xl p-5 w-80 animate-fade-in space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{asteroid.name}</h3>
          <p className="text-xs font-mono text-muted-foreground">NASA ID: {asteroid.nasa_id}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>

      {/* Risk badge */}
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getRiskBgColor(risk)}`}>
        {risk === "HIGH" ? <AlertTriangle size={12} /> : <Shield size={12} />}
        {risk} RISK
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <InfoStat
          icon={<Globe size={14} />}
          label="Distance"
          value={`${(asteroid.miss_distance_km / 1000000).toFixed(2)}M km`}
          sub={`${asteroid.miss_distance_lunar.toFixed(1)} lunar dist.`}
        />
        <InfoStat
          icon={<Zap size={14} />}
          label="Velocity"
          value={`${asteroid.relative_velocity_kms.toFixed(1)} km/s`}
          sub={`${Math.round(asteroid.relative_velocity_kmh).toLocaleString()} km/h`}
        />
        <InfoStat
          icon={<Ruler size={14} />}
          label="Diameter"
          value={`${asteroid.estimated_diameter_max_km.toFixed(2)} km`}
          sub={`${(asteroid.estimated_diameter_max_km * 1000).toFixed(0)} m`}
        />
        <InfoStat
          icon={<AlertTriangle size={14} />}
          label="Hazardous"
          value={asteroid.is_potentially_hazardous ? "Yes" : "No"}
          sub={`Approach: ${asteroid.close_approach_date}`}
        />
      </div>

      {/* Approach date */}
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Close approach: <span className="font-mono text-foreground">{asteroid.close_approach_date}</span>
        </p>
      </div>
    </div>
  );
}

function InfoStat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="bg-secondary/50 rounded-lg p-2.5 space-y-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-sm font-semibold text-foreground font-mono">{value}</p>
      <p className="text-[10px] text-muted-foreground">{sub}</p>
    </div>
  );
}
