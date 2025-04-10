
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Block } from "./PageBuilder";

interface BlockEditorProps {
  block: Block;
  onSave: (blockId: string, content: Record<string, any>, styles: Record<string, any>) => void;
  onCancel: () => void;
}

export function BlockEditor({ block, onSave, onCancel }: BlockEditorProps) {
  const [content, setContent] = useState<Record<string, any>>(block.content);
  const [styles, setStyles] = useState<Record<string, any>>(block.styles);
  
  const updateContent = (key: string, value: any) => {
    setContent((prev) => ({
      ...prev,
      [key]: value,
    }));
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
  
  const updateStyle = (key: string, value: any) => {
    setStyles((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  
  const handleSave = () => {
    onSave(block.id, content, styles);
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
      
      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="image-src">Image URL</Label>
              <Input
                id="image-src"
                placeholder="https://example.com/image.jpg"
                value={content.src || ''}
                onChange={(e) => updateContent('src', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter the URL of the image you want to display
              </p>
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
      
      case 'buy button':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="button-text">Button Text</Label>
              <Input
                id="button-text"
                value={content.text || 'Buy Now'}
                onChange={(e) => updateContent('text', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="button-url">Button URL</Label>
              <Input
                id="button-url"
                placeholder="https://example.com/buy"
                value={content.url || ''}
                onChange={(e) => updateContent('url', e.target.value)}
              />
            </div>
          </div>
        );
      
      case 'testimonials':
        return (
          <div className="space-y-4">
            {(content.testimonials || [{ text: '', author: '' }, { text: '', author: '' }]).map((testimonial: any, index: number) => (
              <div key={index.toString()} className="space-y-2 border p-3 rounded-md">
                <Label>Testimonial #{index + 1}</Label>
                <div>
                  <Label htmlFor={`testimonial-text-${index}`} className="text-sm">Quote</Label>
                  <Textarea
                    id={`testimonial-text-${index}`}
                    value={testimonial.text || ''}
                    onChange={(e) => updateNestedContent(['testimonials', index, 'text'], e.target.value)}
                    placeholder="This product is amazing!"
                  />
                </div>
                <div>
                  <Label htmlFor={`testimonial-author-${index}`} className="text-sm">Author</Label>
                  <Input
                    id={`testimonial-author-${index}`}
                    value={testimonial.author || ''}
                    onChange={(e) => updateNestedContent(['testimonials', index, 'author'], e.target.value)}
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
        
      case 'team':
        return (
          <div className="space-y-4">
            {(content.members || [{ name: '', role: '', photo: '' }, { name: '', role: '', photo: '' }, { name: '', role: '', photo: '' }]).map((member: any, index: number) => (
              <div key={index.toString()} className="space-y-2 border p-3 rounded-md">
                <Label>Team Member #{index + 1}</Label>
                <div>
                  <Label htmlFor={`member-name-${index}`} className="text-sm">Name</Label>
                  <Input
                    id={`member-name-${index}`}
                    value={member.name || ''}
                    onChange={(e) => updateNestedContent(['members', index, 'name'], e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor={`member-role-${index}`} className="text-sm">Role</Label>
                  <Input
                    id={`member-role-${index}`}
                    value={member.role || ''}
                    onChange={(e) => updateNestedContent(['members', index, 'role'], e.target.value)}
                    placeholder="CEO"
                  />
                </div>
                <div>
                  <Label htmlFor={`member-photo-${index}`} className="text-sm">Photo URL</Label>
                  <Input
                    id={`member-photo-${index}`}
                    value={member.photo || ''}
                    onChange={(e) => updateNestedContent(['members', index, 'photo'], e.target.value)}
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
        
      // Add more case handlers for other block types as needed
      
      default:
        return (
          <div className="p-4 border rounded-md bg-gray-50">
            <p className="text-sm text-muted-foreground">
              Content editing not yet implemented for {block.type} blocks.
            </p>
          </div>
        );
    }
  };
  
  const renderStylesEditor = () => {
    return (
      <div className="space-y-4">
        {/* Text Color */}
        <div>
          <Label htmlFor="text-color" className="mb-1">Text Color</Label>
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 border rounded-md" 
              style={{ backgroundColor: styles.textColor }}
            />
            <Input
              id="text-color"
              type="color"
              value={styles.textColor || '#000000'}
              onChange={(e) => updateStyle('textColor', e.target.value)}
              className="w-14 h-10 p-1"
            />
            <Input 
              type="text"
              value={styles.textColor || '#000000'}
              onChange={(e) => updateStyle('textColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        {/* Background Color */}
        <div>
          <Label htmlFor="background-color" className="mb-1">Background Color</Label>
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 border rounded-md" 
              style={{ backgroundColor: styles.backgroundColor === 'transparent' ? '#ffffff' : styles.backgroundColor }}
            />
            <Input
              id="background-color"
              type="color"
              value={styles.backgroundColor === 'transparent' ? '#ffffff' : styles.backgroundColor || '#ffffff'}
              onChange={(e) => updateStyle('backgroundColor', e.target.value === '#ffffff' ? 'transparent' : e.target.value)}
              className="w-14 h-10 p-1"
            />
            <Input 
              type="text"
              value={styles.backgroundColor || 'transparent'}
              onChange={(e) => updateStyle('backgroundColor', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        {/* Padding */}
        <div>
          <Label htmlFor="padding" className="mb-1">Padding</Label>
          <Select
            value={styles.padding || '16px'}
            onValueChange={(value) => updateStyle('padding', value)}
          >
            <SelectTrigger id="padding">
              <SelectValue placeholder="Select padding" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0px">None</SelectItem>
              <SelectItem value="8px">Small (8px)</SelectItem>
              <SelectItem value="16px">Medium (16px)</SelectItem>
              <SelectItem value="24px">Large (24px)</SelectItem>
              <SelectItem value="32px">Extra Large (32px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Border Radius */}
        <div>
          <Label htmlFor="border-radius" className="mb-1">Border Radius</Label>
          <Select
            value={styles.borderRadius || '4px'}
            onValueChange={(value) => updateStyle('borderRadius', value)}
          >
            <SelectTrigger id="border-radius">
              <SelectValue placeholder="Select border radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0px">None</SelectItem>
              <SelectItem value="4px">Small (4px)</SelectItem>
              <SelectItem value="8px">Medium (8px)</SelectItem>
              <SelectItem value="16px">Large (16px)</SelectItem>
              <SelectItem value="9999px">Rounded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Text Alignment */}
        <div>
          <Label htmlFor="text-align" className="mb-1">Text Alignment</Label>
          <Select
            value={styles.textAlign || 'left'}
            onValueChange={(value: any) => updateStyle('textAlign', value)}
          >
            <SelectTrigger id="text-align">
              <SelectValue placeholder="Select text alignment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Add more style options as needed */}
      </div>
    );
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit {block.type.charAt(0).toUpperCase() + block.type.slice(1)} Block</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="content">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="styles">Styles</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="space-y-4 py-4">
            {renderContentEditor()}
          </TabsContent>
          
          <TabsContent value="styles" className="space-y-4 py-4">
            {renderStylesEditor()}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
