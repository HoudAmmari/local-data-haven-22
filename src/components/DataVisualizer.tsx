
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { FileData } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

interface DataVisualizerProps {
  files: FileData[];
  className?: string;
}

type FileTypeGroup = {
  type: string;
  size: number;
  count: number;
  color: string;
};

const DataVisualizer: React.FC<DataVisualizerProps> = ({ files, className }) => {
  const fileTypeColors = useRef<Record<string, string>>({
    image: '#f472b6', // pink
    video: '#a78bfa', // purple
    audio: '#60a5fa', // blue
    document: '#34d399', // green
    archive: '#fbbf24', // amber
    other: '#9ca3af', // gray
  });
  
  const categorizeFileType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.startsWith('text/') || 
        mimeType.includes('document') || 
        mimeType.includes('pdf')) return 'document';
    if (mimeType.includes('zip') || 
        mimeType.includes('compressed') || 
        mimeType.includes('archive')) return 'archive';
    return 'other';
  };
  
  const getFileTypeData = (): FileTypeGroup[] => {
    const typeGroups: Record<string, FileTypeGroup> = {};
    
    files.forEach(file => {
      const category = categorizeFileType(file.type);
      
      if (!typeGroups[category]) {
        typeGroups[category] = {
          type: category,
          size: 0,
          count: 0,
          color: fileTypeColors.current[category]
        };
      }
      
      typeGroups[category].size += file.size;
      typeGroups[category].count += 1;
    });
    
    return Object.values(typeGroups);
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
  
  const FileTypeTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-md border">
          <p className="font-medium capitalize">{data.type}</p>
          <p className="text-sm text-muted-foreground">Files: {data.count}</p>
          <p className="text-sm text-muted-foreground">Size: {formatFileSize(data.size)}</p>
        </div>
      );
    }
    
    return null;
  };
  
  const typeData = getFileTypeData();
  const hasData = typeData.length > 0;
  
  const getTypeName = (type: string): string => {
    const names: Record<string, string> = {
      image: 'Images',
      video: 'Videos',
      audio: 'Audio',
      document: 'Documents',
      archive: 'Archives',
      other: 'Other Files'
    };
    
    return names[type] || type;
  };
  
  return (
    <Card className={cn("shadow-subtle", className)}>
      <CardHeader>
        <CardTitle>Storage Breakdown</CardTitle>
        <CardDescription>File types distribution</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No data to visualize</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="size"
                  animationDuration={750}
                  animationBegin={0}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<FileTypeTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
              {typeData.map((type) => (
                <div key={type.type} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: type.color }}
                  />
                  <div>
                    <p className="text-xs font-medium capitalize">{getTypeName(type.type)}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(type.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataVisualizer;
