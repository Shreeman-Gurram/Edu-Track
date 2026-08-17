import { openDB } from './db';

export function savePackage(pkg) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('learningPackages', 'readwrite');
      const store = transaction.objectStore('learningPackages');
      const request = store.put(pkg);

      request.onsuccess = () => {
        resolve(pkg);
      };

      request.onerror = () => {
        reject(new Error('Failed to save learning package'));
      };
    });
  });
}

export function getPackage(id = null) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('learningPackages', 'readonly');
      const store = transaction.objectStore('learningPackages');
      const request = id ? store.get(id) : store.getAll();

      request.onsuccess = () => {
        const result = request.result;
        if (id) {
          resolve(result || null);
        } else {
          resolve(result && result.length ? result[0] : null);
        }
      };

      request.onerror = () => {
        reject(new Error('Failed to retrieve learning package'));
      };
    });
  });
}

export function getPackages() {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('learningPackages', 'readonly');
      const store = transaction.objectStore('learningPackages');
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = () => {
        reject(new Error('Failed to retrieve learning packages'));
      };
    });
  });
}

export function deletePackage(id) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('learningPackages', 'readwrite');
      const store = transaction.objectStore('learningPackages');
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to delete learning package'));
      };
    });
  });
}

export function clearPackages() {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('learningPackages', 'readwrite');
      const store = transaction.objectStore('learningPackages');
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error('Failed to clear learning packages'));
      };
    });
  });
}
