
import { useState, useEffect, useCallback } from 'react';
import { 
  getAllFilesFromDB, 
  saveFileToDB, 
  deleteFileFromDB, 
  clearAllData, 
  getStorageStatsFromDB 
} from '@/services/indexedDBService';

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
  fileCount?: number;
};

const initialStorageData: StorageData = {
  files: [],
  totalSize: 0,
  lastUpdated: Date.now(),
};

export const useLocalStorage = () => {
  const [data, setData] = useState<StorageData>(initialStorageData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load data from IndexedDB on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const files = await getAllFilesFromDB();
        const stats = await getStorageStatsFromDB();
        
        setData({
          files,
          totalSize: stats.totalSize,
          lastUpdated: stats.lastUpdated,
          fileCount: stats.fileCount
        });
        
        setError(null);
      } catch (err) {
        console.error('Error loading data from IndexedDB:', err);
        setError('Failed to load data from storage');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const addFile = useCallback(async (file: FileData) => {
    try {
      await saveFileToDB(file);
      
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
          fileCount: newFiles.length
        };
      });
    } catch (err) {
      console.error('Error saving file to IndexedDB:', err);
      setError('Failed to save file to storage');
    }
  }, []);
  
  const deleteFile = useCallback(async (fileId: string) => {
    try {
      await deleteFileFromDB(fileId);
      
      setData((prevData) => {
        const newFiles = prevData.files.filter((f) => f.id !== fileId);
        const newTotalSize = newFiles.reduce((sum, f) => sum + f.size, 0);
        
        return {
          files: newFiles,
          totalSize: newTotalSize,
          lastUpdated: Date.now(),
          fileCount: newFiles.length
        };
      });
    } catch (err) {
      console.error('Error deleting file from IndexedDB:', err);
      setError('Failed to delete file from storage');
    }
  }, []);
  
  const clearAllFiles = useCallback(async () => {
    try {
      await clearAllData();
      
      setData({
        files: [],
        totalSize: 0,
        lastUpdated: Date.now(),
        fileCount: 0
      });
    } catch (err) {
      console.error('Error clearing data from IndexedDB:', err);
      setError('Failed to clear storage');
    }
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
