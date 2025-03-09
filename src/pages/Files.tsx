
import React, { useEffect, useRef } from 'react';
import PageLayout from '@/components/Layout/PageLayout';
import FileUploader from '@/components/FileUploader';
import FileTable from '@/components/FileTable';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocation } from 'react-router-dom';
import { HardDrive, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Files = () => {
  const { data, isLoading, addFile, deleteFile, clearAllFiles } = useLocalStorage();
  const location = useLocation();
  const uploadRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [showClearDialog, setShowClearDialog] = React.useState(false);
  
  // Check if URL has #upload hash and scroll to upload section
  useEffect(() => {
    if (location.hash === '#upload' && uploadRef.current) {
      setTimeout(() => {
        uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash, isLoading]);

  const handleClearConfirm = () => {
    clearAllFiles();
    setShowClearDialog(false);
    toast({
      title: "Storage cleared",
      description: "All files have been removed from local storage.",
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
        <div className="flex justify-between items-center mb-8">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="files" className="flex items-center">
              <HardDrive className="h-4 w-4 mr-2" />
              Your Files
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center">
              <Upload className="h-4 w-4 mr-2" />
              Upload New Files
            </TabsTrigger>
          </TabsList>
          
          {data.files.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center text-destructive hover:bg-destructive/10"
              onClick={() => setShowClearDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
        
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
      
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all files?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all {data.files.length} files from your local storage.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleClearConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, delete all files
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default Files;
