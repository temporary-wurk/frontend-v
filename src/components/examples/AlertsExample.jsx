// Example: Alerts Component using Database Hooks
import { useState, useEffect } from 'react';
import { useAlerts, useUnreadAlertCount, useMarkAlertAsRead, useCurrentUser } from '@/hooks/useDatabaseHook';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle } from 'lucide-react';

export default function AlertsComponent() {
  const { user } = useCurrentUser();
  const { alerts, loading, error } = useAlerts(user?.id, 1, 20, false);
  const { count: unreadCount } = useUnreadAlertCount(user?.id);
  const markAsRead = useMarkAlertAsRead();
  const [selectedAlert, setSelectedAlert] = useState(null);

  const handleMarkAsRead = async (alertId) => {
    try {
      await markAsRead.mutateAsync(alertId);
      setSelectedAlert(null);
    } catch (err) {
      console.error('Failed to mark alert as read:', err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertTypeLabel = (type) => {
    switch (type) {
      case 'high_risk':
        return 'High Risk Asteroid';
      case 'close_approach':
        return 'Close Approach';
      case 'watchlist_update':
        return 'Watchlist Update';
      case 'custom':
        return 'Custom Alert';
      default:
        return type;
    }
  };

  if (loading) return <div>Loading alerts...</div>;
  if (error) return <div>Error loading alerts: {error.message}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Alerts
        </h2>
        {unreadCount > 0 && (
          <Badge className="bg-red-500">{unreadCount} unread</Badge>
        )}
      </div>

      <div className="grid gap-3 max-h-96 overflow-y-auto">
        {alerts?.length > 0 ? (
          alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`p-4 cursor-pointer transition-colors ${
                !alert.is_read ? 'bg-blue-50 border-blue-200' : ''
              } hover:bg-gray-50`}
              onClick={() => setSelectedAlert(alert)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{getAlertTypeLabel(alert.alert_type)}</h3>
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(alert.created_at).toLocaleString()}
                  </p>
                </div>
                {!alert.is_read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(alert.id);
                    }}
                    disabled={markAsRead.isPending}
                  >
                    <CheckCircle className="w-4 h-4 text-blue-500" />
                  </Button>
                )}
              </div>
            </Card>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No alerts</p>
        )}
      </div>

      {selectedAlert && (
        <Card className="p-4 border-l-4 border-blue-500 bg-blue-50">
          <h4 className="font-semibold mb-2">Alert Details</h4>
          <p className="text-sm text-gray-700">{selectedAlert.message}</p>
          {!selectedAlert.is_read && (
            <Button
              className="mt-4"
              onClick={() => handleMarkAsRead(selectedAlert.id)}
              disabled={markAsRead.isPending}
            >
              Mark as Read
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
