
/**
 * Storage statistics services for the LocalDataHaven API
 */

import { ApiResponse, StorageStatsResponse } from './apiTypes';
import { validateApiKey } from './apiKey';
import { getStorageStatsFromDB } from './indexedDBService';

// Get storage stats
export const getStorageStats = async (apiKey: string): Promise<ApiResponse<StorageStatsResponse>> => {
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
