
import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { FileData } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileUpload: (file: FileData) => void;
  className?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, className }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileSelection = useCallback((file: File) => {
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, [handleFileSelection]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  }, [handleFileSelection]);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const fileData: FileData = {
          id: crypto.randomUUID(),
          name: selectedFile.name,
          type: selectedFile.type,
          size: selectedFile.size,
          lastModified: selectedFile.lastModified,
          content: event.target?.result || null,
        };
        
        onFileUpload(fileData);
        setSelectedFile(null);
        
        toast({
          title: "File uploaded successfully",
          description: `${selectedFile.name} has been stored locally.`,
        });
      };
      
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }, [selectedFile, onFileUpload, toast]);

  const clearSelectedFile = useCallback(() => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out p-8 text-center",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-muted-foreground/50",
          selectedFile ? "bg-accent/50" : ""
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {!selectedFile ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-primary/10 p-4 mb-2">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">Upload a file</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Drag and drop or click to browse
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
            >
              <FileUp className="h-4 w-4 mr-2" />
              Choose a file
            </Button>
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-between w-full max-w-md p-3 bg-background/80 rounded-lg">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <div className="bg-primary/10 rounded-full p-2">
                    <FileUp className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  onClick={clearSelectedFile}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <Button 
              onClick={handleUpload} 
              className="mt-4" 
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload file'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
