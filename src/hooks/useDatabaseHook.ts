// Custom Hook for Database Operations
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  userService,
  asteroidDetailService,
  watchlistService,
  alertService,
  databaseService,
} from '@/services/database';
import authService from '@/services/auth';
import type { Asteroid } from '@/types/asteroid';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

// ===== USER HOOKS =====
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    const isAuthenticated = authService.isAuthenticated();
    
    if (isAuthenticated && currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  return { user, loading, isAuthenticated: !!user };
}

export function useUser(userId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getUser(userId),
    enabled: !!userId,
  });

  return {
    user: data?.data?.data,
    loading: isLoading,
    error,
  };
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: string; userData: any }) =>
      userService.updateUser(userId, userData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      if (data.data?.data) {
        localStorage.setItem('user', JSON.stringify(data.data.data));
      }
    },
  });

  return mutation;
}

// ===== ASTEROID HOOKS =====
export function useAsteroids(page = 1, limit = 20, filters = {}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['asteroids', page, limit, filters],
    queryFn: () => asteroidDetailService.getAllAsteroids(page, limit, filters),
  });

  return {
    asteroids: (data?.data?.data || []) as Asteroid[],
    total: data?.data?.total as number,
    loading: isLoading,
    error,
  };
}

export function useAsteroid(asteroidId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['asteroid', asteroidId],
    queryFn: () => asteroidDetailService.getAsteroid(asteroidId),
    enabled: !!asteroidId,
  });

  return {
    asteroid: data?.data?.data as Asteroid,
    loading: isLoading,
    error,
  };
}

export function useHighRiskAsteroids(limit = 10) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['asteroids', 'high-risk'],
    queryFn: () => asteroidDetailService.getHighRiskAsteroids(limit),
  });

  return {
    asteroids: (data?.data?.data || []) as Asteroid[],
    loading: isLoading,
    error,
  };
}

export function useCloseApproachingAsteroids(limit = 10) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['asteroids', 'close-approaching'],
    queryFn: () => asteroidDetailService.getCloseApproaching(limit),
  });

  return {
    asteroids: (data?.data?.data || []) as Asteroid[],
    loading: isLoading,
    error,
  };
}

export function useSearchAsteroids(query: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['asteroids', 'search', query],
    queryFn: () => asteroidDetailService.searchAsteroids(query),
    enabled: !!query && query.length > 0,
  });

  return {
    results: (data?.data?.data || []) as Asteroid[],
    loading: isLoading,
    error,
  };
}

// ===== WATCHLIST HOOKS =====
export function useWatchlist(userId: string, page = 1, limit = 20) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['watchlist', userId, page, limit],
    queryFn: () => watchlistService.getWatchlist(userId, page, limit),
    enabled: !!userId,
  });

  return {
    watchlist: data?.data?.data || [],
    total: data?.data?.total,
    loading: isLoading,
    error,
  };
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ userId, asteroidId, notes }: { userId: string; asteroidId: string; notes?: string }) =>
      watchlistService.addToWatchlist(userId, asteroidId, notes),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', variables.userId] });
    },
  });

  return mutation;
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (watchlistId: string) =>
      watchlistService.removeFromWatchlist(watchlistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });

  return mutation;
}

export function useIsInWatchlist(userId: string, asteroidId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['watchlist', userId, asteroidId, 'check'],
    queryFn: () => watchlistService.isInWatchlist(userId, asteroidId),
    enabled: !!userId && !!asteroidId,
  });

  return {
    isInWatchlist: data?.data?.data?.is_in_watchlist || false,
    loading: isLoading,
    error,
  };
}

// ===== ALERT HOOKS =====
export function useAlerts(userId: string, page = 1, limit = 20, unreadOnly = false) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['alerts', userId, page, limit, unreadOnly],
    queryFn: () =>
      alertService.getUserAlerts(userId, page, limit, unreadOnly),
    enabled: !!userId,
  });

  return {
    alerts: data?.data?.data || [],
    total: data?.data?.total,
    loading: isLoading,
    error,
  };
}

export function useUnreadAlertCount(userId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['alerts', userId, 'unread-count'],
    queryFn: () => alertService.getUnreadCount(userId),
    enabled: !!userId,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return {
    count: data?.data?.data?.count || 0,
    loading: isLoading,
    error,
  };
}

export function useCreateAlert() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ userId, asteroidId, alertType, message, priority }: any) =>
      alertService.createAlert(userId, asteroidId, alertType, message, priority),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alerts', variables.userId] });
    },
  });

  return mutation;
}

export function useMarkAlertAsRead() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (alertId: string) => alertService.markAsRead(alertId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  return mutation;
}

export function useMarkAllAlertsAsRead() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (userId: string) => alertService.markAllAsRead(userId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['alerts', variables] });
    },
  });

  return mutation;
}

// ===== AUTHENTICATION HOOKS =====
export function useLogin() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ email, password }: any) =>
      authService.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return mutation;
}

export function useRegister() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ username, email, password }: any) =>
      authService.register(username, email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  return mutation;
}

export function useLogout() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });

  return mutation;
}

// ===== COMBINED UTILITY HOOKS =====
export function useDashboard(userId: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => databaseService.getDashboard(userId),
    enabled: !!userId,
  });

  return {
    dashboard: data?.data?.data,
    loading: isLoading,
    error,
  };
}

export function useSyncUserAsteroids(userId: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => databaseService.syncUserAsteroids(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asteroids'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', userId] });
    },
  });

  return mutation;
}
