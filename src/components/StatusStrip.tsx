// Live asteroid status strip with counters
import { Shield, AlertTriangle, Flame, Globe } from "lucide-react";
import type { Asteroid } from "@/types/asteroid";

interface StatusStripProps {
  asteroids: Asteroid[];
}

export function StatusStrip({ asteroids }: StatusStripProps) {
  const total = asteroids.length;
  const safe = asteroids.filter((a) => a.risk_level === "LOW").length;
  const hazardous = asteroids.filter((a) => a.risk_level === "MEDIUM").length;
  const highRisk = asteroids.filter((a) => a.risk_level === "HIGH").length;

  const stats = [
    { icon: <Globe size={18} />, label: "Total Today", value: total, color: "text-primary" },
    { icon: <Shield size={18} />, label: "Safe", value: safe, color: "text-safe" },
    { icon: <AlertTriangle size={18} />, label: "Hazardous", value: hazardous, color: "text-warning" },
    { icon: <Flame size={18} />, label: "High Risk", value: highRisk, color: "text-destructive" },
  ];

  return (
    <section className="w-full border-y border-border/50 glass">
      <div className="max-w-5xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 justify-center">
            <div className={stat.color}>{stat.icon}</div>
            <div>
              <p className="text-xl font-bold font-mono text-foreground">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
