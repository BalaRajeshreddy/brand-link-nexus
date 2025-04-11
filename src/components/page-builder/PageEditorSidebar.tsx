
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
  Users,
  Calendar,
  ThumbsUp,
  FormInput,
  Link,
  Clock,
  Layout,
  FileImage,
  FileText as PDFIcon,
  ChevronRight,
  Toggle,
  Plus,
  ArrowUpDown
} from "lucide-react";
import { PageEditorSidebarProps } from "./interfaces";

export function PageEditorSidebar({ onAddBlock }: PageEditorSidebarProps) {
  const blockComponents = [
    { 
      category: "Content",
      items: [
        { name: "Heading", icon: <Type size={16} />, description: "Add a title or subtitle to your page" },
        { name: "Text", icon: <FileText size={16} />, description: "Add paragraphs of text content" },
        { name: "Heading + Text", icon: <Layout size={16} />, description: "Add a heading with descriptive text" }
      ]
    },
    { 
      category: "Media",
      items: [
        { name: "Image", icon: <Image size={16} />, description: "Upload or embed images" },
        { name: "Images", icon: <FileImage size={16} />, description: "Add multiple images as a gallery" },
        { name: "Images + Links", icon: <Link size={16} />, description: "Image gallery with clickable links" },
        { name: "Video", icon: <Video size={16} />, description: "Embed videos from YouTube or other sources" },
        { name: "PDF Gallery", icon: <PDFIcon size={16} />, description: "Display PDF documents" }
      ]
    },
    { 
      category: "Interaction",
      items: [
        { name: "Button", icon: <ShoppingCart size={16} />, description: "Add a call-to-action button" },
        { name: "Links", icon: <Link size={16} />, description: "Add multiple custom links" },
        { name: "Social Links", icon: <Share2 size={16} />, description: "Add links to your social media profiles" },
        { name: "Form", icon: <FormInput size={16} />, description: "Add custom form fields" },
        { name: "Contact Form", icon: <Mail size={16} />, description: "Add a form for visitors to contact you" },
        { name: "Smart Feedback", icon: <ThumbsUp size={16} />, description: "Interactive feedback collection" }
      ]
    },
    { 
      category: "Information",
      items: [
        { name: "Testimonials", icon: <MessageSquare size={16} />, description: "Add customer reviews and feedback" },
        { name: "Map", icon: <Map size={16} />, description: "Show your location on a map" },
        { name: "Team", icon: <Users size={16} />, description: "Showcase your team members" },
        { name: "Products", icon: <ShoppingCart size={16} />, description: "Display products or services" },
        { name: "Appointment/Calendar", icon: <Calendar size={16} />, description: "Schedule appointments" },
        { name: "Business Hours", icon: <Clock size={16} />, description: "Display business hours" },
        { name: "Other Details", icon: <FileText size={16} />, description: "Add miscellaneous information" }
      ]
    },
    { 
      category: "Layout",
      items: [
        { name: "Image + Text", icon: <Layout size={16} />, description: "Combine images with descriptive text" }
      ]
    }
  ];
  
  const templates = [
    { 
      id: "business", 
      name: "Business", 
      description: "Professional layout for company websites",
      blocks: ["heading", "text", "image", "testimonials", "team", "contact form"]
    },
    { 
      id: "product", 
      name: "Product Showcase", 
      description: "Highlight features of a product or service",
      blocks: ["heading", "image", "text", "button", "testimonials"]
    },
    { 
      id: "event", 
      name: "Event", 
      description: "Promote an upcoming event or conference",
      blocks: ["heading", "text", "image", "map", "button"]
    },
    { 
      id: "restaurant", 
      name: "Restaurant", 
      description: "Menu and information for food businesses",
      blocks: ["heading", "image", "text", "map", "contact form"]
    },
    { 
      id: "portfolio", 
      name: "Portfolio", 
      description: "Showcase your work and projects",
      blocks: ["heading", "image", "text", "social links"]
    },
    { 
      id: "service", 
      name: "Service", 
      description: "Promote professional services",
      blocks: ["heading", "text", "image", "testimonials", "contact form"]
    },
  ];

  const handleTemplateSelect = (template: any) => {
    // This would need to be implemented by passing template blocks to the parent
    template.blocks.forEach((blockType: string) => {
      onAddBlock(blockType);
    });
  };

  return (
    <div className="w-72 border-r bg-white flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-medium">Page Editor</h3>
        <p className="text-xs text-muted-foreground mt-1">Add blocks to build your page</p>
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
            <div className="p-4 space-y-4">
              {blockComponents.map((category) => (
                <div key={category.category} className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">{category.category}</h4>
                  <div className="space-y-1">
                    {category.items.map((block) => (
                      <Button 
                        key={block.name}
                        variant="ghost"
                        className="w-full justify-start h-auto py-2.5 px-3"
                        onClick={() => onAddBlock(block.name.toLowerCase())}
                      >
                        <div className="flex items-center w-full">
                          <span className="mr-2 text-primary">{block.icon}</span>
                          <span className="text-sm">{block.name}</span>
                          <ChevronRight size={14} className="ml-auto text-muted-foreground" />
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="py-4 border-t mt-4">
                <Button 
                  className="w-full flex items-center"
                  onClick={() => onAddBlock('heading')}
                >
                  <Plus size={16} className="mr-2" />
                  Add Component
                </Button>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="templates" className="p-0 flex-1 overflow-hidden mt-0">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
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
      </Tabs>
      
      <div className="p-3 border-t bg-gray-50 text-xs text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-1">
          <ArrowUpDown size={12} />
          <span>Drag & drop blocks to reorder</span>
        </div>
      </div>
    </div>
  );
}
