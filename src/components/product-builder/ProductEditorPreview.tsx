
import { ProductComponent } from "@/pages/ProductPageCreator";
import { ProductComponentRenderer } from "./ProductComponentRenderer";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Smartphone, Tablet, Monitor } from "lucide-react";

interface ProductEditorPreviewProps {
  components: ProductComponent[];
  pageSettings: {
    backgroundColor: string;
    fontFamily: string;
  };
}

export function ProductEditorPreview({ components, pageSettings }: ProductEditorPreviewProps) {
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  
  const getDeviceWidth = () => {
    switch(previewDevice) {
      case 'mobile': return '390px';
      case 'tablet': return '768px';
      case 'desktop': return '100%';
      default: return '390px';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-medium">Preview</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-muted-foreground">See how your product page looks on different devices</p>
          
          <div className="flex space-x-1">
            <Button 
              variant={previewDevice === 'mobile' ? "default" : "ghost"} 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setPreviewDevice('mobile')}
            >
              <Smartphone size={16} />
            </Button>
            <Button 
              variant={previewDevice === 'tablet' ? "default" : "ghost"} 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setPreviewDevice('tablet')}
            >
              <Tablet size={16} />
            </Button>
            <Button 
              variant={previewDevice === 'desktop' ? "default" : "ghost"} 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setPreviewDevice('desktop')}
            >
              <Monitor size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-hidden">
        <div 
          className={`mx-auto border border-gray-300 rounded-3xl overflow-hidden transition-all duration-300 ${
            previewDevice === 'desktop' ? 'w-full' : ''
          }`}
          style={{ 
            width: getDeviceWidth(),
            height: previewDevice === 'desktop' ? '100%' : '844px'
          }}
        >
          {previewDevice !== 'desktop' && (
            <div className="bg-black p-2 w-full flex justify-center items-center">
              <div className="bg-gray-800 w-32 h-6 rounded-full"></div>
            </div>
          )}
          <div 
            className="h-full w-full overflow-y-auto"
            style={{
              backgroundColor: pageSettings.backgroundColor,
              fontFamily: pageSettings.fontFamily
            }}
          >
            {components.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">No content added yet</p>
              </div>
            ) : (
              <div className="p-6 space-y-3">
                {components.map((component) => (
                  <div 
                    key={component.id} 
                    className="bg-white rounded-lg"
                  >
                    <ProductComponentRenderer
                      type={component.type}
                      content={component.content}
                      styles={component.styles}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
