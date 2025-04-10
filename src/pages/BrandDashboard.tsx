
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, LayoutPanelLeft, Folder, BarChart2, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const BrandDashboard = () => {
  return (
    <DashboardLayout userType="Brand" userName="Acme Inc.">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex gap-2">
            <Link to="/dashboard/brand/create-qr">
              <Button className="gap-2">
                <Plus size={16} />
                Create QR Code
              </Button>
            </Link>
            <Link to="/dashboard/brand/create-page">
              <Button variant="outline" className="gap-2">
                <Plus size={16} />
                Create Page
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total QR Codes" 
            value="24"
            icon={<QrCode className="h-5 w-5 text-primary-blue" />}
            trend={{ value: "12% increase", positive: true }}
          />
          <StatsCard 
            title="Total Scans" 
            value="1,254"
            icon={<BarChart2 className="h-5 w-5 text-primary-green" />}
            trend={{ value: "8% increase", positive: true }}
          />
          <StatsCard 
            title="Landing Pages" 
            value="8"
            icon={<LayoutPanelLeft className="h-5 w-5 text-primary-orange" />}
            trend={{ value: "2 new", positive: true }}
          />
          <StatsCard 
            title="Storage Used" 
            value="56MB"
            icon={<Folder className="h-5 w-5 text-primary-indigo" />}
            trend={{ value: "2.4GB free", positive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent QR Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center p-2 hover:bg-muted rounded-md">
                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                      <QrCode size={20} />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium">Product QR Code {i}</p>
                      <p className="text-xs text-muted-foreground">Created 3 days ago</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      124 scans
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild>
                <Link to="/dashboard/brand/qr-codes">View all QR codes</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Landing Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center p-2 hover:bg-muted rounded-md">
                    <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center">
                      <LayoutPanelLeft size={20} />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm font-medium">Product Landing Page {i}</p>
                      <p className="text-xs text-muted-foreground">Created 2 days ago</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      56 views
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" asChild>
                <Link to="/dashboard/brand/landing-pages">View all pages</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BrandDashboard;
