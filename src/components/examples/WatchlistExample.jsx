// Example: Watchlist Component using Database Hooks
import { useState } from 'react';
import { useWatchlist, useAddToWatchlist, useRemoveFromWatchlist } from '@/hooks/useDatabaseHook';
import { useCurrentUser } from '@/hooks/useDatabaseHook';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';

export default function WatchlistComponent({ asteroidId }) {
  const { user } = useCurrentUser();
  const { watchlist, loading, error } = useWatchlist(user?.id);
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const [loading_action, setLoading] = useState(false);

  const handleAddToWatchlist = async () => {
    if (!user?.id || !asteroidId) return;
    
    setLoading(true);
    try {
      await addToWatchlist.mutateAsync({
        userId: user.id,
        asteroidId,
        notes: '',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (watchlistId) => {
    setLoading(true);
    try {
      await removeFromWatchlist.mutateAsync(watchlistId);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading watchlist...</div>;
  if (error) return <div>Error loading watchlist: {error.message}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">My Watchlist</h2>
      
      <Button 
        onClick={handleAddToWatchlist}
        disabled={loading_action || addToWatchlist.isPending}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add to Watchlist
      </Button>

      <div className="grid gap-4">
        {watchlist?.length > 0 ? (
          watchlist.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {item.asteroid_detail?.name || 'Unknown Asteroid'}
                  </h3>
                  {item.notes && (
                    <p className="text-sm text-gray-600 mt-1">{item.notes}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Added: {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveFromWatchlist(item.id)}
                  disabled={removeFromWatchlist.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No asteroids in your watchlist</p>
        )}
      </div>
    </div>
  );
}
