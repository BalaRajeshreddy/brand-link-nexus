import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Grip, Trash2, Pencil } from 'lucide-react';
import { ProductComponent } from '@/pages/ProductPageCreator';
import { ProductComponentRenderer } from './ProductComponentRenderer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface ProductEditorComponentProps {
  component: ProductComponent;
  onDeleteComponent: (componentId: string) => void;
  onUpdateComponent: (componentId: string, content: Record<string, any>, styles: Record<string, any>) => void;
}

const ProductEditorComponent = ({ component, onDeleteComponent, onUpdateComponent }: ProductEditorComponentProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState(component.type === 'image' ? component.content.src || '' : '');
  const [imageError, setImageError] = useState('');

  const handleUpdateComponent = (updatedContent: Record<string, any>) => {
    onUpdateComponent(component.id, updatedContent, component.styles);
  };

  const handleImageUrlSubmit = () => {
    if (!imageUrl) {
      setImageError('Please enter an image URL');
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      handleUpdateComponent({
        ...component.content,
        src: imageUrl,
        alt: component.content.alt || 'Product image'
      });
      setShowImageDialog(false);
      setImageError('');
      toast.success('Image updated successfully');
    };
    
    img.onerror = () => {
      setImageError('Invalid image URL or image could not be loaded');
    };
    
    img.src = imageUrl;
  };

  const renderEditor = () => {
    switch (component.type) {
      case 'text':
        return (
          <Textarea
            className="w-full p-2 border rounded"
            value={component.content.text || ""}
            onChange={(e) => handleUpdateComponent({ ...component.content, text: e.target.value })}
            rows={4}
          />
        );
      
      case 'button':
        return (
          <div className="space-y-2">
            <Input
              type="text"
              className="w-full p-2"
              value={component.content.text || ""}
              onChange={(e) => handleUpdateComponent({ ...component.content, text: e.target.value })}
              placeholder="Button Text"
            />
            <Input
              type="text"
              className="w-full p-2"
              value={component.content.url || ""}
              onChange={(e) => handleUpdateComponent({ ...component.content, url: e.target.value })}
              placeholder="URL"
            />
          </div>
        );
      
      case 'image':
        return (
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowImageDialog(true)}
            >
              Edit Image
            </Button>
            <Input
              type="text"
              className="w-full p-2"
              value={component.content.alt || ""}
              onChange={(e) => handleUpdateComponent({ ...component.content, alt: e.target.value })}
              placeholder="Alt Text"
            />
            
            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Image</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="url">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url">Image URL</TabsTrigger>
                    <TabsTrigger value="upload">Upload Image</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="url" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input 
                        id="imageUrl"
                        placeholder="https://example.com/image.jpg" 
                        value={imageUrl}
                        onChange={(e) => {
                          setImageUrl(e.target.value);
                          setImageError('');
                        }}
                      />
                      {imageError && <p className="text-sm text-red-500">{imageError}</p>}
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={handleImageUrlSubmit}>Apply</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upload" className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary">
                      <div className="space-y-1">
                        <div className="flex justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                            <path d="m18 2 4 4-10 10L8 16l4-10z"></path>
                          </svg>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Drag and drop image here or click to browse
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: JPG, PNG, GIF
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-amber-500">
                      Note: Image upload functionality requires backend integration
                    </p>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        );
      
      case 'youtube':
        return (
          <div className="space-y-2">
            <Input
              type="text"
              className="w-full p-2"
              value={component.content.videoId || ""}
              onChange={(e) => handleUpdateComponent({ ...component.content, videoId: e.target.value })}
              placeholder="YouTube Video ID"
            />
            <Input
              type="text"
              className="w-full p-2"
              value={component.content.title || ""}
              onChange={(e) => handleUpdateComponent({ ...component.content, title: e.target.value })}
              placeholder="Video Title"
            />
          </div>
        );
        
      case 'action':
        return (
          <div className="space-y-2">
            <div className="space-y-1">
              <Label>Action Type</Label>
              <select
                className="w-full p-2 border rounded"
                value={component.content.actionType || "link"}
                onChange={(e) => handleUpdateComponent({ 
                  ...component.content, 
                  actionType: e.target.value 
                })}
              >
                <option value="link">External Link</option>
                <option value="scroll">Scroll to Section</option>
                <option value="popup">Show Popup</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <Label>Label</Label>
              <Input
                type="text"
                className="w-full p-2"
                value={component.content.label || ""}
                onChange={(e) => handleUpdateComponent({ ...component.content, label: e.target.value })}
                placeholder="Action Label"
              />
            </div>
            
            <div className="space-y-1">
              <Label>URL/Target</Label>
              <Input
                type="text"
                className="w-full p-2"
                value={component.content.url || ""}
                onChange={(e) => handleUpdateComponent({ ...component.content, url: e.target.value })}
                placeholder={component.content.actionType === 'link' ? "https://example.com" : "#section-id"}
              />
            </div>
          </div>
        );
        
      case 'ingredients':
        return (
          <div className="space-y-2">
            <Textarea
              className="w-full p-2 border rounded"
              value={component.content.list || ""}
              onChange={(e) => handleUpdateComponent({ ...component.content, list: e.target.value })}
              placeholder="Enter ingredients separated by commas"
              rows={4}
            />
          </div>
        );
        
      case 'ratings':
        return (
          <div className="space-y-3">
            <div className="flex items-center">
              <label className="mr-2 text-sm">Overall Rating:</label>
              <select 
                className="p-2 border rounded"
                value={component.content.rating || 4}
                onChange={(e) => handleUpdateComponent({ 
                  ...component.content, 
                  rating: parseFloat(e.target.value) 
                })}
              >
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <label className="mr-2 text-sm">Review Count:</label>
              <Input 
                type="number"
                className="w-24 p-2"
                value={component.content.reviewCount || 0}
                onChange={(e) => handleUpdateComponent({ 
                  ...component.content, 
                  reviewCount: parseInt(e.target.value) 
                })}
              />
            </div>
            
            <h4 className="font-medium text-sm">Reviews:</h4>
            <div className="space-y-2 border p-3 rounded">
              {(component.content.reviews || []).map((review: any, index: number) => (
                <div key={index} className="border-b pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <select 
                      className="p-1 border rounded"
                      value={review.rating}
                      onChange={(e) => {
                        const updatedReviews = [...(component.content.reviews || [])];
                        updatedReviews[index] = {
                          ...review,
                          rating: parseFloat(e.target.value)
                        };
                        handleUpdateComponent({ ...component.content, reviews: updatedReviews });
                      }}
                    >
                      {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        const updatedReviews = [...(component.content.reviews || [])];
                        updatedReviews.splice(index, 1);
                        handleUpdateComponent({ ...component.content, reviews: updatedReviews });
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                  <Input
                    type="text"
                    className="w-full p-1 mb-1 text-sm"
                    value={review.text || ""}
                    onChange={(e) => {
                      const updatedReviews = [...(component.content.reviews || [])];
                      updatedReviews[index] = {
                        ...review,
                        text: e.target.value
                      };
                      handleUpdateComponent({ ...component.content, reviews: updatedReviews });
                    }}
                    placeholder="Review text"
                  />
                  <Input
                    type="text"
                    className="w-full p-1 text-sm"
                    value={review.author || ""}
                    onChange={(e) => {
                      const updatedReviews = [...(component.content.reviews || [])];
                      updatedReviews[index] = {
                        ...review,
                        author: e.target.value
                      };
                      handleUpdateComponent({ ...component.content, reviews: updatedReviews });
                    }}
                    placeholder="Reviewer name"
                  />
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const updatedReviews = component.content.reviews ? [...component.content.reviews] : [];
                  updatedReviews.push({
                    rating: 5,
                    text: "Great product!",
                    author: "Customer"
                  });
                  handleUpdateComponent({ ...component.content, reviews: updatedReviews });
                }}
              >
                Add Review
              </Button>
            </div>
          </div>
        );
      
      case 'story':
        return (
          <div className="space-y-2">
            <Textarea
              className="w-full p-2 border rounded"
              value={component.content.story || ""}
              onChange={(e) => handleUpdateComponent({ ...component.content, story: e.target.value })}
              placeholder="Tell the story of your product or brand"
              rows={6}
            />
          </div>
        );
        
      case 'howmade':
        return (
          <div className="space-y-3">
            <Textarea
              className="w-full p-2 border rounded"
              value={component.content.description || ""}
              onChange={(e) => handleUpdateComponent({ 
                ...component.content, 
                description: e.target.value 
              })}
              placeholder="Describe how your product is made"
              rows={4}
            />
            
            <h4 className="text-sm font-medium">Process Steps:</h4>
            <div className="border p-3 rounded space-y-2">
              {(component.content.steps || []).map((step: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="bg-muted rounded-full w-6 h-6 flex items-center justify-center text-xs">{index + 1}</span>
                  <Input
                    type="text"
                    className="flex-1 p-2"
                    value={step}
                    onChange={(e) => {
                      const updatedSteps = [...(component.content.steps || [])];
                      updatedSteps[index] = e.target.value;
                      handleUpdateComponent({ ...component.content, steps: updatedSteps });
                    }}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => {
                      const updatedSteps = [...(component.content.steps || [])];
                      updatedSteps.splice(index, 1);
                      handleUpdateComponent({ ...component.content, steps: updatedSteps });
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const updatedSteps = component.content.steps ? [...component.content.steps] : [];
                  updatedSteps.push("New step");
                  handleUpdateComponent({ ...component.content, steps: updatedSteps });
                }}
              >
                Add Step
              </Button>
            </div>
          </div>
        );
        
      case 'nutrition':
        return (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Nutrition Facts:</h4>
            <div className="border p-3 rounded space-y-2">
              {Object.entries(component.content.facts || {}).map(([key, value], index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="text"
                    className="flex-grow p-2"
                    value={key}
                    onChange={(e) => {
                      const updatedFacts = { ...component.content.facts };
                      const oldValue = updatedFacts[key];
                      delete updatedFacts[key];
                      updatedFacts[e.target.value] = oldValue;
                      handleUpdateComponent({ ...component.content, facts: updatedFacts });
                    }}
                    placeholder="Nutrition Name"
                  />
                  <Input
                    type="text"
                    className="w-24 p-2"
                    value={value as string}
                    onChange={(e) => {
                      const updatedFacts = { ...component.content.facts };
                      updatedFacts[key] = e.target.value;
                      handleUpdateComponent({ ...component.content, facts: updatedFacts });
                    }}
                    placeholder="Value"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => {
                      const updatedFacts = { ...component.content.facts };
                      delete updatedFacts[key];
                      handleUpdateComponent({ ...component.content, facts: updatedFacts });
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const updatedFacts = component.content.facts ? { ...component.content.facts } : {};
                  updatedFacts[`Item ${Object.keys(updatedFacts).length + 1}`] = "0g";
                  handleUpdateComponent({ ...component.content, facts: updatedFacts });
                }}
              >
                Add Nutrition Fact
              </Button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="p-4 border rounded">
            <p>Edit mode not supported for this component type.</p>
          </div>
        );
    }
  };

  return (
    <div className="relative group border rounded-lg shadow p-4 mb-4 bg-white">
      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onDeleteComponent(component.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 cursor-grab"
        >
          <Grip className="h-4 w-4" />
        </Button>
      </div>

      {isEditing ? (
        <div className="py-2 space-y-4">
          {renderEditor()}
        </div>
      ) : (
        <div className="py-2">
          <ProductComponentRenderer
            type={component.type}
            content={component.content}
            styles={component.styles}
          />
        </div>
      )}
    </div>
  );
};

interface ProductEditorCanvasProps {
  components: ProductComponent[];
  onDeleteComponent: (id: string) => void;
  onUpdateComponent: (id: string, content: Record<string, any>, styles: Record<string, any>) => void;
  pageSettings: {
    backgroundColor: string;
    fontFamily: string;
  };
}

export function ProductEditorCanvas({
  components,
  onDeleteComponent,
  onUpdateComponent,
  pageSettings
}: ProductEditorCanvasProps) {
  return (
    <div className="flex-1 h-full flex flex-col">
      <ScrollArea className="flex-1 h-full">
        <div 
          className="p-8 min-h-full"
          style={{
            backgroundColor: pageSettings.backgroundColor,
            fontFamily: pageSettings.fontFamily
          }}
        >
          <div className="max-w-2xl mx-auto">
            {components.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-muted-foreground mb-4">No components added yet</p>
                <p className="text-muted-foreground text-sm mb-4">Use the sidebar to add components</p>
              </div>
            ) : (
              <div className="space-y-6">
                {components.map((component) => (
                  <ProductEditorComponent
                    key={component.id}
                    component={component}
                    onDeleteComponent={onDeleteComponent}
                    onUpdateComponent={onUpdateComponent}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
