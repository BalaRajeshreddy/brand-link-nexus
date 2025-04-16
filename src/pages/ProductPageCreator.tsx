
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductEditorSidebar } from "@/components/product-builder/ProductEditorSidebar";
import { ProductEditorCanvas } from "@/components/product-builder/ProductEditorCanvas";
import { ProductEditorPreview } from "@/components/product-builder/ProductEditorPreview";
import { Save, Share2, Smartphone, Settings } from "lucide-react";
import { toast } from "sonner";

export interface ProductComponent {
  id: string;
  type: string;
  content: Record<string, any>;
  styles: Record<string, any>;
}

export default function ProductPageCreator() {
  const [pageTitle, setPageTitle] = useState("Untitled Product Page");
  const [components, setComponents] = useState<ProductComponent[]>([]);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [pageSettings, setPageSettings] = useState({
    backgroundColor: "#FFFFFF",
    fontFamily: "Inter, sans-serif",
  });
  const navigate = useNavigate();

  const handleAddComponent = (componentType: string) => {
    const newComponent = {
      id: `component-${Date.now()}`,
      type: componentType,
      content: getDefaultContentForComponentType(componentType),
      styles: getDefaultStylesForComponentType(componentType),
    };
    
    setComponents([...components, newComponent]);
  };
  
  const handleDeleteComponent = (componentId: string) => {
    setComponents(components.filter(component => component.id !== componentId));
  };
  
  const handleUpdateComponent = (componentId: string, updatedContent: Record<string, any>, updatedStyles: Record<string, any>) => {
    setComponents(components.map(component => 
      component.id === componentId 
        ? { ...component, content: updatedContent, styles: updatedStyles } 
        : component
    ));
  };

  const handleSave = () => {
    toast.success("Product page saved!");
    // In a real implementation, we would save the product page to a database
    setTimeout(() => navigate("/dashboard/brand/product-design"), 1500);
  };

  const getDefaultContentForComponentType = (componentType: string): Record<string, any> => {
    switch (componentType) {
      case 'section':
        return { title: "New Section" };
      case 'image':
        return { src: "", alt: "Product Image" };
      case 'button':
        return { text: "Click Here", url: "" };
      case 'text':
        return { text: "Add your product description here." };
      case 'action':
        return { actionType: "link", label: "Learn More", url: "" };
      case 'youtube':
        return { videoId: "", title: "YouTube Video" };
      case 'instagram':
        return { postUrl: "", title: "Instagram Post" };
      default:
        return {};
    }
  };
  
  const getDefaultStylesForComponentType = (componentType: string): Record<string, any> => {
    const baseStyles = {
      padding: "16px",
      margin: "8px 0px",
      borderRadius: "4px",
    };
    
    switch (componentType) {
      case 'section':
        return { 
          ...baseStyles, 
          height: "auto",
          width: "auto",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#e2e8f0"
        };
      case 'image':
        return { 
          ...baseStyles, 
          width: "100%", 
          height: "auto" 
        };
      case 'button':
        return { 
          ...baseStyles, 
          backgroundColor: "#3B82F6", 
          color: "#FFFFFF",
          padding: "8px 16px",
          borderRadius: "4px",
          fontSize: "14px"
        };
      case 'text':
        return { 
          ...baseStyles, 
          fontSize: "16px",
          lineHeight: "1.5",
          color: "#1F2937"
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b py-3 px-6 flex items-center justify-between bg-white">
        <div className="flex items-center">
          <Input
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            className="border-none text-lg font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 w-auto"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => {}}
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
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <ProductEditorSidebar onAddComponent={handleAddComponent} />
        
        <div className="flex-1 overflow-hidden flex">
          <div className={`flex-1 ${showMobilePreview ? 'w-1/2' : 'w-full'} h-full overflow-hidden`}>
            <ProductEditorCanvas 
              components={components} 
              onDeleteComponent={handleDeleteComponent}
              onUpdateComponent={handleUpdateComponent}
              pageSettings={pageSettings}
            />
          </div>
          
          {showMobilePreview && (
            <div className="w-1/2 border-l bg-gray-50">
              <ProductEditorPreview 
                components={components} 
                pageSettings={pageSettings}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
