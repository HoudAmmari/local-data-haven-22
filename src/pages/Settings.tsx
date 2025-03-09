
import React, { useState } from 'react';
import PageLayout from '@/components/Layout/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/components/ui/use-toast';
import { Info, Download, Trash2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const Settings = () => {
  const { data, isLoading, clearAllFiles } = useLocalStorage();
  const [compressFiles, setCompressFiles] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoDeleteDays, setAutoDeleteDays] = useState([30]);
  const [exportFormat, setExportFormat] = useState('json');
  const { toast } = useToast();

  const handleClearAll = () => {
    if (data.files.length === 0) {
      toast({
        title: "No files to clear",
        description: "Your storage is already empty.",
      });
      return;
    }
    
    // In a real app, we'd show a confirmation dialog here
    if (window.confirm("Are you sure you want to clear all files? This action cannot be undone.")) {
      clearAllFiles();
      toast({
        title: "Storage cleared",
        description: "All files have been removed from local storage."
      });
    }
  };

  const handleExportData = () => {
    try {
      const dataStr = JSON.stringify(data, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `localdatahaven-export-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Data exported successfully",
        description: "Your data has been exported as a JSON file."
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  const handleSaveSettings = () => {
    // In a real app, we'd persist these settings to localStorage
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated."
    });
  };

  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your LocalDataHaven preferences
        </p>
      </div>
      
      <div className="grid gap-6 mb-8">
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle>Storage Preferences</CardTitle>
            <CardDescription>Configure how files are stored and managed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compress">Compress files</Label>
                <p className="text-sm text-muted-foreground">
                  Reduce file size before storing (may affect processing speed)
                </p>
              </div>
              <Switch
                id="compress"
                checked={compressFiles}
                onCheckedChange={setCompressFiles}
              />
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-delete files after</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically remove files older than the specified days
                  </p>
                </div>
                <span className="text-sm font-medium">
                  {autoDeleteDays[0]} {autoDeleteDays[0] === 1 ? 'day' : 'days'}
                </span>
              </div>
              <Slider
                value={autoDeleteDays}
                onValueChange={setAutoDeleteDays}
                max={90}
                min={1}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 day</span>
                <span>30 days</span>
                <span>90 days</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between flex-col sm:flex-row gap-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Info className="h-4 w-4 mr-1" />
              Settings are saved locally
            </div>
            <Button onClick={handleSaveSettings}>Save Preferences</Button>
          </CardFooter>
        </Card>
        
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage application alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Enable notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Show alerts for important events and activities
                </p>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export or clear your stored data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Export Data</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="format-json"
                    value="json"
                    checked={exportFormat === 'json'}
                    onChange={() => setExportFormat('json')}
                    className="accent-primary"
                  />
                  <Label htmlFor="format-json">JSON</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="format-csv"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={() => setExportFormat('csv')}
                    className="accent-primary"
                  />
                  <Label htmlFor="format-csv">CSV (metadata only)</Label>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={handleExportData}
              >
                <Download className="h-4 w-4 mr-2" />
                Export All Data
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium">Clear Storage</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Remove all files from local storage. This action cannot be undone.
                </p>
              </div>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={handleClearAll}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-muted/50 shadow-subtle mb-8">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">About LocalDataHaven</h3>
            <p className="text-sm text-muted-foreground">
              Version 1.0.0 • Made with ❤️ for your data privacy
            </p>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default Settings;
