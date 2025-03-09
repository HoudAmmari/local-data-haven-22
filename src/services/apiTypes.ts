
/**
 * API types and utilities for LocalDataHaven
 */

import { FileData, StorageData } from '@/hooks/useLocalStorage';

// API Response type
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Storage stats response type
export type StorageStatsResponse = Omit<StorageData, 'files'> & { fileCount: number };
