// Data Synchronization Manager
// Handles syncing data between backend and frontend cache

import { alertService, asteroidDetailService, watchlistService } from '@/services/database';
import { BACKEND_CONFIG } from '@/config/backend';

class DataSyncManager {
  constructor() {
    this.syncTimers = {};
    this.isSyncing = false;
    this.lastSyncTimes = {};
  }

  /**
   * Initialize auto-sync for a user
   */
  async initializeUserSync(userId) {
    if (!userId) return;

    try {
      // Sync asteroids data
      this.startAutoSync('asteroids', async () => {
        return await asteroidDetailService.getAllAsteroids();
      }, BACKEND_CONFIG.POLLING_INTERVALS.ASTEROIDS);

      // Sync user's watchlist
      this.startAutoSync(`watchlist-${userId}`, async () => {
        return await watchlistService.getWatchlist(userId);
      }, BACKEND_CONFIG.POLLING_INTERVALS.ASTEROIDS);

      // Sync user's alerts
      this.startAutoSync(`alerts-${userId}`, async () => {
        return await alertService.getUserAlerts(userId, 1, 20, true);
      }, BACKEND_CONFIG.POLLING_INTERVALS.ALERTS);

      console.log(`Data sync initialized for user: ${userId}`);
    } catch (error) {
      console.error('Failed to initialize data sync:', error);
    }
  }

  /**
   * Start auto-sync for a specific data type
   */
  startAutoSync(key, syncFn, interval) {
    // Clear existing timer if any
    if (this.syncTimers[key]) {
      clearInterval(this.syncTimers[key]);
    }

    // Sync immediately on init
    this.syncData(key, syncFn);

    // Set up recurring sync
    this.syncTimers[key] = setInterval(() => {
      this.syncData(key, syncFn);
    }, interval);
  }

  /**
   * Perform a single sync operation
   */
  async syncData(key, syncFn) {
    if (this.isSyncing) return;

    this.isSyncing = true;
    try {
      const result = await syncFn();
      this.lastSyncTimes[key] = new Date().toISOString();
      console.log(`Synced ${key}:`, result);
      return result;
    } catch (error) {
      console.error(`Sync failed for ${key}:`, error);
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Stop auto-sync for a specific data type
   */
  stopAutoSync(key) {
    if (this.syncTimers[key]) {
      clearInterval(this.syncTimers[key]);
      delete this.syncTimers[key];
    }
  }

  /**
   * Stop all auto-syncs
   */
  stopAllSync() {
    Object.keys(this.syncTimers).forEach((key) => {
      this.stopAutoSync(key);
    });
  }

  /**
   * Get last sync time for a key
   */
  getLastSyncTime(key) {
    return this.lastSyncTimes[key];
  }

  /**
   * Manually trigger sync for specific data
   */
  async manualSync(key, syncFn) {
    return await this.syncData(key, syncFn);
  }

  /**
   * Check if currently syncing
   */
  isCurrentlySyncing() {
    return this.isSyncing;
  }
}

export const dataSyncManager = new DataSyncManager();
export default dataSyncManager;
