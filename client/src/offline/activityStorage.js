import { openDB } from './db';
import { getCurrentUserFromStorage } from '../services/apiClient';

export function saveActivity(activity) {
  const user = getCurrentUserFromStorage();
  if (user && user.id) {
    activity.userId = user.id;
  }
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('activities', 'readwrite');
      const store = transaction.objectStore('activities');
      const request = store.put(activity);

      request.onsuccess = () => {
        resolve(activity);
      };

      request.onerror = () => {
        reject(new Error('Failed to save activity'));
      };
    });
  });
}

export function getPendingActivities() {
  const user = getCurrentUserFromStorage();
  const userId = user ? user.id : null;
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('activities', 'readonly');
      const store = transaction.objectStore('activities');
      const request = store.getAll();

      request.onsuccess = () => {
        const allActs = request.result || [];
        if (userId) {
          resolve(allActs.filter((act) => act.userId === userId));
        } else {
          resolve([]);
        }
      };

      request.onerror = () => {
        reject(new Error('Failed to retrieve pending activities'));
      };
    });
  });
}

export function deleteActivity(activityId) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('activities', 'readwrite');
      const store = transaction.objectStore('activities');
      const request = store.delete(activityId);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to delete activity'));
      };
    });
  });
}

export function clearActivities() {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('activities', 'readwrite');
      const store = transaction.objectStore('activities');
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to clear activities'));
      };
    });
  });
}
