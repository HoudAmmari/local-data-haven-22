
/**
 * API service to allow external applications to interact with LocalDataHaven storage
 * This file re-exports functionality from specialized service modules
 */

// Re-export everything from specialized modules
export { getOrCreateApiKey } from './apiKey';
export { 
  getAllFiles, 
  getFileById, 
  saveFile, 
  updateFile, 
  deleteFile 
} from './apiFileOperations';
export { getStorageStats } from './apiStorageStats';
export type { ApiResponse } from './apiTypes';
