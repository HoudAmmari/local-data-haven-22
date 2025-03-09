
/**
 * API Server that handles API requests from external applications
 */

import {
  getAllFiles,
  getFileById,
  saveFile,
  updateFile,
  deleteFile,
  getStorageStats
} from './apiService';

// Endpoints to handle
const endpoints = [
  '/api/files',
  '/api/files/:id',
  '/api/stats'
];

// Listen for fetch events to intercept API requests
export const setupApiServer = () => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') return;

  // Create an Origin Trial token for SharedArrayBuffer (if needed)
  const originalFetch = window.fetch;
  
  // Override fetch to intercept API calls
  window.fetch = function(input, init) {
    // Convert URL objects to strings to ensure compatibility
    const inputUrl = input instanceof URL ? input.toString() : input;
    
    const url = inputUrl instanceof Request ? inputUrl.url : String(inputUrl);
    const method = inputUrl instanceof Request 
      ? inputUrl.method 
      : (init?.method || 'GET');
    
    // Check if this is an API request
    const isApiRequest = endpoints.some(endpoint => {
      if (endpoint.includes(':id')) {
        const pattern = endpoint.replace(':id', '[^/]+');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(new URL(url, window.location.origin).pathname);
      }
      return new URL(url, window.location.origin).pathname === endpoint;
    });
    
    if (isApiRequest) {
      return handleApiRequest(url, method, inputUrl, init);
    }
    
    // Not an API request, pass through to original fetch
    return originalFetch.apply(this, [inputUrl, init]);
  };
  
  console.log('LocalDataHaven API server is running with IndexedDB storage');
};

// Handle API requests
const handleApiRequest = async (url: string, method: string, input: RequestInfo, init?: RequestInit) => {
  const apiUrl = new URL(url, window.location.origin);
  const pathname = apiUrl.pathname;
  
  // Get the API key from headers
  const apiKey = init?.headers instanceof Headers 
    ? init.headers.get('x-api-key')
    : typeof init?.headers === 'object' && init?.headers
      ? (init.headers as Record<string, string>)['x-api-key']
      : null;
  
  if (!apiKey) {
    return createResponse({ success: false, error: 'API key is required' }, 401);
  }
  
  try {
    // Route the request to the appropriate handler
    if (pathname === '/api/files') {
      if (method === 'GET') {
        const result = await getAllFiles(apiKey);
        return createResponse(result, result.success ? 200 : 401);
      } else if (method === 'POST') {
        const body = await getRequestBody(input, init);
        const result = await saveFile(apiKey, body);
        return createResponse(result, result.success ? 201 : 401);
      }
    } 
    else if (pathname.match(/^\/api\/files\/[^/]+$/)) {
      const fileId = pathname.split('/').pop() || '';
      
      if (method === 'GET') {
        const result = await getFileById(apiKey, fileId);
        return createResponse(result, result.success ? 200 : result.error === 'File not found' ? 404 : 401);
      } 
      else if (method === 'PUT') {
        const body = await getRequestBody(input, init);
        const result = await updateFile(apiKey, fileId, body);
        return createResponse(result, result.success ? 200 : result.error === 'File not found' ? 404 : 401);
      } 
      else if (method === 'DELETE') {
        const result = await deleteFile(apiKey, fileId);
        return createResponse(result, result.success ? 200 : result.error === 'File not found' ? 404 : 401);
      }
    } 
    else if (pathname === '/api/stats') {
      if (method === 'GET') {
        const result = await getStorageStats(apiKey);
        return createResponse(result, result.success ? 200 : 401);
      }
    }
    
    // If we got here, the endpoint or method is not supported
    return createResponse({ success: false, error: 'Not found' }, 404);
  } catch (error) {
    console.error('API server error:', error);
    return createResponse({ success: false, error: 'Internal server error' }, 500);
  }
};

// Create a Response object with appropriate headers
const createResponse = (data: any, status: number) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'x-api-key, Content-Type'
    }
  });
};

// Extract the request body
const getRequestBody = async (input: RequestInfo, init?: RequestInit) => {
  if (input instanceof Request) {
    const clonedRequest = input.clone();
    return await clonedRequest.json();
  } else if (init?.body) {
    return typeof init.body === 'string' 
      ? JSON.parse(init.body) 
      : init.body;
  }
  return {};
};
