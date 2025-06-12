import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Upload, Trash2, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContentBlock {
  id: string;
  type: 'image' | 'text';
  content: string;
  caption?: string;
}

interface ImageTextContentProps {
  onContentChange: (content: ContentBlock[]) => void;
  initialContent?: ContentBlock[];
}

export const ImageTextContent = ({
  onContentChange,
  initialContent = []
}: ImageTextContentProps) => {
  const [content, setContent] = useState<ContentBlock[]>(initialContent);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image is too large. Maximum size is 5MB');
        return;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `content-images/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      // Add new image block
      const newContent = [
        ...content,
        {
          id: Math.random().toString(36).substring(2),
          type: 'image' as const,
          content: publicUrl,
          caption: ''
        }
      ];
      setContent(newContent);
      onContentChange(newContent);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const addTextBlock = () => {
    const newContent = [
      ...content,
      {
        id: Math.random().toString(36).substring(2),
        type: 'text' as const,
        content: ''
      }
    ];
    setContent(newContent);
    onContentChange(newContent);
  };

  const updateBlock = (id: string, updates: Partial<ContentBlock>) => {
    const newContent = content.map(block =>
      block.id === id ? { ...block, ...updates } : block
    );
    setContent(newContent);
    onContentChange(newContent);
  };

  const removeBlock = (id: string) => {
    const newContent = content.filter(block => block.id !== id);
    setContent(newContent);
    onContentChange(newContent);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            disabled={isUploading}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={isUploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Add Image'}
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={addTextBlock}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Text
        </Button>
      </div>

      <div className="space-y-6">
        {content.map((block) => (
          <div key={block.id} className="relative p-4 border rounded-lg space-y-4">
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeBlock(block.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            {block.type === 'image' ? (
              <>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={block.content}
                    alt="Content image"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`caption-${block.id}`}>Caption</Label>
                  <Input
                    id={`caption-${block.id}`}
                    value={block.caption || ''}
                    onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                    placeholder="Add a caption..."
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor={`text-${block.id}`}>Text Content</Label>
                <Textarea
                  id={`text-${block.id}`}
                  value={block.content}
                  onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                  placeholder="Enter your text content..."
                  rows={4}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 