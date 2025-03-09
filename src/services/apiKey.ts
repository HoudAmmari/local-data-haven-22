
/**
 * API key management for LocalDataHaven
 */

// Constants
const API_KEY_STORAGE = 'local_data_haven_api_key';

import { v4 as uuidv4 } from 'uuid';

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
export const validateApiKey = (providedKey: string): boolean => {
  const storedKey = localStorage.getItem(API_KEY_STORAGE);
  return storedKey === providedKey;
};
