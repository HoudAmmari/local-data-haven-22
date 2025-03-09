
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/Layout/PageLayout';
import { getOrCreateApiKey } from '@/services/apiService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Copy, AlertCircle, Cpu, Database, Key, LucideIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ApiEndpoint = ({ 
  method, 
  path, 
  description, 
  responseExample 
}: { 
  method: string; 
  path: string; 
  description: string; 
  responseExample?: string;
}) => {
  return (
    <div className="border rounded-md mb-4 overflow-hidden">
      <div className="flex items-center gap-2 p-3 bg-muted/50">
        <span className={`text-xs font-mono px-2 py-1 rounded ${
          method === 'GET' ? 'bg-blue-100 text-blue-800' : 
          method === 'POST' ? 'bg-green-100 text-green-800' : 
          method === 'PUT' ? 'bg-amber-100 text-amber-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {method}
        </span>
        <code className="text-sm font-mono flex-1">{path}</code>
      </div>
      <div className="p-3 text-sm">
        <p className="text-muted-foreground mb-3">{description}</p>
        {responseExample && (
          <div className="mt-2">
            <div className="text-xs text-muted-foreground mb-1">Example response:</div>
            <pre className="bg-muted p-2 rounded text-xs overflow-auto">
              {responseExample}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: LucideIcon; 
  title: string; 
  description: string;
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="mb-2 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

const Api = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const { toast } = useToast();
  
  useEffect(() => {
    setApiKey(getOrCreateApiKey());
  }, []);
  
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    
    toast({
      title: "API key copied",
      description: "The API key has been copied to your clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleResetApiKey = () => {
    if (confirm("Are you sure you want to reset your API key? All external applications will need to be updated with the new key.")) {
      const newApiKey = `ldh_${crypto.randomUUID().replace(/-/g, '')}`;
      localStorage.setItem('local_data_haven_api_key', newApiKey);
      setApiKey(newApiKey);
      
      toast({
        title: "API key reset",
        description: "A new API key has been generated",
      });
    }
  };
  
  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Access</h1>
        <p className="text-muted-foreground">
          Connect other applications to your local storage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <FeatureCard 
          icon={Database} 
          title="Local Database" 
          description="Access your files and data through a simple REST-like API interface."
        />
        <FeatureCard 
          icon={Cpu} 
          title="Application Integration" 
          description="Easily connect other web applications to your LocalDataHaven storage."
        />
        <FeatureCard 
          icon={Key} 
          title="Secure Access" 
          description="Use your API key to ensure only authorized applications can access your data."
        />
      </div>
      
      <Card className="mb-8 shadow-subtle">
        <CardHeader>
          <CardTitle>Your API Key</CardTitle>
          <CardDescription>
            Use this key to authenticate API requests from your applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Input 
              value={apiKey} 
              readOnly 
              className="font-mono"
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleCopyApiKey}
              title="Copy API key"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Keep your API key safe</AlertTitle>
            <AlertDescription>
              Anyone with this key can access your stored data. Don't share it publicly.
            </AlertDescription>
          </Alert>
          
          <Button 
            variant="outline" 
            onClick={handleResetApiKey} 
            className="w-full sm:w-auto"
          >
            Reset API Key
          </Button>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="endpoints" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Usage Examples</TabsTrigger>
        </TabsList>
        
        <TabsContent value="endpoints" className="animate-fade-in">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">API Reference</h3>
            <p className="text-muted-foreground mb-6">
              Use these endpoints to interact with your local storage from other applications.
              All requests should include your API key in the <code className="text-xs bg-muted px-1 py-0.5 rounded">x-api-key</code> header.
            </p>
            
            <ApiEndpoint 
              method="GET" 
              path="http://localhost:3000/api/files" 
              description="Get a list of all stored files"
              responseExample={`{
  "success": true,
  "data": [
    {
      "id": "1234",
      "name": "document.pdf",
      "type": "application/pdf",
      "size": 12345,
      "lastModified": 1625046000000,
      "content": "data:application/pdf;base64,..."
    }
  ]
}`}
            />
            
            <ApiEndpoint 
              method="GET" 
              path="http://localhost:3000/api/files/:id" 
              description="Get a specific file by its ID"
              responseExample={`{
  "success": true,
  "data": {
    "id": "1234",
    "name": "document.pdf",
    "type": "application/pdf",
    "size": 12345,
    "lastModified": 1625046000000,
    "content": "data:application/pdf;base64,..."
  }
}`}
            />
            
            <ApiEndpoint 
              method="POST" 
              path="http://localhost:3000/api/files" 
              description="Add a new file to storage"
              responseExample={`{
  "success": true,
  "data": {
    "id": "5678",
    "name": "newfile.jpg",
    "type": "image/jpeg",
    "size": 67890,
    "lastModified": 1625046000000,
    "content": "data:image/jpeg;base64,..."
  }
}`}
            />
            
            <ApiEndpoint 
              method="PUT" 
              path="http://localhost:3000/api/files/:id" 
              description="Update an existing file"
              responseExample={`{
  "success": true,
  "data": {
    "id": "1234",
    "name": "updated-document.pdf",
    "type": "application/pdf",
    "size": 12345,
    "lastModified": 1625046000000,
    "content": "data:application/pdf;base64,..."
  }
}`}
            />
            
            <ApiEndpoint 
              method="DELETE" 
              path="http://localhost:3000/api/files/:id" 
              description="Delete a file from storage"
              responseExample={`{
  "success": true,
  "data": {
    "deleted": true
  }
}`}
            />
            
            <ApiEndpoint 
              method="GET" 
              path="http://localhost:3000/api/stats" 
              description="Get storage statistics"
              responseExample={`{
  "success": true,
  "data": {
    "totalSize": 1234567,
    "lastUpdated": 1625046000000,
    "fileCount": 15
  }
}`}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="examples" className="animate-fade-in">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">JavaScript Example</h3>
            <p className="text-muted-foreground mb-4">
              Use this code snippet to connect to your LocalDataHaven from another application:
            </p>
            
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm mb-8">
{`// Example: Fetching all files from LocalDataHaven
const API_KEY = '${apiKey}'; // Your API key
const BASE_URL = 'http://localhost:3000/api';

async function fetchFiles() {
  try {
    const response = await fetch(\`\${BASE_URL}/files\`, {
      method: 'GET',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Files:', data.data);
      return data.data;
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Failed to fetch files:', error);
  }
}

// Example: Saving a file to LocalDataHaven
async function saveFile(fileData) {
  try {
    const response = await fetch(\`\${BASE_URL}/files\`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fileData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('File saved:', data.data);
      return data.data;
    } else {
      console.error('Error:', data.error);
    }
  } catch (error) {
    console.error('Failed to save file:', error);
  }
}`}
            </pre>
            
            <h3 className="text-lg font-medium mb-2">React Hook Example</h3>
            <p className="text-muted-foreground mb-4">
              Create a custom hook to interact with LocalDataHaven in your React applications:
            </p>
            
            <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
{`// useLocalDataHaven.js
import { useState, useCallback } from 'react';

export function useLocalDataHaven() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const API_KEY = '${apiKey}'; // Your API key
  const BASE_URL = 'http://localhost:3000/api';
  
  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(\`\${BASE_URL}/files\`, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLoading(false);
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  }, []);
  
  const saveFile = useCallback(async (fileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(\`\${BASE_URL}/files\`, {
        method: 'POST',
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fileData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setLoading(false);
        return data.data;
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  }, []);

  return {
    fetchFiles,
    saveFile,
    loading,
    error
  };
}`}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Api;
