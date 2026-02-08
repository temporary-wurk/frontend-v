// Example: Asteroids List Component using Database Hooks
import { useState } from 'react';
import { useAsteroids, useAddToWatchlist, useCurrentUser } from '@/hooks/useDatabaseHook';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

export default function AsteroidsListComponent() {
  const { user } = useCurrentUser();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  const { asteroids, total, loading, error } = useAsteroids(page, 20, filters);
  const addToWatchlist = useAddToWatchlist();
  const [loadingActionId, setLoadingActionId] = useState(null);

  const handleAddToWatchlist = async (asteroidId) => {
    if (!user?.id) return;

    setLoadingActionId(asteroidId);
    try {
      await addToWatchlist.mutateAsync({
        userId: user.id,
        asteroidId,
        notes: '',
      });
    } finally {
      setLoadingActionId(null);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div>Loading asteroids...</div>;
  if (error) return <div>Error loading asteroids: {error.message}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Near-Earth Asteroids</h2>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filters.hazardous === true ? 'default' : 'outline'}
          onClick={() =>
            setFilters({ ...filters, hazardous: filters.hazardous ? undefined : true })
          }
        >
          Hazardous Only
        </Button>
      </div>

      {/* Asteroids Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {asteroids?.length > 0 ? (
          asteroids.map((asteroid) => (
            <Card key={asteroid.id} className="p-4 hover:shadow-lg transition-shadow">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{asteroid.name}</h3>
                  <Badge className={getRiskColor(asteroid.risk_level)}>
                    {asteroid.risk_level}
                  </Badge>
                </div>

                <div className="text-sm space-y-1 text-gray-600">
                  <p>
                    <strong>Diameter:</strong> {asteroid.estimated_diameter_min_km.toFixed(2)}-
                    {asteroid.estimated_diameter_max_km.toFixed(2)} km
                  </p>
                  <p>
                    <strong>Closest Approach:</strong> {asteroid.close_approach_date}
                  </p>
                  <p>
                    <strong>Miss Distance:</strong> {(asteroid.miss_distance_km / 1000).toFixed(0)}k km
                  </p>
                  <p>
                    <strong>Velocity:</strong> {asteroid.relative_velocity_kmh.toFixed(0)} km/h
                  </p>
                  {asteroid.is_potentially_hazardous && (
                    <Badge variant="destructive">Potentially Hazardous</Badge>
                  )}
                </div>

                <Button
                  className="w-full mt-4"
                  onClick={() => handleAddToWatchlist(asteroid.id)}
                  disabled={addToWatchlist.isPending || loadingActionId === asteroid.id}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Add to Watchlist
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No asteroids found</p>
        )}
      </div>

      {/* Pagination */}
      {total && total > 20 && (
        <div className="flex gap-2 justify-center mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {page} of {Math.ceil(total / 20)}
          </span>
          <Button
            variant="outline"
            disabled={page >= Math.ceil(total / 20)}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
