
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Type, 
  Image, 
  Video, 
  FileText, 
  MessageSquare,
  Map, 
  Share2, 
  ShoppingCart,
  Mail,
  Users
} from "lucide-react";

interface PageEditorSidebarProps {
  onAddBlock: (blockType: string) => void;
}

export function PageEditorSidebar({ onAddBlock }: PageEditorSidebarProps) {
  const blockComponents = [
    { name: "Heading", icon: <Type size={16} /> },
    { name: "Text", icon: <FileText size={16} /> },
    { name: "Image", icon: <Image size={16} /> },
    { name: "Video", icon: <Video size={16} /> },
    { name: "Testimonials", icon: <MessageSquare size={16} /> },
    { name: "Map", icon: <Map size={16} /> },
    { name: "Social Links", icon: <Share2 size={16} /> },
    { name: "Buy Button", icon: <ShoppingCart size={16} /> },
    { name: "Contact Form", icon: <Mail size={16} /> },
    { name: "Team", icon: <Users size={16} /> },
  ];
  
  const templates = [
    { id: "business", name: "Business" },
    { id: "product", name: "Product Showcase" },
    { id: "event", name: "Event" },
    { id: "restaurant", name: "Restaurant" },
    { id: "portfolio", name: "Portfolio" },
    { id: "service", name: "Service" },
  ];

  return (
    <div className="w-72 border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium">Page Editor</h3>
      </div>
      
      <Tabs defaultValue="blocks" className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="blocks" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Blocks
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Templates
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="blocks" className="p-0 flex-1 overflow-hidden mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 grid grid-cols-2 gap-2">
              {blockComponents.map((block) => (
                <Button 
                  key={block.name}
                  variant="outline"
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => onAddBlock(block.name.toLowerCase())}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{block.icon}</span>
                    <span className="text-xs">{block.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="templates" className="p-0 flex-1 overflow-hidden mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg overflow-hidden cursor-pointer hover:border-primary">
                  <div className="h-32 bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">{template.name}</span>
                  </div>
                  <div className="p-2 border-t bg-gray-50">
                    <p className="text-sm font-medium">{template.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
