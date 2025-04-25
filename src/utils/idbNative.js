// src/utils/idbNative.js
const DB_NAME = "ZenMusicDB";
const STORE_NAME = "media";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveFileToDB(key, file) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).put(file, key);
  return tx.complete;
}

export async function getFileFromDB(key) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const file = await new Promise((resolve) => {
    const req = tx.objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
  return file;
}

export async function deleteFileFromDB(key) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).delete(key);
  return tx.complete;
}
