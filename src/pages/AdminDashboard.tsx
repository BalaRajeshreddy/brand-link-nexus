
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, QrCode, Building2, BarChart2 } from "lucide-react";

const AdminDashboard = () => {
  return (
    <DashboardLayout userType="Admin" userName="Admin User">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Brands" 
            value="87"
            icon={<Building2 className="h-5 w-5 text-primary-indigo" />}
            trend={{ value: "12 new this month", positive: true }}
          />
          <StatsCard 
            title="Total Users" 
            value="342"
            icon={<Users className="h-5 w-5 text-primary-blue" />}
            trend={{ value: "28 new this month", positive: true }}
          />
          <StatsCard 
            title="Total QR Codes" 
            value="1,568"
            icon={<QrCode className="h-5 w-5 text-primary-green" />}
            trend={{ value: "156 new this month", positive: true }}
          />
          <StatsCard 
            title="Total Scans" 
            value="25,842"
            icon={<BarChart2 className="h-5 w-5 text-primary-orange" />}
            trend={{ value: "3.2k this month", positive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Brands</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Acme Inc.", qrCodes: 56, scans: 2456 },
                  { name: "Tech Solutions", qrCodes: 43, scans: 1876 },
                  { name: "Global Foods", qrCodes: 38, scans: 1654 },
                  { name: "Fashion Brand", qrCodes: 32, scans: 1245 },
                  { name: "Sports Company", qrCodes: 28, scans: 987 },
                ].map((brand, index) => (
                  <div key={index} className="flex items-center hover:bg-muted rounded-md p-2">
                    <div className="h-10 w-10 bg-primary-indigo/10 rounded-full flex items-center justify-center">
                      <span className="font-medium">{index + 1}</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium">{brand.name}</p>
                      <p className="text-xs text-muted-foreground">{brand.qrCodes} QR codes</p>
                    </div>
                    <div className="text-sm font-medium">
                      {brand.scans.toLocaleString()} scans
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New brand registered", brand: "Coffee Shop", time: "2 hours ago" },
                  { action: "QR code created", brand: "Tech Solutions", time: "5 hours ago" },
                  { action: "Landing page published", brand: "Fashion Brand", time: "6 hours ago" },
                  { action: "User registered", brand: "n/a", time: "1 day ago" },
                  { action: "QR code scanned 100+ times", brand: "Global Foods", time: "1 day ago" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center hover:bg-muted rounded-md p-2">
                    <div className="w-2 h-2 rounded-full bg-primary-blue"></div>
                    <div className="ml-4 flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">By {activity.brand}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
