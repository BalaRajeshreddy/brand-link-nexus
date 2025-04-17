import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductEditorSidebar } from "@/components/product-builder/ProductEditorSidebar";
import { ProductEditorCanvas } from "@/components/product-builder/ProductEditorCanvas";
import { ProductEditorPreview } from "@/components/product-builder/ProductEditorPreview";
import { Save, Share2, Smartphone, Settings } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export interface ProductComponent {
  id: string;
  type: string;
  content: Record<string, any>;
  styles: Record<string, any>;
}

const backgroundColors = [
  { value: "#FFFFFF", label: "White" },
  { value: "#F1F0FB", label: "Soft Gray" },
  { value: "#E5DEFF", label: "Soft Purple" },
  { value: "#D3E4FD", label: "Soft Blue" },
  { value: "#F2FCE2", label: "Soft Green" },
  { value: "#FEF7CD", label: "Soft Yellow" },
  { value: "#FDE1D3", label: "Soft Peach" },
  { value: "#FFDEE2", label: "Soft Pink" },
];

const fontFamilies = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Playfair Display', serif", label: "Playfair Display" },
  { value: "'Roboto', sans-serif", label: "Roboto" },
  { value: "'Open Sans', sans-serif", label: "Open Sans" },
];

export default function ProductPageCreator() {
  const [pageTitle, setPageTitle] = useState("Untitled Product Page");
  const [components, setComponents] = useState<ProductComponent[]>([]);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [pageSettings, setPageSettings] = useState({
    backgroundColor: "#FFFFFF",
    fontFamily: "Inter, sans-serif",
  });
  const [showPageSettings, setShowPageSettings] = useState(false);
  const [isSaving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  useEffect(() => {
    // If we're in edit mode, fetch the existing product design
    if (isEditMode) {
      const fetchProductDesign = async () => {
        try {
          setIsLoading(true);
          
          const { data, error } = await supabase
            .from('product_designs')
            .select('*')
            .eq('id', id)
            .single();

          if (error) {
            toast.error("Failed to load product design");
            console.error("Error fetching product:", error);
            setIsLoading(false);
            return;
          }

          if (data) {
            console.log("Loaded product design:", data);
            setPageTitle(data.title || "Untitled Product Page");
            
            // Set components from the stored data
            if (data.content && data.content.components) {
              setComponents(data.content.components);
            }
            
            // Set page settings
            if (data.content && data.content.pageSettings) {
              setPageSettings({
                backgroundColor: data.content.pageSettings.backgroundColor || "#FFFFFF",
                fontFamily: data.content.pageSettings.fontFamily || "Inter, sans-serif",
              });
            }
          }
          
          setIsLoading(false);
        } catch (err) {
          console.error("Error loading product design:", err);
          toast.error("Failed to load product design");
          setIsLoading(false);
        }
      };

      fetchProductDesign();
    } else {
      setIsLoading(false);
    }
  }, [id, isEditMode]);

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

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You need to be logged in to save products");
        setSaving(false);
        return;
      }

      const productPageData = {
        title: pageTitle,
        components,
        pageSettings,
      };
      
      if (isEditMode) {
        // Update existing product design
        const { error } = await supabase
          .from('product_designs')
          .update({
            title: pageTitle,
            content: productPageData,
          })
          .eq('id', id);
        
        if (error) {
          console.error("Update error:", error);
          toast.error("Failed to update product page. Please try again.");
          setSaving(false);
          return;
        }
        
        toast.success("Product page updated successfully!");
      } else {
        // Create new product design
        const { error } = await supabase
          .from('product_designs')
          .insert({
            title: pageTitle,
            content: productPageData,
            user_id: session.user.id
          });
        
        if (error) {
          console.error("Save error:", error);
          toast.error("Failed to save product page. Please try again.");
          setSaving(false);
          return;
        }
        
        toast.success("Product page saved successfully!");
      }
      
      setSaving(false);
      
      // Navigate after a slight delay to allow the toast to be seen
      setTimeout(() => navigate("/dashboard/brand/product-design"), 1000);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save product page. Please try again.");
      setSaving(false);
    }
  };

  const updatePageSettings = (key: string, value: string) => {
    setPageSettings({
      ...pageSettings,
      [key]: value
    });
  };

  const getDefaultContentForComponentType = (componentType: string): Record<string, any> => {
    switch (componentType) {
      case 'section':
        return { title: "New Section" };
      case 'image':
        return { src: "", alt: "Product Image" };
      case 'button':
        return { text: "Buy Now", url: "" };
      case 'text':
        return { text: "Add your product description here." };
      case 'action':
        return { actionType: "link", label: "Learn More", url: "" };
      case 'youtube':
        return { videoId: "", title: "YouTube Video" };
      case 'instagram':
        return { postUrl: "", title: "Instagram Post" };
      case 'ingredients':
        return { list: "Ingredient 1, Ingredient 2, Ingredient 3" };
      case 'ratings':
        return { 
          rating: 4.5,
          reviewCount: 42,
          reviews: [
            { rating: 5, text: "Great product! Would buy again.", author: "John D." },
            { rating: 4, text: "Very good quality.", author: "Sarah M." }
          ]
        };
      case 'story':
        return { 
          story: "Our story begins with a passion for quality and innovation. We believe in creating products that not only deliver exceptional value but also contribute to a better world."
        };
      case 'howmade':
        return { 
          description: "Our product is crafted with care using traditional methods and modern technology.", 
          steps: [
            "Select the finest ingredients",
            "Combine using our proprietary process",
            "Quality check at every stage",
            "Package with sustainable materials"
          ] 
        };
      case 'nutrition':
        return { 
          facts: {
            "Calories": "120",
            "Total Fat": "0g",
            "Sodium": "5mg",
            "Total Carbohydrate": "30g",
            "Sugars": "25g",
            "Protein": "0g"
          }
        };
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
      case 'ingredients':
      case 'ratings':
      case 'story':
      case 'howmade':
      case 'nutrition':
        return {
          ...baseStyles,
          backgroundColor: "#FFFFFF",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: "#e2e8f0",
          borderRadius: "8px",
        };
      default:
        return baseStyles;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userType="Brand" userName="Brand User">
        <div className="h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Loading product design...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="Brand" userName="Brand User">
      <div className="h-[calc(100vh-64px)] flex flex-col">
        <div className="border-b py-3 px-6 flex items-center justify-between bg-white">
          <div className="flex items-center">
            <Input
              value={pageTitle}
              onChange={(e) => setPageTitle(e.target.value)}
              className="border-none text-lg font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 w-auto"
            />
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={showPageSettings} onOpenChange={setShowPageSettings}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Page Settings"
                >
                  <Settings size={18} />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Page Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {backgroundColors.map((color) => (
                        <div 
                          key={color.value} 
                          className={`h-10 rounded-md cursor-pointer flex items-center justify-center border-2 ${
                            pageSettings.backgroundColor === color.value 
                              ? 'border-primary' 
                              : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => updatePageSettings('backgroundColor', color.value)}
                        >
                          {pageSettings.backgroundColor === color.value && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Font Family</Label>
                    <Select 
                      value={pageSettings.fontFamily}
                      onValueChange={(value) => updatePageSettings('fontFamily', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select font family" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilies.map((font) => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
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
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : isEditMode ? 'Update' : 'Save'}
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
    </DashboardLayout>
  );
}
