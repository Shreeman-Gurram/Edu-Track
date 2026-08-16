const DB_NAME = 'edu-track-offline';
const DB_VERSION = 1;

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Failed to open offline database'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;

      if (!db.objectStoreNames.contains('learningPackages')) {
        db.createObjectStore('learningPackages', { keyPath: 'id' });
      }

      if (!db.objectStoreNames.contains('activities')) {
        db.createObjectStore('activities', { keyPath: 'activityId' });
      }
    };
  });
}
