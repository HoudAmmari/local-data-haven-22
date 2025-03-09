
import React from 'react';
import PageLayout from '@/components/Layout/PageLayout';
import StorageStats from '@/components/StorageStats';
import DataVisualizer from '@/components/DataVisualizer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Dashboard = () => {
  const { data, isLoading } = useLocalStorage();
  
  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-medium mb-2">Loading your data...</h2>
            <p className="text-muted-foreground">Please wait while we retrieve your storage information.</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your local storage and files
        </p>
      </div>
      
      <StorageStats
        totalSize={data.totalSize}
        fileCount={data.files.length}
        lastUpdated={data.lastUpdated}
        className="mb-8"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <DataVisualizer files={data.files} />
        </div>
        
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common file operations</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button asChild className="w-full justify-start">
              <Link to="/files" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                View All Files
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/files#upload" className="flex items-center">
                <Upload className="h-4 w-4 mr-2" />
                Upload New File
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {data.files.length === 0 ? (
        <Card className="shadow-subtle mb-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <h3 className="text-xl font-medium mb-2">No Files Yet</h3>
              <p className="text-muted-foreground mb-6">
                Get started by uploading your first file to LocalDataHaven
              </p>
              <Button asChild>
                <Link to="/files#upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First File
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-subtle mb-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.files.slice(0, 3).map((file) => (
                <div key={file.id} className="border rounded-lg p-4 transition-all hover:shadow-subtle">
                  <p className="font-medium truncate mb-1">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(file.lastModified).toLocaleDateString()} • {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              ))}
            </div>
            
            {data.files.length > 3 && (
              <div className="mt-4 text-center">
                <Button asChild variant="outline" size="sm">
                  <Link to="/files">
                    View All {data.files.length} Files
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
};

export default Dashboard;
