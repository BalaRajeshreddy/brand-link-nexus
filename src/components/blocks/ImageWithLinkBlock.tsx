import { useState } from 'react';
import { Block } from '@/types/block';
import { MediaSelector } from '../ui/MediaSelector';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';

interface ImageWithLinkBlockProps {
  block: Block;
  onChange: (block: Block) => void;
  brandId: string;
}

export const ImageWithLinkBlock: React.FC<ImageWithLinkBlockProps> = ({
  block,
  onChange,
  brandId
}) => {
  const [content, setContent] = useState(block.content || {
    title: '',
    description: '',
    image: { url: '', alt: '', link: '' }
  });

  const handleChange = (field: string, value: any) => {
    const newContent = {
      ...content,
      [field]: value
    };
    setContent(newContent);
    onChange({
      ...block,
      content: newContent
    });
  };

  const handleImageSelect = (media: { url: string; alt?: string; link?: string }) => {
    handleChange('image', {
      url: media.url,
      alt: media.alt || 'Image',
      link: media.link || content.image?.link || ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={content.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter section title"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Input
            value={content.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Enter section description"
          />
        </div>

        <div className="space-y-2">
          <Label>Image with Link</Label>
          <MediaSelector
            type="image-with-link"
            onSelect={handleImageSelect}
            value={content.image}
            brandId={brandId}
            folder="content-images"
          />
        </div>
      </div>

      {content.image?.url && (
        <div className="mt-4">
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <img
              src={content.image.url}
              alt={content.image.alt || 'Content image'}
              className="w-full h-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => handleChange('image', { url: '', alt: '', link: '' })}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {content.image.link && (
            <div className="mt-2 text-sm text-muted-foreground">
              Link: {content.image.link}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 