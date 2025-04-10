
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { QRCustomizer } from "./QRCustomizer";
import { Palette, Link as LinkIcon, LayoutTemplate } from "lucide-react";

export function QRGenerator() {
  const [url, setUrl] = useState('');
  const [qrCodeData, setQRCodeData] = useState({
    url: '',
    color: '#3F51B5',
    backgroundColor: '#FFFFFF',
    logo: '',
    shape: 'square',
    frame: 'none',
  });
  
  const [step, setStep] = useState(1);

  const generateQRCode = () => {
    if (!url) return;
    
    setQRCodeData({
      ...qrCodeData,
      url,
    });
    
    setStep(2);
  };

  return (
    <div className="w-full max-w-3xl mx-auto card-shadow rounded-xl overflow-hidden bg-white">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Create QR Code</h2>
        <p className="text-muted-foreground">Generate custom QR codes for your brand</p>
      </div>

      <div className="p-6">
        {step === 1 ? (
          <div className="space-y-6">
            <Tabs defaultValue="url" className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="url">URL</TabsTrigger>
                <TabsTrigger value="text">Text</TabsTrigger>
                <TabsTrigger value="vcard">vCard</TabsTrigger>
              </TabsList>
              <TabsContent value="url" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="url">Enter URL</Label>
                    <div className="flex mt-1">
                      <div className="relative flex-grow">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="url"
                          placeholder="https://example.com"
                          className="pl-9"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                        />
                      </div>
                      <Button onClick={generateQRCode} className="ml-2" disabled={!url}>
                        Next
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                      <h3 className="font-medium">Landing Page</h3>
                      <p className="text-sm text-muted-foreground mt-1">Create a custom landing page for your QR code</p>
                    </div>
                    <div className="border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors">
                      <h3 className="font-medium">Direct URL</h3>
                      <p className="text-sm text-muted-foreground mt-1">Link directly to any website</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="text" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="text">Enter Text</Label>
                    <div className="flex mt-1">
                      <Input
                        id="text"
                        placeholder="Enter your text here"
                      />
                      <Button className="ml-2">
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="vcard" className="mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" className="mt-1" />
                    </div>
                  </div>
                  <Button className="w-full">
                    Next
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <QRCustomizer qrData={qrCodeData} onBack={() => setStep(1)} />
        )}
      </div>
    </div>
  );
}
