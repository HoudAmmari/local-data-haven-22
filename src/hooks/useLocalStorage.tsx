
import { useState, useEffect, useCallback } from 'react';

export type FileData = {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: number;
  content: string | ArrayBuffer | null;
  path?: string;
};

export type StorageData = {
  files: FileData[];
  totalSize: number;
  lastUpdated: number;
};

const STORAGE_KEY = 'local_data_haven';

const initialStorageData: StorageData = {
  files: [],
  totalSize: 0,
  lastUpdated: Date.now(),
};

const isStorageAvailable = (type: string): boolean => {
  try {
    const storage = window[type as "localStorage" | "sessionStorage"];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
};

export const useLocalStorage = () => {
  const [data, setData] = useState<StorageData>(initialStorageData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      try {
        if (!isStorageAvailable('localStorage')) {
          throw new Error('localStorage is not available');
        }
        
        const storedData = localStorage.getItem(STORAGE_KEY);
        
        if (storedData) {
          setData(JSON.parse(storedData));
        } else {
          // Initialize with empty data
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStorageData));
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading data from localStorage:', err);
        setError('Failed to load data from storage');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading && !error) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        console.error('Error saving data to localStorage:', err);
        setError('Failed to save data to storage');
      }
    }
  }, [data, isLoading, error]);
  
  const addFile = useCallback((file: FileData) => {
    setData((prevData) => {
      // Check if file with same id already exists
      const fileExists = prevData.files.some((f) => f.id === file.id);
      
      let newFiles;
      if (fileExists) {
        // Update existing file
        newFiles = prevData.files.map((f) => (f.id === file.id ? file : f));
      } else {
        // Add new file
        newFiles = [...prevData.files, file];
      }
      
      // Calculate new total size
      const newTotalSize = newFiles.reduce((sum, f) => sum + f.size, 0);
      
      return {
        files: newFiles,
        totalSize: newTotalSize,
        lastUpdated: Date.now(),
      };
    });
  }, []);
  
  const deleteFile = useCallback((fileId: string) => {
    setData((prevData) => {
      const newFiles = prevData.files.filter((f) => f.id !== fileId);
      const newTotalSize = newFiles.reduce((sum, f) => sum + f.size, 0);
      
      return {
        files: newFiles,
        totalSize: newTotalSize,
        lastUpdated: Date.now(),
      };
    });
  }, []);
  
  const clearAllFiles = useCallback(() => {
    setData({
      files: [],
      totalSize: 0,
      lastUpdated: Date.now(),
    });
  }, []);
  
  return {
    data,
    isLoading,
    error,
    addFile,
    deleteFile,
    clearAllFiles,
  };
};
