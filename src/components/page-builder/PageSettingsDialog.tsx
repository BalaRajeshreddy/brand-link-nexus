
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LandingPage } from "./PageBuilder";

interface PageSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageData: LandingPage;
  onUpdate: (updatedSettings: Partial<LandingPage>) => void;
}

export function PageSettingsDialog({ open, onOpenChange, pageData, onUpdate }: PageSettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<LandingPage>(pageData);
  
  const handleChange = (key: keyof LandingPage, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    onUpdate({ [key]: value });
  };
  
  const fontFamilies = [
    "Inter, sans-serif",
    "Roboto, sans-serif", 
    "Helvetica, Arial, sans-serif",
    "Georgia, serif",
    "Courier New, monospace"
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Page Settings</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="background-color" className="text-right">
              Background
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <div 
                className="w-6 h-6 border rounded-md" 
                style={{ backgroundColor: localSettings.backgroundColor }}
              />
              <Input
                id="background-color"
                type="color"
                value={localSettings.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="w-14 h-10 p-1"
              />
              <Input 
                type="text"
                value={localSettings.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="font-family" className="text-right">
              Font
            </Label>
            <Select
              value={localSettings.fontFamily}
              onValueChange={(value) => handleChange('fontFamily', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select font family" />
              </SelectTrigger>
              <SelectContent>
                {fontFamilies.map(font => (
                  <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                    {font.split(',')[0]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {localSettings.slug && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="slug" className="text-right">
                Page URL
              </Label>
              <div className="col-span-3">
                <code className="px-2 py-1 bg-gray-100 rounded text-sm">
                  /{localSettings.slug}
                </code>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
