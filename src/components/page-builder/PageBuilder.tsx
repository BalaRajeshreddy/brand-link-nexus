
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageEditorSidebar } from "./PageEditorSidebar";
import { PageEditorCanvas } from "./PageEditorCanvas";
import { PageEditorPreview } from "./PageEditorPreview";
import { SaveIcon, Share2, Smartphone } from "lucide-react";
import { toast } from "sonner";

export function PageBuilder() {
  const [pageTitle, setPageTitle] = useState("Untitled Landing Page");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [blocks, setBlocks] = useState<any[]>([]);
  
  const handleSave = () => {
    toast.success("Landing page saved successfully!");
  };

  const handleAddBlock = (blockType: string) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type: blockType,
      content: `New ${blockType} block`,
    };
    
    setBlocks([...blocks, newBlock]);
  };
  
  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b py-3 px-6 flex items-center justify-between bg-white">
        <div className="flex items-center">
          <Input
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            className="border-none text-lg font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 w-auto"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowMobilePreview(!showMobilePreview)}>
            <Smartphone />
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleSave}>
            <SaveIcon className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <PageEditorSidebar onAddBlock={handleAddBlock} />
        
        <div className="flex-1 overflow-hidden flex">
          <div className={`flex-1 ${showMobilePreview ? 'w-2/3' : 'w-full'} h-full overflow-hidden`}>
            <PageEditorCanvas blocks={blocks} onDeleteBlock={handleDeleteBlock} />
          </div>
          
          {showMobilePreview && (
            <div className="w-1/3 border-l bg-gray-50">
              <PageEditorPreview blocks={blocks} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
