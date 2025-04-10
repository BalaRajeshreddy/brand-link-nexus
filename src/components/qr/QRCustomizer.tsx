
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Download, Share2, Palette, Image, QrCode } from "lucide-react";
import { toast } from "sonner";

interface QRCodeData {
  url: string;
  color: string;
  backgroundColor: string;
  logo: string;
  shape: string;
  frame: string;
}

interface QRCustomizerProps {
  qrData: QRCodeData;
  onBack: () => void;
}

export function QRCustomizer({ qrData, onBack }: QRCustomizerProps) {
  const [customization, setCustomization] = useState(qrData);
  
  const shapes = ['square', 'rounded', 'circular'];
  const frames = ['none', 'square', 'rounded'];
  
  const handleColorChange = (color: string) => {
    setCustomization({
      ...customization,
      color,
    });
  };
  
  const handleShapeChange = (shape: string) => {
    setCustomization({
      ...customization,
      shape,
    });
  };
  
  const handleFrameChange = (frame: string) => {
    setCustomization({
      ...customization,
      frame,
    });
  };
  
  const saveQRCode = () => {
    toast.success("QR Code saved successfully!");
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <Tabs defaultValue="style">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="logo">Logo</TabsTrigger>
            <TabsTrigger value="frame">Frame</TabsTrigger>
          </TabsList>
          
          <TabsContent value="style" className="space-y-4 mt-4">
            <div>
              <Label>Colors</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="foregroundColor" className="text-xs">QR Color</Label>
                  <div className="flex mt-1">
                    <div 
                      className="w-9 h-9 rounded border mr-2" 
                      style={{ backgroundColor: customization.color }}
                    />
                    <Input
                      id="foregroundColor"
                      type="color"
                      value={customization.color}
                      onChange={(e) => handleColorChange(e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="backgroundColor" className="text-xs">Background Color</Label>
                  <div className="flex mt-1">
                    <div 
                      className="w-9 h-9 rounded border mr-2" 
                      style={{ backgroundColor: customization.backgroundColor }}
                    />
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={customization.backgroundColor}
                      onChange={(e) => setCustomization({ ...customization, backgroundColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Label>QR Style</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {shapes.map((shape) => (
                  <div 
                    key={shape}
                    className={`qr-option-card ${customization.shape === shape ? 'selected' : ''}`}
                    onClick={() => handleShapeChange(shape)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-primary/20 rounded flex items-center justify-center">
                        <QrCode size={28} />
                      </div>
                      <span className="text-xs mt-2 capitalize">{shape}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="logo" className="space-y-4 mt-4">
            <div>
              <Label>Upload Logo</Label>
              <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="mt-2">
                  <Button variant="outline">Upload Logo</Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">PNG, JPG or SVG, max 2MB</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="frame" className="space-y-4 mt-4">
            <div>
              <Label>Frame Style</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {frames.map((frame) => (
                  <div 
                    key={frame}
                    className={`qr-option-card ${customization.frame === frame ? 'selected' : ''}`}
                    onClick={() => handleFrameChange(frame)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-primary/20 rounded flex items-center justify-center">
                        <QrCode size={28} />
                      </div>
                      <span className="text-xs mt-2 capitalize">{frame === 'none' ? 'No Frame' : frame}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="text-center">
          <h3 className="font-medium">Preview</h3>
          
          <div className="mt-4 bg-white rounded-lg p-6 shadow-sm mx-auto w-48 h-48 flex items-center justify-center">
            <div className="relative">
              <QrCode size={120} />
              {customization.logo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-1 rounded-md">
                    <img src={customization.logo} alt="Logo" className="w-8 h-8" />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 space-y-3">
            <Button className="w-full" onClick={saveQRCode}>
              <Download className="mr-2 h-4 w-4" />
              Save QR Code
            </Button>
            
            <Button variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
