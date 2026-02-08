// Header component
import { Orbit, Radio } from "lucide-react";

interface HeaderProps {
  asteroidCount: number;
  lastSynced: string | null;
}

export function Header({ asteroidCount, lastSynced }: HeaderProps) {
  return (
    <header className="w-full border-b border-border/50 glass sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Orbit className="text-primary" size={24} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-safe rounded-full animate-pulse-glow" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">
              Cosmic Watch
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Interstellar Asteroid Tracker
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
            <Radio size={12} className="text-safe animate-pulse-glow" />
            <span className="font-mono">{asteroidCount} tracked</span>
          </div>
          {lastSynced && (
            <span className="text-muted-foreground font-mono hidden md:block">
              Synced: {new Date(lastSynced).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
