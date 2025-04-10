
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MediaLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectImage: (url: string, alt: string) => void;
}

export function MediaLibrary({ open, onOpenChange, onSelectImage }: MediaLibraryProps) {
  const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; name: string; id: string }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [altText, setAltText] = useState("");

  useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open]);

  const fetchImages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('media_library')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUploadedImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Failed to fetch your images');
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (!files || files.length === 0) {
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You need to be logged in to upload images");
        return;
      }

      setIsUploading(true);

      // Check if the media bucket exists, create it if it doesn't
      const { data: buckets } = await supabase.storage.listBuckets();
      const mediaBucketExists = buckets?.some(bucket => bucket.name === 'media');
      
      if (!mediaBucketExists) {
        await supabase.storage.createBucket('media', { public: true });
      }

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        // Upload to Storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        // Store reference in database
        const { error: dbError } = await supabase
          .from('media_library')
          .insert({
            name: file.name,
            file_path: filePath,
            url: publicUrl,
            user_id: user.id,
            file_size: file.size,
            mime_type: file.type
          });

        if (dbError) throw dbError;
      }

      toast.success('Images uploaded successfully');
      fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectImage = () => {
    if (selectedImage) {
      onSelectImage(selectedImage, altText || 'Image');
      onOpenChange(false);
      setSelectedImage(null);
      setAltText("");
    } else {
      toast.error('Please select an image');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="library" className="flex-1 flex flex-col overflow-hidden">
          <TabsList>
            <TabsTrigger value="library">My Images</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>
          
          <TabsContent value="library" className="flex-1 overflow-hidden flex flex-col">
            {uploadedImages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-4">
                <ImageIcon className="w-12 h-12 mb-4 opacity-40" />
                <p>No images uploaded yet</p>
                <p className="text-sm">Upload some images to get started</p>
              </div>
            ) : (
              <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-3 gap-4 p-4">
                  {uploadedImages.map((image) => (
                    <div 
                      key={image.id} 
                      className={`aspect-square border rounded-md overflow-hidden cursor-pointer relative ${selectedImage === image.url ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <img 
                        src={image.url} 
                        alt={image.name} 
                        className="w-full h-full object-cover"
                      />
                      {selectedImage === image.url && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                            ✓
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {selectedImage && (
              <div className="border-t p-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alt-text">Alt Text (for accessibility)</Label>
                  <Input 
                    id="alt-text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Describe what's in the image"
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSelectImage}>
                    Use Selected Image
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="flex-1 flex flex-col">
            <div className="flex-1 border-2 border-dashed rounded-md flex flex-col items-center justify-center p-8">
              <Upload className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">Drag & drop images here</p>
              <p className="text-sm text-muted-foreground mb-4">Or click to browse files</p>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleUpload}
                disabled={isUploading}
              />
              <Button
                asChild
                variant="outline"
                disabled={isUploading}
              >
                <label htmlFor="image-upload">
                  {isUploading ? 'Uploading...' : 'Select Files'}
                </label>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
