
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { HardDrive, Server, Clock, Upload } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface StorageStatsProps {
  totalSize: number;
  fileCount: number;
  lastUpdated: number;
  className?: string;
}

const StorageStats: React.FC<StorageStatsProps> = ({
  totalSize,
  fileCount,
  lastUpdated,
  className,
}) => {
  const [availableStorage, setAvailableStorage] = useState<number | null>(null);
  const [usedPercentage, setUsedPercentage] = useState(0);
  
  useEffect(() => {
    // Estimate available storage based on device
    const estimateAvailableStorage = async () => {
      try {
        // This is a simplification - in reality, browsers don't provide a reliable way
        // to get the exact available storage. Using 1GB as a conservative estimate.
        const estimatedStorage = 1 * 1024 * 1024 * 1024; // 1GB in bytes
        setAvailableStorage(estimatedStorage);
        
        const percentage = (totalSize / estimatedStorage) * 100;
        setUsedPercentage(Math.min(percentage, 100));
      } catch (error) {
        console.error('Error estimating storage:', error);
      }
    };
    
    estimateAvailableStorage();
  }, [totalSize]);
  
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
  
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      <Card className="shadow-subtle">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <HardDrive className="h-4 w-4 mr-2 text-primary" />
            Storage Used
          </CardTitle>
          <CardDescription>Total space utilized</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
          {availableStorage && (
            <>
              <Progress 
                value={usedPercentage} 
                className="h-2 mt-2"
                color={usedPercentage > 90 ? "destructive" : usedPercentage > 70 ? "orange" : "primary"}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {formatFileSize(totalSize)} of {formatFileSize(availableStorage)} used ({usedPercentage.toFixed(1)}%)
              </p>
            </>
          )}
        </CardContent>
      </Card>
      
      <Card className="shadow-subtle">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Server className="h-4 w-4 mr-2 text-primary" />
            Files Stored
          </CardTitle>
          <CardDescription>Total number of files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{fileCount}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {fileCount === 0 
              ? "No files stored yet" 
              : fileCount === 1 
                ? "1 file in your local storage" 
                : `${fileCount} files in your local storage`}
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-subtle">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2 text-primary" />
            Last Updated
          </CardTitle>
          <CardDescription>Most recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {lastUpdated ? formatDistanceToNow(new Date(lastUpdated), { addSuffix: true }) : "Never"}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {lastUpdated 
              ? new Date(lastUpdated).toLocaleString() 
              : "No activity recorded yet"}
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-subtle">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Upload className="h-4 w-4 mr-2 text-primary" />
            Average File Size
          </CardTitle>
          <CardDescription>Per file metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {fileCount > 0 
              ? formatFileSize(totalSize / fileCount) 
              : "0 B"}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {fileCount > 0 
              ? `Calculated across ${fileCount} file${fileCount === 1 ? '' : 's'}`
              : "No files to calculate average"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageStats;
