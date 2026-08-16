import { openDB } from './db';

export function savePackage(pkg) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('learningPackages', 'readwrite');
      const store = transaction.objectStore('learningPackages');

      // Clear existing packages first
      const clearRequest = store.clear();

      clearRequest.onsuccess = () => {
        const addRequest = store.put(pkg);

        addRequest.onsuccess = () => {
          resolve(pkg);
        };

        addRequest.onerror = () => {
          reject(new Error('Failed to save learning package'));
        };
      };

      clearRequest.onerror = () => {
        reject(new Error('Failed to clear old learning packages'));
      };
    });
  });
}

export function getPackage() {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('learningPackages', 'readonly');
      const store = transaction.objectStore('learningPackages');
      const request = store.getAll();

      request.onsuccess = () => {
        const packages = request.result;
        resolve(packages && packages.length ? packages[0] : null);
      };

      request.onerror = () => {
        reject(new Error('Failed to retrieve learning package'));
      };
    });
  });
}
