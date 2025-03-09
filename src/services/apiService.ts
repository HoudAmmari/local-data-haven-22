
/**
 * API service to allow external applications to interact with LocalDataHaven storage
 */

import { v4 as uuidv4 } from 'uuid';
import { FileData, StorageData } from '@/hooks/useLocalStorage';
import {
  getAllFilesFromDB,
  getFileByIdFromDB,
  saveFileToDB,
  deleteFileFromDB,
  getStorageStatsFromDB
} from './indexedDBService';

// Constants
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
export const getAllFiles = async (apiKey: string): Promise<ApiResponse<FileData[]>> => {
  if (!validateApiKey(apiKey)) {
    return { success: false, error: 'Invalid API key' };
  }
  
  try {
    const files = await getAllFilesFromDB();
    return { success: true, data: files };
  } catch (error) {
    console.error('API error:', error);
    return { success: false, error: 'Failed to retrieve files' };
  }
};

// Get a specific file by ID
export const getFileById = async (apiKey: string, fileId: string): Promise<ApiResponse<FileData>> => {
  if (!validateApiKey(apiKey)) {
    return { success: false, error: 'Invalid API key' };
  }
  
  try {
    const file = await getFileByIdFromDB(fileId);
    
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
export const saveFile = async (apiKey: string, file: Omit<FileData, 'id'>): Promise<ApiResponse<FileData>> => {
  if (!validateApiKey(apiKey)) {
    return { success: false, error: 'Invalid API key' };
  }
  
  try {
    const newFile: FileData = {
      ...file,
      id: uuidv4(),
      lastModified: Date.now()
    };
    
    await saveFileToDB(newFile);
    
    return { success: true, data: newFile };
  } catch (error) {
    console.error('API error:', error);
    return { success: false, error: 'Failed to save file' };
  }
};

// Update an existing file
export const updateFile = async (apiKey: string, fileId: string, updates: Partial<FileData>): Promise<ApiResponse<FileData>> => {
  if (!validateApiKey(apiKey)) {
    return { success: false, error: 'Invalid API key' };
  }
  
  try {
    const existingFile = await getFileByIdFromDB(fileId);
    
    if (!existingFile) {
      return { success: false, error: 'File not found' };
    }
    
    const updatedFile = {
      ...existingFile,
      ...updates,
      lastModified: Date.now()
    };
    
    await saveFileToDB(updatedFile);
    
    return { success: true, data: updatedFile };
  } catch (error) {
    console.error('API error:', error);
    return { success: false, error: 'Failed to update file' };
  }
};

// Delete a file
export const deleteFile = async (apiKey: string, fileId: string): Promise<ApiResponse<{ deleted: boolean }>> => {
  if (!validateApiKey(apiKey)) {
    return { success: false, error: 'Invalid API key' };
  }
  
  try {
    const existingFile = await getFileByIdFromDB(fileId);
    
    if (!existingFile) {
      return { success: false, error: 'File not found' };
    }
    
    await deleteFileFromDB(fileId);
    
    return { success: true, data: { deleted: true } };
  } catch (error) {
    console.error('API error:', error);
    return { success: false, error: 'Failed to delete file' };
  }
};

// Get storage stats
export const getStorageStats = async (apiKey: string): Promise<ApiResponse<Omit<StorageData, 'files'> & { fileCount: number }>> => {
  if (!validateApiKey(apiKey)) {
    return { success: false, error: 'Invalid API key' };
  }
  
  try {
    const stats = await getStorageStatsFromDB();
    
    return { 
      success: true, 
      data: stats
    };
  } catch (error) {
    console.error('API error:', error);
    return { success: false, error: 'Failed to retrieve storage stats' };
  }
};
