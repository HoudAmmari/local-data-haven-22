
import React, { useState } from 'react';
import { FileData } from '@/hooks/useLocalStorage';
import { formatDistanceToNow } from 'date-fns';
import { Download, Trash2, Search, SortAsc, SortDesc, File, FileText, Image, Music, Video, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface FileTableProps {
  files: FileData[];
  onDelete: (id: string) => void;
  className?: string;
}

const FileTable: React.FC<FileTableProps> = ({ files, onDelete, className }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'size' | 'lastModified'>('lastModified');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const handleSort = (field: 'name' | 'size' | 'lastModified') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-pink-500" />;
    } else if (mimeType.startsWith('video/')) {
      return <Video className="h-5 w-5 text-purple-500" />;
    } else if (mimeType.startsWith('audio/')) {
      return <Music className="h-5 w-5 text-blue-500" />;
    } else if (mimeType.startsWith('text/')) {
      return <FileText className="h-5 w-5 text-green-500" />;
    } else if (mimeType.includes('zip') || mimeType.includes('compressed') || mimeType.includes('archive')) {
      return <Package className="h-5 w-5 text-amber-500" />;
    } else {
      return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
  };

  const downloadFile = (file: FileData) => {
    try {
      const linkSource = file.content as string;
      const downloadLink = document.createElement("a");
      
      downloadLink.href = linkSource;
      downloadLink.download = file.name;
      downloadLink.click();
      
      toast({
        title: "File download started",
        description: `Downloading ${file.name}`,
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your file.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    onDelete(id);
    toast({
      title: "File deleted",
      description: `${name} has been removed from storage.`,
    });
  };

  // Filter and sort files
  const filteredFiles = files
    .filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'size') {
        comparison = a.size - b.size;
      } else if (sortField === 'lastModified') {
        comparison = a.lastModified - b.lastModified;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground hidden sm:inline-block">
            Sort by:
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort('name')}
            className={cn(
              "text-xs",
              sortField === 'name' ? "font-medium" : "text-muted-foreground"
            )}
          >
            Name
            {sortField === 'name' && (
              sortDirection === 'asc' ? 
                <SortAsc className="h-3 w-3 ml-1" /> : 
                <SortDesc className="h-3 w-3 ml-1" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort('size')}
            className={cn(
              "text-xs",
              sortField === 'size' ? "font-medium" : "text-muted-foreground"
            )}
          >
            Size
            {sortField === 'size' && (
              sortDirection === 'asc' ? 
                <SortAsc className="h-3 w-3 ml-1" /> : 
                <SortDesc className="h-3 w-3 ml-1" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSort('lastModified')}
            className={cn(
              "text-xs",
              sortField === 'lastModified' ? "font-medium" : "text-muted-foreground"
            )}
          >
            Date
            {sortField === 'lastModified' && (
              sortDirection === 'asc' ? 
                <SortAsc className="h-3 w-3 ml-1" /> : 
                <SortDesc className="h-3 w-3 ml-1" />
            )}
          </Button>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-fade-in">
          <File className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-lg font-medium">No files found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {files.length === 0 ? "Upload some files to get started" : "Try a different search term"}
          </p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border shadow-subtle overflow-hidden">
          <div className="min-w-full divide-y divide-border">
            <div className="bg-muted/50">
              <div className="grid grid-cols-12 gap-2 px-4 py-3 text-sm font-medium text-muted-foreground">
                <div className="col-span-6 sm:col-span-5">File Name</div>
                <div className="col-span-3 sm:col-span-2 text-right">Size</div>
                <div className="col-span-0 sm:col-span-3 hidden sm:block">Last Modified</div>
                <div className="col-span-3 sm:col-span-2 text-right">Actions</div>
              </div>
            </div>
            <div className="divide-y divide-border bg-card">
              {filteredFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="grid grid-cols-12 gap-2 px-4 py-3 text-sm hover:bg-muted/30 transition-colors"
                >
                  <div className="col-span-6 sm:col-span-5 flex items-center min-w-0">
                    {getFileIcon(file.type)}
                    <span className="ml-2 truncate">{file.name}</span>
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right text-muted-foreground">
                    {formatFileSize(file.size)}
                  </div>
                  <div className="col-span-0 sm:col-span-3 hidden sm:block text-muted-foreground">
                    {formatDistanceToNow(new Date(file.lastModified), { addSuffix: true })}
                  </div>
                  <div className="col-span-3 sm:col-span-2 flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => downloadFile(file)}
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    >
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(file.id, file.name)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileTable;
