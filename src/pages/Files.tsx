
import React, { useEffect, useRef } from 'react';
import PageLayout from '@/components/Layout/PageLayout';
import FileUploader from '@/components/FileUploader';
import FileTable from '@/components/FileTable';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'react-router-dom';
import { HardDrive, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Files = () => {
  const { data, isLoading, addFile, deleteFile } = useLocalStorage();
  const location = useLocation();
  const uploadRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Check if URL has #upload hash and scroll to upload section
  useEffect(() => {
    if (location.hash === '#upload' && uploadRef.current) {
      setTimeout(() => {
        uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash, isLoading]);

  const handleClearAll = () => {
    if (data.files.length === 0) {
      toast({
        title: "No files to clear",
        description: "Your storage is already empty.",
      });
      return;
    }
    
    // We'd normally show a confirmation dialog here
    toast({
      title: "Feature coming soon",
      description: "The ability to clear all files will be available soon.",
    });
  };
  
  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">File Management</h1>
        <p className="text-muted-foreground">
          Upload, view, and manage your local files
        </p>
      </div>
      
      <Tabs defaultValue={location.hash === '#upload' ? 'upload' : 'files'} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="files" className="flex items-center">
            <HardDrive className="h-4 w-4 mr-2" />
            Your Files
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            Upload New Files
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="files" className="animate-fade-in">
          {isLoading ? (
            <div className="text-center py-12">
              <p>Loading your files...</p>
            </div>
          ) : (
            <FileTable 
              files={data.files} 
              onDelete={deleteFile}
            />
          )}
        </TabsContent>
        
        <TabsContent value="upload" className="animate-fade-in" ref={uploadRef}>
          <div className="max-w-2xl mx-auto">
            <FileUploader onFileUpload={addFile} />
            
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Files are stored securely in your browser's local storage.
              </p>
              <p className="text-xs text-muted-foreground">
                LocalDataHaven does not upload your files to any external servers.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Files;
