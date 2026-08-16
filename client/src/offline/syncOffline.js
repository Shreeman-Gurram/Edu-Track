import { getPendingActivities, deleteActivity } from './activityStorage';
import { getPackage } from './packageStorage';
import { syncOfflineActivity } from '../api/offlineApi';

let isSyncing = false;

export async function syncPendingActivities() {
  if (isSyncing) {
    return { success: false, message: 'Sync is already in progress' };
  }

  const activities = await getPendingActivities();
  if (!activities || !activities.length) {
    return { success: true, syncedCount: 0, failedCount: 0 };
  }

  const pkg = await getPackage();
  const packageVersion = pkg ? pkg.version : 1;

  isSyncing = true;
  try {
    const response = await syncOfflineActivity({
      packageVersion,
      activities
    });

    if (response.success) {
      const syncedItems = response.synced || [];
      const failedItems = response.failed || [];

      // Delete successfully synced activities from IndexedDB
      for (const item of syncedItems) {
        if (item.activityId) {
          await deleteActivity(item.activityId);
        }
      }

      return {
        success: true,
        syncedCount: syncedItems.length,
        failedCount: failedItems.length,
        currentVersion: response.currentVersion,
        packageOutdated: response.packageOutdated,
        failed: failedItems
      };
    } else {
      throw new Error(response.message || 'Sync failed on server');
    }
  } catch (error) {
    console.error('Offline synchronization error:', error);
    return {
      success: false,
      message: error.message || 'Unable to sync. Connection error.',
      syncedCount: 0,
      failedCount: activities.length
    };
  } finally {
    isSyncing = false;
  }
}
