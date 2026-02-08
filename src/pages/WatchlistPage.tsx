// Watchlist page - user-specific saved asteroids
import { Bookmark, Eye, LogIn, Loader2, Trash2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrentUser, useWatchlist, useRemoveFromWatchlist } from "@/hooks/useDatabaseHook";
import { AsteroidCard } from "@/components/AsteroidCard";
import { AsteroidDetailModal } from "@/components/AsteroidDetailModal";
import { useState } from "react";
import type { Asteroid } from "@/types/asteroid";

export default function WatchlistPage() {
  const { user, loading: authLoading } = useCurrentUser();
  const { watchlist, loading: listLoading } = useWatchlist(user?._id || "", 1, 50);
  const removeFromWatchistMutation = useRemoveFromWatchlist();
  const [detailId, setDetailId] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-12 text-center">
          <Bookmark size={48} className="mx-auto text-primary mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Your Watchlist</h1>
          <p className="text-muted-foreground mb-8">
            Save asteroids to track upcoming close approaches and get notifications.
          </p>

          <div className="glass rounded-xl p-8 space-y-4">
            <p className="text-muted-foreground">
              Login to start building your personalized asteroid watchlist.
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <LogIn size={16} /> Login to Get Started
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Extract asteroids from watchlist objects
  const asteroids = watchlist.map((item: any) => item.asteroid || item);

  const handleRemove = (watchlistId: string) => {
    removeFromWatchistMutation.mutate(watchlistId);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Your Watchlist</h1>
          <p className="text-muted-foreground text-sm">
            You are tracking {watchlist.length} asteroid{watchlist.length !== 1 ? 's' : ''}
          </p>
        </div>

        {listLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : asteroids.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {asteroids.map((asteroid: Asteroid, i: number) => (
                <div key={asteroid.id} className="relative group animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <AsteroidCard 
                    asteroid={asteroid}
                    onSelect={() => setDetailId(asteroid.id)}
                  />
                  <button
                    onClick={() => handleRemove(watchlist[i]._id)}
                    disabled={removeFromWatchistMutation.isPending}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remove from watchlist"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Heart size={48} className="mx-auto text-muted-foreground/40 mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Start adding asteroids to track their movements and get alerts for close approaches.
            </p>
            <Link
              to="/feed"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              <Eye size={16} /> Browse Asteroids
            </Link>
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
