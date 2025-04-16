
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid,
  Image,
  Type,
  Square,
  Youtube,
  Instagram,
  MousePointerClick,
  ChevronRight,
  Plus
} from "lucide-react";

interface ProductEditorSidebarProps {
  onAddComponent: (componentType: string) => void;
}

export function ProductEditorSidebar({ onAddComponent }: ProductEditorSidebarProps) {
  const componentTypes = [
    { 
      category: "Layout",
      items: [
        { name: "Section", icon: <LayoutGrid size={16} />, description: "Container for other components" }
      ]
    },
    { 
      category: "Content",
      items: [
        { name: "Image", icon: <Image size={16} />, description: "Add product images" },
        { name: "Text", icon: <Type size={16} />, description: "Add text and descriptions" },
        { name: "Button", icon: <Square size={16} />, description: "Add interactive buttons" }
      ]
    },
    { 
      category: "Actions",
      items: [
        { name: "Action", icon: <MousePointerClick size={16} />, description: "Add interactive actions" }
      ]
    },
    { 
      category: "Media",
      items: [
        { name: "YouTube", icon: <Youtube size={16} />, description: "Embed YouTube videos" },
        { name: "Instagram", icon: <Instagram size={16} />, description: "Embed Instagram posts" }
      ]
    }
  ];
  
  const templates = [
    { 
      id: "product-basic", 
      name: "Basic Product", 
      description: "Simple layout for showcasing a product",
      components: ["section", "image", "text", "button"]
    },
    { 
      id: "product-gallery", 
      name: "Product Gallery", 
      description: "Showcase multiple product images",
      components: ["section", "image", "image", "image", "text"]
    },
    { 
      id: "product-video", 
      name: "Video Showcase", 
      description: "Feature product with video content",
      components: ["section", "youtube", "text", "button"]
    }
  ];

  const handleTemplateSelect = (template: any) => {
    template.components.forEach((componentType: string) => {
      onAddComponent(componentType);
    });
  };

  return (
    <div className="w-72 border-r bg-white flex flex-col h-full">
      <div className="p-4 border-b bg-white">
        <h3 className="font-medium">Product Designer</h3>
        <p className="text-xs text-muted-foreground mt-1">Add components to build your product page</p>
      </div>
      
      <Tabs defaultValue="components" className="flex-1 flex flex-col">
        <div className="border-b bg-white">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="components" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Components
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Templates
            </TabsTrigger>
            <TabsTrigger 
              value="styles" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Styles
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="components" className="flex-1 mt-0 relative">
          <ScrollArea className="h-[calc(100vh-16rem)] absolute inset-0">
            <div className="p-4 space-y-6 pb-10">
              {componentTypes.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 sticky top-0 py-2 -mx-4 px-4 z-10">
                    <h4 className="text-sm font-medium text-muted-foreground">{category.category}</h4>
                  </div>
                  <div className="space-y-1">
                    {category.items.map((component) => (
                      <Button 
                        key={component.name}
                        variant="ghost"
                        className="w-full justify-start h-auto py-2.5 px-3 hover:bg-gray-50"
                        onClick={() => onAddComponent(component.name.toLowerCase())}
                      >
                        <div className="flex items-center w-full">
                          <span className="mr-2 text-primary">{component.icon}</span>
                          <div className="flex flex-col items-start flex-1 min-w-0">
                            <span className="text-sm font-medium truncate w-full">{component.name}</span>
                            <span className="text-xs text-muted-foreground truncate w-full">{component.description}</span>
                          </div>
                          <ChevronRight size={14} className="ml-2 text-muted-foreground shrink-0" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="templates" className="flex-1 mt-0 relative">
          <ScrollArea className="h-[calc(100vh-16rem)] absolute inset-0">
            <div className="p-4 space-y-4 pb-10">
              {templates.map((template) => (
                <div 
                  key={template.id} 
                  className="border rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="h-32 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">{template.name}</span>
                  </div>
                  <div className="p-3 border-t bg-gray-50">
                    <p className="text-sm font-medium">{template.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="styles" className="flex-1 mt-0 relative">
          <ScrollArea className="h-[calc(100vh-16rem)] absolute inset-0">
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Page Styles</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="border p-3 rounded-lg cursor-pointer hover:border-primary">
                    <div className="h-16 bg-white mb-2"></div>
                    <p className="text-xs">Light Mode</p>
                  </div>
                  <div className="border p-3 rounded-lg cursor-pointer hover:border-primary">
                    <div className="h-16 bg-gray-900 mb-2"></div>
                    <p className="text-xs">Dark Mode</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Color Themes</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-10 bg-blue-500 rounded cursor-pointer"></div>
                  <div className="h-10 bg-green-500 rounded cursor-pointer"></div>
                  <div className="h-10 bg-purple-500 rounded cursor-pointer"></div>
                  <div className="h-10 bg-red-500 rounded cursor-pointer"></div>
                  <div className="h-10 bg-yellow-500 rounded cursor-pointer"></div>
                  <div className="h-10 bg-gray-500 rounded cursor-pointer"></div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      <div className="p-3 border-t bg-gray-50 text-xs text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-1">
          <Plus size={12} />
          <span>Drag components to reorder</span>
        </div>
      </div>
    </div>
  );
}
