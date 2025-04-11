import React from 'react';
import { Block } from '@/types/block';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface VideoBlockProps {
  block: Block;
  onChange: (block: Block) => void;
  brandId: string;
}

export const VideoBlock: React.FC<VideoBlockProps> = ({
  block,
  onChange,
  brandId
}) => {
  const handleChange = (field: string, value: any) => {
    onChange({
      ...block,
      content: {
        ...block.content,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={block.content.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter video title"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={block.content.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter video description"
        />
      </div>

      <div className="space-y-2">
        <Label>Video URL</Label>
        <Input
          value={block.content.videoUrl || ''}
          onChange={(e) => handleChange('videoUrl', e.target.value)}
          placeholder="Enter video URL"
        />
      </div>
    </div>
  );
}; 