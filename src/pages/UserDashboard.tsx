
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, LayoutPanelLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const UserDashboard = () => {
  return (
    <DashboardLayout userType="User" userName="John Doe">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Browse QR Codes & Landing Pages</h1>
        </div>
        
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search QR codes and landing pages..." 
            className="pl-9"
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Featured QR Codes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="dashboard-card">
                <CardContent className="p-0">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Product QR {i + 1}</h3>
                        <p className="text-xs text-muted-foreground">By Brand Name</p>
                      </div>
                      <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center">
                        <QrCode size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="text-sm">
                      <span className="block text-muted-foreground">Category</span>
                      <span>Retail</span>
                    </div>
                    <div className="text-sm mt-2">
                      <span className="block text-muted-foreground">Scans</span>
                      <span>{Math.floor(Math.random() * 1000)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Popular Landing Pages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="dashboard-card overflow-hidden">
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <LayoutPanelLeft size={32} className="text-muted-foreground" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">Landing Page {i + 1}</h3>
                  <p className="text-xs text-muted-foreground">By Brand Name</p>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-muted-foreground">Category: Events</span>
                    <span className="text-muted-foreground">{Math.floor(Math.random() * 500)} views</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
