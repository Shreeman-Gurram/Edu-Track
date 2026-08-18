import { openDB } from './db';
import { getCurrentUserFromStorage } from '../services/apiClient';

export function savePackage(pkg) {
  const user = getCurrentUserFromStorage();
  if (user && user.id) {
    pkg.userId = user.id;
  }
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
  const user = getCurrentUserFromStorage();
  const userId = user ? user.id : null;
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('learningPackages', 'readonly');
      const store = transaction.objectStore('learningPackages');
      const request = id ? store.get(id) : store.getAll();

      request.onsuccess = () => {
        const result = request.result;
        if (id) {
          if (result && result.userId === userId) {
            resolve(result);
          } else {
            resolve(null);
          }
        } else {
          const userPkgs = (result || []).filter((p) => p.userId === userId);
          resolve(userPkgs.length ? userPkgs[0] : null);
        }
      };

      request.onerror = () => {
        reject(new Error('Failed to retrieve learning package'));
      };
    });
  });
}

export function getPackages() {
  const user = getCurrentUserFromStorage();
  const userId = user ? user.id : null;
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('learningPackages', 'readonly');
      const store = transaction.objectStore('learningPackages');
      const request = store.getAll();

      request.onsuccess = () => {
        const allPkgs = request.result || [];
        if (userId) {
          resolve(allPkgs.filter((pkg) => pkg.userId === userId));
        } else {
          resolve([]);
        }
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
