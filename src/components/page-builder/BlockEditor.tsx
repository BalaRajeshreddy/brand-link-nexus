import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Block, BlockStyles } from "@/types/block";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Switch } from "@/components/ui/switch";
import { FileSelector } from '@/components/FileSelector';
import { FileAsset } from '@/types/file';
import { ColorPicker } from '@/components/ColorPicker';

interface EditorBlock {
  id: string;
  type: string;
  content: Record<string, any>;
  brandId: string;
  styles?: Record<string, any>;
}

interface BlockEditorProps {
  block: Block;
  onUpdateBlock: (block: { id: string; type: string; content: Record<string, any>; }) => void;
  openMediaLibrary?: () => void;
}

export function BlockEditor({ block, onUpdateBlock, openMediaLibrary }: BlockEditorProps) {
  const [content, setContent] = useState<Record<string, any>>(block.content);
  const [isOpen, setIsOpen] = useState(true);

  const updateContent = (field: string, value: any) => {
    const newContent = { ...content, [field]: value };
    setContent(newContent);
  };
  
  const updateNestedContent = (path: string[], value: any) => {
    if (path.length === 0) return;
    
    setContent((prev) => {
      const result = { ...prev };
      let current = result;
      
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) {
          current[path[i]] = {};
        }
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      return result;
    });
  };
  
  const handleSave = () => {
    const updatedBlock = {
      ...block,
      content: content,
      styles: block.type === 'form' ? block.styles : {
        ...block.styles,
        ...content
      }
    };
    onUpdateBlock(updatedBlock);
    setIsOpen(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleSave();
    }
  };
  
  const handleStyleChange = (componentType: 'container' | 'input' | 'label' | 'button', style: Partial<BlockStyles>) => {
    onUpdateBlock({
      ...block,
      styles: {
        ...block.styles,
        [componentType]: {
          ...(block.styles?.[componentType] || {}),
          ...style
        }
      }
    });
  };

  const renderContentEditor = () => {
    switch (block.type) {
      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="heading-text">Heading Text</Label>
              <Input
                id="heading-text"
                value={content.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-content">Text Content</Label>
              <Textarea
                id="text-content"
                value={content.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
                rows={5}
              />
            </div>
          </div>
        );
        
      case 'heading + text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="combined-heading">Heading</Label>
              <Input
                id="combined-heading"
                value={content.heading || ''}
                onChange={(e) => updateContent('heading', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="combined-text">Text Content</Label>
              <Textarea
                id="combined-text"
                value={content.text || ''}
                onChange={(e) => updateContent('text', e.target.value)}
                rows={4}
              />
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label>Image</Label>
              <FileSelector
                type="image"
                onSelect={(file) => {
                  if (file && 'url' in file) {
                    updateContent('src', (file as FileAsset).url);
                  }
                }}
                brandId={block.brandId}
                value={content.src}
              />
            </div>
            <div>
              <Label htmlFor="image-alt">Alt Text</Label>
              <Input
                id="image-alt"
                placeholder="Image description"
                value={content.alt || ''}
                onChange={(e) => updateContent('alt', e.target.value)}
              />
            </div>
          </div>
        );
        
      case 'images':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Display Type</Label>
              <Select
                value={content.displayType || 'grid'}
                onValueChange={(value) => updateContent('displayType', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select display type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="slider">Slider</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(content.images || [{ src: "", alt: "" }, { src: "", alt: "" }, { src: "", alt: "" }]).map((image: any, index: number) => (
              <div key={index.toString()} className="space-y-2 border p-3 rounded-md">
                <Label>Image #{index + 1}</Label>
                <div>
                  <Label htmlFor={`image-src-${index.toString()}`} className="text-sm">Image URL</Label>
                  <Input
                    id={`image-src-${index.toString()}`}
                    value={image.src || ''}
                    onChange={(e) => updateNestedContent(['images', index.toString(), 'src'], e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor={`image-alt-${index.toString()}`} className="text-sm">Alt Text</Label>
                  <Input
                    id={`image-alt-${index.toString()}`}
                    value={image.alt || ''}
                    onChange={(e) => updateNestedContent(['images', index.toString(), 'alt'], e.target.value)}
                    placeholder="Image description"
                  />
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => {
                const images = [...(content.images || [])];
                images.push({ src: "", alt: "" });
                updateContent('images', images);
              }}
            >
              Add Image
            </Button>
          </div>
        );
        
      case 'images + links':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Display Type</Label>
              <Select
                value={content.displayType || 'grid'}
                onValueChange={(value) => updateContent('displayType', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select display type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="slider">Slider</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(content.images || [{ src: "", alt: "", link: "", title: "" }]).map((image: any, index: number) => (
              <div key={index.toString()} className="space-y-2 border p-3 rounded-md">
                <Label>Image with Link #{index + 1}</Label>
                <div>
                  <Label htmlFor={`image-src-${index.toString()}`} className="text-sm">Image URL</Label>
                  <Input
                    id={`image-src-${index.toString()}`}
                    value={image.src || ''}
                    onChange={(e) => updateNestedContent(['images', index.toString(), 'src'], e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor={`image-alt-${index.toString()}`} className="text-sm">Alt Text</Label>
                  <Input
                    id={`image-alt-${index.toString()}`}
                    value={image.alt || ''}
                    onChange={(e) => updateNestedContent(['images', index.toString(), 'alt'], e.target.value)}
                    placeholder="Image description"
                  />
                </div>
                <div>
                  <Label htmlFor={`image-title-${index.toString()}`} className="text-sm">Link Title</Label>
                  <Input
                    id={`image-title-${index.toString()}`}
                    value={image.title || ''}
                    onChange={(e) => updateNestedContent(['images', index.toString(), 'title'], e.target.value)}
                    placeholder="Click here"
                  />
                </div>
                <div>
                  <Label htmlFor={`image-link-${index.toString()}`} className="text-sm">Link URL</Label>
                  <Input
                    id={`image-link-${index.toString()}`}
                    value={image.link || ''}
                    onChange={(e) => updateNestedContent(['images', index.toString(), 'link'], e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => {
                const images = [...(content.images || [])];
                images.push({ src: "", alt: "", link: "", title: "" });
                updateContent('images', images);
              }}
            >
              Add Image with Link
            </Button>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="video-provider">Video Provider</Label>
              <Select
                value={content.provider || 'youtube'}
                onValueChange={(value) => updateContent('provider', value)}
              >
                <SelectTrigger id="video-provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="video-src">Video URL or ID</Label>
              <Input
                id="video-src"
                placeholder={content.provider === 'youtube' ? 'YouTube URL or video ID' : 'Video URL'}
                value={content.src || ''}
                onChange={(e) => updateContent('src', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {content.provider === 'youtube' 
                  ? 'Enter a YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID) or just the video ID'
                  : content.provider === 'vimeo'
                  ? 'Enter a Vimeo URL (e.g., https://vimeo.com/VIDEO_ID)'
                  : 'Enter the URL of your video'}
              </p>
            </div>
            <div>
              <Label htmlFor="video-thumbnail">Thumbnail URL (Optional)</Label>
              <Input
                id="video-thumbnail"
                placeholder="https://example.com/thumbnail.jpg"
                value={content.thumbnail || ''}
                onChange={(e) => updateContent('thumbnail', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'testimonials':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Display Type</Label>
              <Select
                value={content.displayType || 'cards'}
                onValueChange={(value) => updateContent('displayType', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select display type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cards">Cards</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="quotes">Quote Style</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(content.testimonials || [{ text: '', author: '' }, { text: '', author: '' }]).map((testimonial: any, index: number) => (
              <div key={index.toString()} className="space-y-2 border p-3 rounded-md">
                <Label>Testimonial #{index + 1}</Label>
                <div>
                  <Label htmlFor={`testimonial-text-${index.toString()}`} className="text-sm">Quote</Label>
                  <Textarea
                    id={`testimonial-text-${index.toString()}`}
                    value={testimonial.text || ''}
                    onChange={(e) => updateNestedContent(['testimonials', index.toString(), 'text'], e.target.value)}
                    placeholder="This product is amazing!"
                  />
                </div>
                <div>
                  <Label htmlFor={`testimonial-author-${index.toString()}`} className="text-sm">Author</Label>
                  <Input
                    id={`testimonial-author-${index.toString()}`}
                    value={testimonial.author || ''}
                    onChange={(e) => updateNestedContent(['testimonials', index.toString(), 'author'], e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => {
                const testimonials = [...(content.testimonials || [])];
                testimonials.push({ text: '', author: '' });
                updateContent('testimonials', testimonials);
              }}
            >
              Add Testimonial
            </Button>
          </div>
        );
        
      case 'smart feedback':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="feedback-question">Question</Label>
              <Input
                id="feedback-question"
                value={content.question || ''}
                onChange={(e) => updateContent('question', e.target.value)}
                placeholder="How would you rate our service?"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Options</Label>
              </div>
              {(content.options || ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied']).map((option: string, index: number) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(content.options || [])];
                      newOptions[index] = e.target.value;
                      updateContent('options', newOptions);
                    }}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    type="button" 
                    className="h-8 w-8"
                    onClick={() => {
                      const newOptions = [...(content.options || [])].filter((_, i) => i !== index);
                      updateContent('options', newOptions);
                    }}
                  >
                    &times;
                  </Button>
                </div>
              ))}
              <Button 
                variant="outline" 
                type="button" 
                size="sm"
                onClick={() => {
                  const options = [...(content.options || [])];
                  options.push(`Option ${options.length + 1}`);
                  updateContent('options', options);
                }}
              >
                Add Option
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="allow-comments"
                checked={content.allowComments || false}
                onCheckedChange={(checked) => updateContent('allowComments', checked)}
              />
              <Label htmlFor="allow-comments">Allow comments</Label>
            </div>
          </div>
        );
        
      case 'team':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Display Type</Label>
              <Select
                value={content.displayType || 'cards'}
                onValueChange={(value) => updateContent('displayType', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select display type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cards">Cards</SelectItem>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(content.members || [{ name: '', role: '', photo: '' }, { name: '', role: '', photo: '' }, { name: '', role: '', photo: '' }]).map((member: any, index: number) => (
              <div key={index.toString()} className="space-y-2 border p-3 rounded-md">
                <Label>Team Member #{index + 1}</Label>
                <div>
                  <Label htmlFor={`member-name-${index.toString()}`} className="text-sm">Name</Label>
                  <Input
                    id={`member-name-${index.toString()}`}
                    value={member.name || ''}
                    onChange={(e) => updateNestedContent(['members', index.toString(), 'name'], e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor={`member-role-${index.toString()}`} className="text-sm">Role</Label>
                  <Input
                    id={`member-role-${index.toString()}`}
                    value={member.role || ''}
                    onChange={(e) => updateNestedContent(['members', index.toString(), 'role'], e.target.value)}
                    placeholder="CEO"
                  />
                </div>
                <div>
                  <Label htmlFor={`member-photo-${index.toString()}`} className="text-sm">Photo URL</Label>
                  <Input
                    id={`member-photo-${index.toString()}`}
                    value={member.photo || ''}
                    onChange={(e) => updateNestedContent(['members', index.toString(), 'photo'], e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => {
                const members = [...(content.members || [])];
                members.push({ name: '', role: '', photo: '' });
                updateContent('members', members);
              }}
            >
              Add Team Member
            </Button>
          </div>
        );
        
      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={content.text || 'Click Here'}
                onChange={(e) => updateContent('text', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="button-url">Button URL</Label>
              <Input
                id="button-url"
                placeholder="https://example.com"
                value={content.url || ''}
                onChange={(e) => updateContent('url', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="button-style">Button Style</Label>
              <Select
                value={content.style || 'filled'}
                onValueChange={(value) => updateContent('style', value)}
              >
                <SelectTrigger id="button-style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="filled">Filled</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'form':
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Form Fields</Label>
              </div>
              {(content.fields || [
                { type: 'text', label: 'Name', required: true, placeholder: 'Enter your name' },
                { type: 'email', label: 'Email', required: true, placeholder: 'Enter your email' },
                { type: 'textarea', label: 'Message', required: false, placeholder: 'Enter your message' }
              ]).map((field: any, index: number) => (
                <div key={index} className="border p-3 rounded-md mb-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Field #{index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      type="button" 
                      className="h-8 w-8"
                      onClick={() => {
                        const newFields = [...(content.fields || [])].filter((_, i) => i !== index);
                        updateContent('fields', newFields);
                      }}
                    >
                      &times;
                    </Button>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Field Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => {
                        const newFields = [...(content.fields || [])];
                        newFields[index] = { ...newFields[index], type: value };
                        updateContent('fields', newFields);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="tel">Phone</SelectItem>
                        <SelectItem value="textarea">Text Area</SelectItem>
                        <SelectItem value="select">Dropdown</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                        <SelectItem value="radio">Radio Buttons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Label</Label>
                    <Input
                      value={field.label || ''}
                      onChange={(e) => {
                        const newFields = [...(content.fields || [])];
                        newFields[index] = { ...newFields[index], label: e.target.value };
                        updateContent('fields', newFields);
                      }}
                      placeholder="Field Label"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm">Placeholder</Label>
                    <Input
                      value={field.placeholder || ''}
                      onChange={(e) => {
                        const newFields = [...(content.fields || [])];
                        newFields[index] = { ...newFields[index], placeholder: e.target.value };
                        updateContent('fields', newFields);
                      }}
                      placeholder="Field Placeholder"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.required || false}
                      onCheckedChange={(checked) => {
                        const newFields = [...(content.fields || [])];
                        newFields[index] = { ...newFields[index], required: checked };
                        updateContent('fields', newFields);
                      }}
                    />
                    <Label>Required field</Label>
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                type="button"
                onClick={() => {
                  const fields = [...(content.fields || [])];
                  fields.push({ type: 'text', label: `Field ${fields.length + 1}`, required: false, placeholder: '' });
                  updateContent('fields', fields);
                }}
              >
                Add Form Field
              </Button>
            </div>
            
            <div>
              <Label htmlFor="submit-text">Submit Button Text</Label>
              <Input
                id="submit-text"
                value={content.submitText || 'Submit'}
                onChange={(e) => updateContent('submitText', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="submit-action">Form Action</Label>
              <Select
                value={content.submitAction || 'email'}
                onValueChange={(value) => updateContent('submitAction', value)}
              >
                <SelectTrigger id="submit-action">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Send Email</SelectItem>
                  <SelectItem value="database">Save to Database</SelectItem>
                  <SelectItem value="api">Custom API</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'contact form':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Label>Include field:</Label>
              <div className="grid grid-cols-3 gap-2">
                {['name', 'email', 'phone', 'subject', 'message'].map((field) => (
                  <div key={field} className="flex items-center space-x-2">
                    <Switch
                      id={`include-${field}`}
                      checked={(content.fields || ['name', 'email', 'message']).includes(field)}
                      onCheckedChange={(checked) => {
                        const fields = [...(content.fields || [])];
                        if (checked && !fields.includes(field)) {
                          fields.push(field);
                        } else if (!checked) {
                          const index = fields.indexOf(field);
                          if (index !== -1) fields.splice(index, 1);
                        }
                        updateContent('fields', fields);
                      }}
                    />
                    <Label htmlFor={`include-${field}`} className="text-sm capitalize">{field}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="submit-text">Submit Button Text</Label>
              <Input
                id="submit-text"
                value={content.submitText || 'Submit'}
                onChange={(e) => updateContent('submitText', e.target.value)}
              />
            </div>
          </div>
        );

      case 'map':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="map-location">Location</Label>
              <Input
                id="map-location"
                placeholder="Address or coordinates"
                value={content.location || ''}
                onChange={(e) => updateContent('location', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter an address or coordinates (e.g., "New York, NY" or "40.7128,-74.0060")
              </p>
            </div>
          </div>
        );
        
      case 'social links':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Display Type</Label>
              <Select
                value={content.displayType || 'icons'}
                onValueChange={(value) => updateContent('displayType', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select display type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="icons">Icons</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="buttons">Buttons</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(content.links || [{ platform: 'twitter', url: '' }, { platform: 'facebook', url: '' }, { platform: 'instagram', url: '' }]).map((link: any, index: number) => (
              <div key={index} className="space-y-2 border p-3 rounded-md">
                <div>
                  <Label htmlFor={`social-platform-${index}`}>Platform</Label>
                  <Select
                    value={link.platform}
                    onValueChange={(value) => {
                      const newLinks = [...(content.links || [])];
                      newLinks[index] = { ...newLinks[index], platform: value };
                      updateContent('links', newLinks);
                    }}
                  >
                    <SelectTrigger id={`social-platform-${index}`}>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twitter">Twitter / X</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="pinterest">Pinterest</SelectItem>
                      <SelectItem value="github">GitHub</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`social-url-${index}`}>URL</Label>
                  <Input
                    id={`social-url-${index}`}
                    placeholder={`https://${link.platform}.com/username`}
                    value={link.url || ''}
                    onChange={(e) => {
                      const newLinks = [...(content.links || [])];
                      newLinks[index] = { ...newLinks[index], url: e.target.value };
                      updateContent('links', newLinks);
                    }}
                  />
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => {
                const links = [...(content.links || [])];
                links.push({ platform: 'twitter', url: '' });
                updateContent('links', links);
              }}
            >
              Add Social Link
            </Button>
          </div>
        );
        
      case 'links':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Display Type</Label>
              <Select
                value={content.displayType || 'buttons'}
                onValueChange={(value) => updateContent('displayType', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select display type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buttons">Buttons</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="pills">Pills</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(content.links || [{ text: 'Link 1', url: '', icon: '' }, { text: 'Link 2', url: '', icon: '' }]).map((link: any, index: number) => (
              <div key={index} className="space-y-2 border p-3 rounded-md">
                <div>
                  <Label htmlFor={`link-text-${index}`}>Link Text</Label>
                  <Input
                    id={`link-text-${index}`}
                    value={link.text || ''}
                    onChange={(e) => {
                      const newLinks = [...(content.links || [])];
                      newLinks[index] = { ...newLinks[index], text: e.target.value };
                      updateContent('links', newLinks);
                    }}
                    placeholder="Link text"
                  />
                </div>
                <div>
                  <Label htmlFor={`link-url-${index}`}>URL</Label>
                  <Input
                    id={`link-url-${index}`}
                    placeholder="https://example.com"
                    value={link.url || ''}
                    onChange={(e) => {
                      const newLinks = [...(content.links || [])];
                      newLinks[index] = { ...newLinks[index], url: e.target.value };
                      updateContent('links', newLinks);
                    }}
                  />
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => {
                const links = [...(content.links || [])];
                links.push({ text: `Link ${links.length + 1}`, url: '', icon: '' });
                updateContent('links', links);
              }}
            >
              Add Link
            </Button>
          </div>
        );
        
      case 'products':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <Label>Display Type</Label>
              <Select
                value={content.displayType || 'grid'}
                onValueChange={(value) => updateContent('displayType', value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select display type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {(content.products || [
              { name: '', description: '', price: '', image: '', link: '' },
              { name: '', description: '', price: '', image: '', link: '' }
            ]).map((product: any, index: number) => (
              <div key={index.toString()} className="space-y-2 border p-3 rounded-md">
                <Label>Product #{index + 1}</Label>
                <div>
                  <Label htmlFor={`product-name-${index.toString()}`} className="text-sm">Name</Label>
                  <Input
                    id={`product-name-${index.toString()}`}
                    value={product.name || ''}
                    onChange={(e) => updateNestedContent(['products', index.toString(), 'name'], e.target.value)}
                    placeholder="Product Name"
                  />
                </div>
                <div>
                  <Label htmlFor={`product-description-${index.toString()}`} className="text-sm">Description</Label>
                  <Textarea
                    id={`product-description-${index.toString()}`}
                    value={product.description || ''}
                    onChange={(e) => updateNestedContent(['products', index.toString(), 'description'], e.target.value)}
                    placeholder="Product description"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor={`product-price-${index.toString()}`} className="text-sm">Price</Label>
                  <Input
                    id={`product-price-${index.toString()}`}
                    value={product.price || ''}
                    onChange={(e) => updateNestedContent(['products', index.toString(), 'price'], e.target.value)}
                    placeholder="29.99"
                  />
                </div>
                <div>
                  <Label htmlFor={`product-image-${index.toString()}`} className="text-sm">Image URL</Label>
                  <Input
                    id={`product-image-${index.toString()}`}
                    value={product.image || ''}
                    onChange={(e) => updateNestedContent(['products', index.toString(), 'image'], e.target.value)}
                    placeholder="https://example.com/product.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor={`product-link-${index.toString()}`} className="text-sm">Product Link</Label>
                  <Input
                    id={`product-link-${index.toString()}`}
                    value={product.link || ''}
                    onChange={(e) => updateNestedContent(['products', index.toString(), 'link'], e.target.value)}
                    placeholder="https://example.com/buy"
                  />
                </div>
              </div>
            ))}
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => {
                const products = [...(content.products || [])];
                products.push({ name: '', description: '', price: '', image: '', link: '' });
                updateContent('products', products);
              }}
            >
              Add Product
            </Button>
          </div>
        );

      default:
        return (
          <div>
            <p className="text-muted-foreground">No editor available for this block type: {block.type}</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {block.type} Block</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {renderContentEditor()}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
