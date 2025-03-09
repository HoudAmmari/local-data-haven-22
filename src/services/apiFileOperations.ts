
/**
 * File operation services for the LocalDataHaven API
 */

import { v4 as uuidv4 } from 'uuid';
import { FileData } from '@/hooks/useLocalStorage';
import { ApiResponse } from './apiTypes';
import { validateApiKey } from './apiKey';
import {
  getAllFilesFromDB,
  getFileByIdFromDB,
  saveFileToDB,
  deleteFileFromDB
} from './indexedDBService';

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
