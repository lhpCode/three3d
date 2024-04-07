/**
 *
 * @param dbName 数据库名称
 * @param storeName 仓库名称
 * @param version 版本号
 * @returns
 */
export const openDB = (dbName: string, storeName: string, version: number) => {
  if (!indexedDB) return;
  return new Promise((res, rej) => {
    const request = window.indexedDB.open(dbName, version);
    request.onerror = (event) => {
      rej(event);
    };
    request.onsuccess = (event: any) => {
      if (!event) {
        return rej(event);
      }
      const db = event.target.result;
      res(db);
    };
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore(storeName, { keyPath: "path" });
      objectStore.createIndex("model", "model");
    };
  });
};

export const addData = (db: any, storeName: string, data: any) => {
  return new Promise((res, rej) => {
    const transaction = db.transaction([storeName], "readwrite");
    transaction.oncomplete = (event: any) => {
      res(event);
    };
    transaction.onerror = (event: any) => {
      rej(event);
    };
    const objectStore = transaction.objectStore(storeName);
    objectStore.put(data);
  });
};

export const getData = (db: any, storeName: string, path: string) => {
  return new Promise((res, rej) => {
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.get(path);
    request.onerror = (event: any) => {
      rej(event);
    };
    request.onsuccess = (event: any) => {
      res(event.target.result);
    };
  });
};
