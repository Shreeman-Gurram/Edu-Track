import { openDB } from './db';

export function saveActivity(activity) {
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
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('activities', 'readonly');
      const store = transaction.objectStore('activities');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
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
