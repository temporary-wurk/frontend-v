// Main home page: 3D hero + status strip + feed + educational + CTA
import { useState, useCallback, Suspense } from "react";
import { useAsteroidFeed } from "@/hooks/useAsteroids";
import { SpaceScene } from "@/components/three/SpaceScene";
import { InfoPanel } from "@/components/InfoPanel";
import { StatusStrip } from "@/components/StatusStrip";
import { AsteroidFeed } from "@/components/AsteroidFeed";
import { EducationalSection } from "@/components/EducationalSection";
import { CTASection } from "@/components/CTASection";
import { AsteroidDetailModal } from "@/components/AsteroidDetailModal";
import type { Asteroid } from "@/types/asteroid";

const Index = () => {
  const { data, isLoading } = useAsteroidFeed();
  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);

  const asteroids = data?.asteroids || [];

  const handleSelectAsteroid = useCallback((asteroid: Asteroid) => {
    setSelectedAsteroid(asteroid);
  }, []);

  const handleCardSelect = useCallback((asteroid: Asteroid) => {
    setSelectedAsteroid(asteroid);
    setDetailId(asteroid.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero: 3D Earth scene */}
      <section className="relative w-full h-[60vh] md:h-[70vh]">
        <div className="absolute inset-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-3">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">Loading asteroid data…</p>
              </div>
            </div>
          ) : (
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            }>
              <SpaceScene
                asteroids={asteroids}
                selectedAsteroid={selectedAsteroid}
                onSelectAsteroid={handleSelectAsteroid}
              />
            </Suspense>
          )}
        </div>

        {/* Floating info panel */}
        {selectedAsteroid && (
          <div className="absolute top-4 right-4 z-10">
            <InfoPanel
              asteroid={selectedAsteroid}
              onClose={() => setSelectedAsteroid(null)}
            />
          </div>
        )}

        {/* Hero text overlay */}
        <div className="absolute bottom-6 left-4 md:left-8 z-10 pointer-events-none">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-1">
            Near-Earth Objects
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-foreground text-glow">
            Real-Time Tracking
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">
            Click or hover asteroids in the 3D view to inspect their data
          </p>
        </div>
      </section>

      {/* Status strip */}
      <StatusStrip asteroids={asteroids} />

      {/* Feed section */}
      <div className="py-12">
        <AsteroidFeed asteroids={asteroids} onSelectAsteroid={handleCardSelect} />
      </div>

      {/* Separator */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      {/* Educational section */}
      <EducationalSection />

      {/* CTA */}
      <CTASection />

      {/* Detail modal */}
      {detailId && (
        <AsteroidDetailModal asteroidId={detailId} onClose={() => setDetailId(null)} />
      )}
    </div>
  );
};

export default Index;
