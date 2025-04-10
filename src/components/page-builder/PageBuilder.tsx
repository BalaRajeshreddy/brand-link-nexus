
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageEditorSidebar } from "./PageEditorSidebar";
import { PageEditorCanvas } from "./PageEditorCanvas";
import { PageEditorPreview } from "./PageEditorPreview";
import { SaveIcon, Share2, Smartphone, Settings } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PageSettingsDialog } from "./PageSettingsDialog";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

export interface Block {
  id: string;
  type: string;
  content: Record<string, any>;
  styles: Record<string, any>;
}

export interface LandingPage {
  id?: string;
  title: string;
  slug?: string;
  backgroundColor: string;
  fontFamily: string;
  published: boolean;
}

export function PageBuilder() {
  const [pageData, setPageData] = useState<LandingPage>({
    title: "Untitled Landing Page",
    backgroundColor: "#FFFFFF",
    fontFamily: "Inter, sans-serif",
    published: false,
  });
  
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pageId, setPageId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  // Setup DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleAddBlock = (blockType: string) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      content: getDefaultContentForBlockType(blockType),
      styles: getDefaultStylesForBlockType(blockType),
    };
    
    setBlocks([...blocks, newBlock]);
  };
  
  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over.id);
        
        return arrayMove(blocks, oldIndex, newIndex);
      });
    }
  };
  
  const handleUpdateBlock = (blockId: string, updatedContent: Record<string, any>, updatedStyles: Record<string, any>) => {
    setBlocks(blocks.map(block => 
      block.id === blockId 
        ? { ...block, content: updatedContent, styles: updatedStyles } 
        : block
    ));
  };
  
  const handlePageSettingsChange = (updatedSettings: Partial<LandingPage>) => {
    setPageData({ ...pageData, ...updatedSettings });
  };

  const savePage = async () => {
    try {
      setIsSaving(true);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You need to be logged in to save a page");
        navigate("/auth");
        return;
      }
      
      let landingPageId = pageId;
      
      // If page doesn't exist yet, create it first
      if (!landingPageId) {
        const { data: pageData, error: pageError } = await supabase
          .from('landing_pages')
          .insert({
            title: pageData.title,
            background_color: pageData.backgroundColor,
            font_family: pageData.fontFamily,
            user_id: user.id,
          })
          .select('id, slug')
          .single();
        
        if (pageError) {
          throw pageError;
        }
        
        landingPageId = pageData.id;
        setPageId(landingPageId);
        toast.success(`Page created with slug: ${pageData.slug}`);
      } else {
        // Update existing page
        const { error: updateError } = await supabase
          .from('landing_pages')
          .update({
            title: pageData.title,
            background_color: pageData.backgroundColor,
            font_family: pageData.fontFamily,
          })
          .eq('id', landingPageId);
          
        if (updateError) {
          throw updateError;
        }
      }
      
      // Delete existing components first to avoid conflicts
      if (landingPageId) {
        await supabase
          .from('page_components')
          .delete()
          .eq('page_id', landingPageId);
      }
      
      // Insert all components with updated positions
      if (blocks.length > 0) {
        const componentsToInsert = blocks.map((block, index) => ({
          page_id: landingPageId,
          type: block.type,
          content: block.content,
          position: index,
          styles: block.styles,
        }));
        
        const { error: componentsError } = await supabase
          .from('page_components')
          .insert(componentsToInsert);
          
        if (componentsError) {
          throw componentsError;
        }
      }
      
      toast.success("Landing page saved successfully!");
    } catch (error) {
      console.error("Error saving landing page:", error);
      toast.error("Failed to save landing page");
    } finally {
      setIsSaving(false);
    }
  };
  
  const getDefaultContentForBlockType = (blockType: string): Record<string, any> => {
    switch (blockType) {
      case 'heading':
        return { text: "Add Your Heading Here" };
      case 'text':
        return { text: "Add your text content here. This can be a paragraph explaining your product, service, or any information you want to share with your audience." };
      case 'image':
        return { src: "", alt: "Image description" };
      case 'video':
        return { src: "", thumbnail: "" };
      case 'testimonials':
        return { 
          testimonials: [
            { text: "This product is amazing!", author: "John Doe" },
            { text: "I love using this service!", author: "Jane Smith" }
          ] 
        };
      case 'map':
        return { location: "New York, NY" };
      case 'social links':
        return { 
          links: [
            { platform: "twitter", url: "" },
            { platform: "facebook", url: "" },
            { platform: "instagram", url: "" }
          ] 
        };
      case 'buy button':
        return { text: "Buy Now", url: "" };
      case 'contact form':
        return { 
          fields: ["name", "email", "message"],
          submitText: "Submit"
        };
      case 'team':
        return { 
          members: [
            { name: "Team Member 1", role: "CEO", photo: "" },
            { name: "Team Member 2", role: "CTO", photo: "" },
            { name: "Team Member 3", role: "Designer", photo: "" }
          ] 
        };
      default:
        return {};
    }
  };
  
  const getDefaultStylesForBlockType = (blockType: string): Record<string, any> => {
    const baseStyles = {
      backgroundColor: "transparent",
      textColor: "#000000",
      padding: "16px",
      borderRadius: "4px",
      textAlign: "left" as "left" | "center" | "right"
    };
    
    switch (blockType) {
      case 'heading':
        return { ...baseStyles, fontSize: "32px", fontWeight: "bold" };
      case 'text':
        return { ...baseStyles, fontSize: "16px" };
      case 'buy button':
        return { 
          ...baseStyles, 
          backgroundColor: "#3B82F6", 
          textColor: "#FFFFFF",
          borderRadius: "8px",
          textAlign: "center",
          padding: "12px 24px"
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b py-3 px-6 flex items-center justify-between bg-white">
        <div className="flex items-center">
          <Input
            value={pageData.title}
            onChange={(e) => setPageData({...pageData, title: e.target.value})}
            className="border-none text-lg font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 w-auto"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowSettings(true)}
            title="Page Settings"
          >
            <Settings size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            title="Toggle Mobile Preview"
          >
            <Smartphone size={18} />
          </Button>
          <Button variant="outline" disabled={!pageId}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={savePage} disabled={isSaving}>
            <SaveIcon className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <PageEditorSidebar onAddBlock={handleAddBlock} />
        
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 overflow-hidden flex">
            <div className={`flex-1 ${showMobilePreview ? 'w-2/3' : 'w-full'} h-full overflow-hidden`}>
              <SortableContext
                items={blocks.map(block => block.id)}
                strategy={verticalListSortingStrategy}
              >
                <PageEditorCanvas 
                  blocks={blocks} 
                  onDeleteBlock={handleDeleteBlock}
                  onUpdateBlock={handleUpdateBlock}
                  pageStyles={{
                    backgroundColor: pageData.backgroundColor,
                    fontFamily: pageData.fontFamily
                  }}
                />
              </SortableContext>
            </div>
            
            {showMobilePreview && (
              <div className="w-1/3 border-l bg-gray-50">
                <PageEditorPreview 
                  blocks={blocks} 
                  pageStyles={{
                    backgroundColor: pageData.backgroundColor,
                    fontFamily: pageData.fontFamily
                  }}
                />
              </div>
            )}
          </div>
        </DndContext>
      </div>
      
      <PageSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        pageData={pageData}
        onUpdate={handlePageSettingsChange}
      />
    </div>
  );
}
