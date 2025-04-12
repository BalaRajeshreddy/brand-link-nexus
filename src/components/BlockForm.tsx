
import React from 'react';
import { BlockFormData, BlockType } from '@/types/block';
import { HeroBlock } from './blocks/HeroBlock';
import { PDFBlock } from './blocks/PDFBlock';
import { VideoBlock } from './blocks/VideoBlock';
import { FeaturesBlock } from './blocks/FeaturesBlock';
import { TestimonialsBlock } from './blocks/TestimonialsBlock';
import { ContactBlock } from './blocks/ContactBlock';
import { CustomBlock } from './blocks/CustomBlock';
import { ImageBlock } from './blocks/ImageBlock';
import { ImageTextBlock } from './blocks/ImageTextBlock';
import { FileSelector } from './FileSelector';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface BlockFormProps {
  formData: BlockFormData;
  onChange: (data: BlockFormData) => void;
  brandId: string;
}

export const BlockForm: React.FC<BlockFormProps> = ({
  formData,
  onChange,
  brandId
}) => {
  const handleChange = (field: string, value: any) => {
    onChange({
      ...formData,
      content: {
        ...formData.content,
        [field]: value
      }
    });
  };

  const renderBlockForm = () => {
    switch (formData.type) {
      case BlockType.HERO:
        return (
          <HeroBlock
            block={formData as any}
            onChange={onChange as any}
            brandId={brandId}
          />
        );
      case BlockType.PDF:
        return (
          <PDFBlock
            block={formData as any}
            onChange={onChange as any}
            brandId={brandId}
          />
        );
      case BlockType.VIDEO:
        return (
          <VideoBlock
            block={formData as any}
            onChange={onChange as any}
            brandId={brandId}
          />
        );
      case BlockType.FEATURES:
        return (
          <FeaturesBlock
            block={formData as any}
            onChange={onChange as any}
            brandId={brandId}
          />
        );
      case BlockType.TESTIMONIALS:
        return (
          <TestimonialsBlock
            block={formData as any}
            onChange={onChange as any}
            brandId={brandId}
          />
        );
      case BlockType.CONTACT:
        return (
          <ContactBlock
            block={formData as any}
            onChange={onChange as any}
            brandId={brandId}
          />
        );
      case BlockType.CUSTOM:
        return (
          <CustomBlock
            block={formData as any}
            onChange={onChange as any}
            brandId={brandId}
          />
        );
      case BlockType.IMAGE:
        return (
          <ImageBlock
            block={formData as any}
            onChange={onChange as any}
            brandId={brandId}
          />
        );
      case BlockType.IMAGE_TEXT:
        return (
          <ImageTextBlock
            block={formData as any}
            onChange={onChange as any}
            brandId={brandId}
          />
        );
      default:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.content.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter block title"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.content.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter block description"
              />
            </div>

            {(formData.type === "IMAGE" || formData.type === BlockType.IMAGE) && (
              <div className="space-y-2">
                <Label>Image</Label>
                <FileSelector
                  type="image"
                  onSelect={(file) => handleChange('image', file)}
                  brandId={brandId}
                  value={formData.content.image?.url}
                />
              </div>
            )}

            {(formData.type === "PDF" || formData.type === BlockType.PDF) && (
              <div className="space-y-2">
                <Label>PDF Document</Label>
                <FileSelector
                  type="pdf"
                  onSelect={(file) => handleChange('pdf', file)}
                  brandId={brandId}
                  value={formData.content.pdf?.url}
                />
              </div>
            )}
          </div>
        );
    }
  };

  return <div className="space-y-4">{renderBlockForm()}</div>;
};
