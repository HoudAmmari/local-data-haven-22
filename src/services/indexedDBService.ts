
/**
 * IndexedDB Service for persistent storage of data to local hard drive
 */

import { v4 as uuidv4 } from 'uuid';
import { FileData, StorageData } from '@/hooks/useLocalStorage';

const DB_NAME = 'LocalDataHavenDB';
const DB_VERSION = 1;
const STORE_NAME = 'files';
const META_STORE_NAME = 'metadata';

// Initialize the database
export const initializeDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error('Database error:', request.error);
      reject(request.error);
    };
    
    request.onsuccess = (event) => {
      const db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create object store for files
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('type', 'type', { unique: false });
        store.createIndex('lastModified', 'lastModified', { unique: false });
      }
      
      // Create object store for metadata
      if (!db.objectStoreNames.contains(META_STORE_NAME)) {
        const metaStore = db.createObjectStore(META_STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Get all files from the database
export const getAllFilesFromDB = async (): Promise<FileData[]> => {
  const db = await initializeDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    
    request.onerror = () => {
      reject(request.error);
    };
    
    request.onsuccess = () => {
      resolve(request.result);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Save file to the database
export const saveFileToDB = async (file: FileData): Promise<void> => {
  const db = await initializeDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(file);
    
    request.onerror = () => {
      reject(request.error);
    };
    
    request.onsuccess = () => {
      resolve();
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Get file by ID
export const getFileByIdFromDB = async (fileId: string): Promise<FileData | null> => {
  const db = await initializeDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(fileId);
    
    request.onerror = () => {
      reject(request.error);
    };
    
    request.onsuccess = () => {
      resolve(request.result || null);
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Delete file from the database
export const deleteFileFromDB = async (fileId: string): Promise<void> => {
  const db = await initializeDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(fileId);
    
    request.onerror = () => {
      reject(request.error);
    };
    
    request.onsuccess = () => {
      resolve();
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};

// Get storage stats
export const getStorageStatsFromDB = async (): Promise<Omit<StorageData, 'files'> & { fileCount: number }> => {
  const files = await getAllFilesFromDB();
  
  return {
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
    lastUpdated: Date.now(),
    fileCount: files.length
  };
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  const db = await initializeDB();
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    
    request.onerror = () => {
      reject(request.error);
    };
    
    request.onsuccess = () => {
      resolve();
    };
    
    transaction.oncomplete = () => {
      db.close();
    };
  });
};
