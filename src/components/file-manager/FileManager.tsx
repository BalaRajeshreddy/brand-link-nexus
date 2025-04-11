import { useState } from 'react';
import { FileAsset, FileType } from '@/lib/types/file';
import { FileUpload } from '@/components/shared/FileUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Image, FileText, Folder, Search, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileManagerProps {
  brandId: string;
  onSelect?: (file: FileAsset) => void;
  allowedTypes?: FileType[];
  showUpload?: boolean;
}

export function FileManager({
  brandId,
  onSelect,
  allowedTypes = ['image', 'pdf'],
  showUpload = true,
}: FileManagerProps) {
  const [files, setFiles] = useState<FileAsset[]>([]); // TODO: Load from API
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const folders = Array.from(new Set(files.map(f => f.folder).filter(Boolean)));
  
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = !selectedFolder || file.folder === selectedFolder;
    const matchesType = allowedTypes.includes(file.type);
    return matchesSearch && matchesFolder && matchesType;
  });

  const handleFileUpload = async (file: File) => {
    // TODO: Implement file upload to storage
    console.log('Uploading file:', file);
  };

  const handleFileSelect = (file: FileAsset) => {
    if (onSelect) {
      onSelect(file);
    }
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
        </div>
        {showUpload && (
          <Button
            variant="outline"
            className="ml-4"
            onClick={() => setShowUploadDialog(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        )}
      </div>

      <div className="flex-1 flex">
        {/* Folders Sidebar */}
        <div className="w-48 border-r p-4">
          <Label className="text-xs font-medium mb-2">Folders</Label>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start',
                !selectedFolder && 'bg-muted'
              )}
              onClick={() => setSelectedFolder(null)}
            >
              <Folder className="h-4 w-4 mr-2" />
              All Files
            </Button>
            {folders.map((folder) => (
              <Button
                key={folder}
                variant="ghost"
                className={cn(
                  'w-full justify-start',
                  selectedFolder === folder && 'bg-muted'
                )}
                onClick={() => setSelectedFolder(folder)}
              >
                <Folder className="h-4 w-4 mr-2" />
                {folder}
              </Button>
            ))}
          </div>
        </div>

        {/* Files Grid */}
        <div className="flex-1 p-4">
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="grid grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <Card
                  key={file.id}
                  className={cn(
                    'cursor-pointer hover:border-primary transition-colors',
                    onSelect && 'hover:bg-muted/50'
                  )}
                  onClick={() => handleFileSelect(file)}
                >
                  <CardContent className="p-4">
                    {file.type === 'image' ? (
                      <div className="aspect-square rounded-md overflow-hidden bg-muted">
                        <img
                          src={file.thumbnailUrl || file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-square rounded-md bg-muted flex items-center justify-center">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                    <div className="mt-2">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Upload a file to your brand's library
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <FileUpload
              onFileSelect={async (file) => {
                await handleFileUpload(file);
                setShowUploadDialog(false);
              }}
              config={{
                maxSizeInMB: 5,
                allowedTypes,
                allowedMimeTypes: [
                  'image/jpeg',
                  'image/png',
                  'image/gif',
                  'image/webp',
                  'application/pdf'
                ]
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 