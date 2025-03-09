
/**
 * API service to allow external applications to interact with LocalDataHaven storage
 */

import { v4 as uuidv4 } from 'uuid';
import { FileData, StorageData } from '@/hooks/useLocalStorage';

// Constants
const STORAGE_KEY = 'local_data_haven';
const API_KEY_STORAGE = 'local_data_haven_api_key';

// Types
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Get or generate API key for authentication
export const getOrCreateApiKey = (): string => {
  let apiKey = localStorage.getItem(API_KEY_STORAGE);
  
  if (!apiKey) {
    apiKey = `ldh_${uuidv4().replace(/-/g, '')}`;
    localStorage.setItem(API_KEY_STORAGE, apiKey);
  }
  
  return apiKey;
};

// Validate API key
const validateApiKey = (providedKey: string): boolean => {
  const storedKey = localStorage.getItem(API_KEY_STORAGE);
  return storedKey === providedKey;
};

// Get all files
export const getAllFiles = (apiKey: string): ApiResponse<FileData[]> => {
  if (!validateApiKey(apiKey)) {
    return { success: false, error: 'Invalid API key' };
  }
  
  try {
    const data = getStorageData();
    return { success: true, data: data.files };
  } catch (error) {
    console.error('API error:', error);
    return { success: false, error: 'Failed to retrieve files' };
  }
};

// Get a specific file by ID
export const getFileById = (apiKey: string, fileId: string): ApiResponse<FileData> => {
  if (!validateApiKey(apiKey)) {
    return { success: false, error: 'Invalid API key' };
  }
  
  try {
    const data = getStorageData();
    const file = data.files.find(f => f.id === fileId);
    
    if (!file) {
      return { success: false, error: 'File not found' };
    }
    
    return { success: true, data: file };
  } catch (error) {
    console.error('API error:', error);
    return { success: false, error: 'Failed to retrieve file' };
  }
};

// Add or update a file
export const saveFile = (apiKey: string, file: Omit<FileData, 'id'>): ApiResponse<FileData> => {
  if (!validateApiKey(apiKey)) {
    return { success: false, error: 'Invalid API key' };
  }
  
  try {
    const data = getStorageData();
    const newFile: FileData = {
      ...file,
      id: uuidv4(),
      lastModified: Date.now()
    };
    
    data.files.push(newFile);
    data.totalSize = data.files.reduce((sum, f) => sum + f.size, 0);
    data.lastUpdated = Date.now();
    
    saveStorageData(data);
    
    return { success: true, data: newFile };
  } catch (error) {
    console.error('API error:', error);
    return { success: false, error: 'Failed to save file' };
  }
};

// Update an existing file
export const updateFile = (apiKey: string, fileId: string, updates: Partial<FileData>): ApiResponse<FileData> => {
  if (!validateApiKey(apiKey)) {
    return { success: false, error: 'Invalid API key' };
  }
  
  try {
    const data = getStorageData();
    const fileIndex = data.files.findIndex(f => f.id === fileId);
    
    if (fileIndex === -1) {
      return { success: false, error: 'File not found' };
    }
    
    const updatedFile = {
      ...data.files[fileIndex],
      ...updates,
      lastModified: Date.now()
    };
    
    data.files[fileIndex] = updatedFile;
    data.totalSize = data.files.reduce((sum, f) => sum + f.size, 0);
    data.lastUpdated = Date.now();
    
    saveStorageData(data);
    
    return { success: true, data: updatedFile };
  } catch (error) {
    console.error('API error:', error);
    return { success: false, error: 'Failed to update file' };
  }
};

// Delete a file
export const deleteFile = (apiKey: string, fileId: string): ApiResponse<{ deleted: boolean }> => {
  if (!validateApiKey(apiKey)) {
    return { success: false, error: 'Invalid API key' };
  }
  
  try {
    const data = getStorageData();
    const initialLength = data.files.length;
    
    data.files = data.files.filter(f => f.id !== fileId);
    
    if (data.files.length === initialLength) {
      return { success: false, error: 'File not found' };
    }
    
    data.totalSize = data.files.reduce((sum, f) => sum + f.size, 0);
    data.lastUpdated = Date.now();
    
    saveStorageData(data);
    
    return { success: true, data: { deleted: true } };
  } catch (error) {
    console.error('API error:', error);
    return { success: false, error: 'Failed to delete file' };
  }
};

// Get storage stats
export const getStorageStats = (apiKey: string): ApiResponse<Omit<StorageData, 'files'>> => {
  if (!validateApiKey(apiKey)) {
    return { success: false, error: 'Invalid API key' };
  }
  
  try {
    const data = getStorageData();
    const { files, ...stats } = data;
    
    return { 
      success: true, 
      data: { 
        ...stats,
        fileCount: files.length 
      }
    };
  } catch (error) {
    console.error('API error:', error);
    return { success: false, error: 'Failed to retrieve storage stats' };
  }
};

// Helper to get storage data
const getStorageData = (): StorageData => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) {
    const initialData: StorageData = {
      files: [],
      totalSize: 0,
      lastUpdated: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(storedData);
};

// Helper to save storage data
const saveStorageData = (data: StorageData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
