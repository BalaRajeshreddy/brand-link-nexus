import React from 'react';
import { Block } from '@/types/block';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface FeaturesBlockProps {
  block: Block;
  onChange: (block: Block) => void;
  brandId: string;
}

export const FeaturesBlock: React.FC<FeaturesBlockProps> = ({
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

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const features = [...(block.content.features || [])];
    features[index] = {
      ...features[index],
      [field]: value
    };
    handleChange('features', features);
  };

  const addFeature = () => {
    const features = [...(block.content.features || [])];
    features.push({ title: '', description: '' });
    handleChange('features', features);
  };

  const removeFeature = (index: number) => {
    const features = [...(block.content.features || [])];
    features.splice(index, 1);
    handleChange('features', features);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={block.content.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter features section title"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={block.content.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter features section description"
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Features</Label>
          <Button variant="outline" size="sm" onClick={addFeature}>
            <Plus className="w-4 h-4 mr-2" />
            Add Feature
          </Button>
        </div>

        {(block.content.features || []).map((feature: any, index: number) => (
          <div key={index} className="space-y-2 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <Label>Feature {index + 1}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFeature(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
            <Input
              value={feature.title || ''}
              onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
              placeholder="Enter feature title"
            />
            <Textarea
              value={feature.description || ''}
              onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
              placeholder="Enter feature description"
            />
          </div>
        ))}
      </div>
    </div>
  );
}; 