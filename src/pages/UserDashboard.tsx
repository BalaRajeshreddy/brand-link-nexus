import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Brand {
  id: string;
  name: string;
  logo: string;
}

interface QRCode {
  id: string;
  title: string;
  brand: Brand;
  views: number;
  created_at: string;
}

interface LandingPage {
  id: string;
  title: string;
  brand: Brand;
  views: number;
  created_at: string;
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("...");

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data.session) {
          toast.error("You need to be logged in to access this page");
          navigate("/auth");
          return;
        }
        
        // Session exists, get user data
        const { user } = data.session;
        if (user) {
          setUserName(user.user_metadata?.name || user.email?.split('@')[0] || "User");
          
          // Fetch user's data
          await Promise.all([
            fetchBrands(),
            fetchQRCodes(),
            fetchLandingPages()
          ]);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Authentication failed");
        navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchBrands = async () => {
    try {
      console.log('Fetching brands...');
      const { data, error } = await supabase
        .from('brands')
        .select('id, name, logo')
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('Error fetching brands:', error);
        throw error;
      }
      console.log('Brands fetched:', data);
      setBrands(data || []);
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast.error('Failed to load brands');
    }
  };

  const fetchQRCodes = async () => {
    try {
      console.log('Fetching QR codes...');
      const { data, error } = await supabase
        .from('qr_codes')
        .select(`
          id,
          title,
          url,
          created_at,
          views,
          brand:brands (
            id,
            name,
            logo
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching QR codes:', error);
        throw error;
      }
      console.log('QR codes fetched:', data);
      
      // Transform the data to match our interface (do not filter out null brands)
      const transformedData = (data || []).map((qr: any) => ({
        id: qr.id,
        title: qr.title,
        brand: qr.brand,
        views: qr.views || 0,
        created_at: qr.created_at
      }));
      
      console.log('Transformed QR codes:', transformedData);
      setQRCodes(transformedData);
    } catch (error) {
      console.error('Error fetching QR codes:', error);
      toast.error('Failed to load QR codes');
    }
  };

  const fetchLandingPages = async () => {
    try {
      console.log('Fetching landing pages...');
      const { data, error } = await supabase
        .from('landing_pages')
        .select(`
          id,
          title,
          slug,
          created_at,
          brand:brands (
            id,
            name,
            logo
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching landing pages:', error);
        throw error;
      }
      console.log('Landing pages fetched:', data);
      
      // Transform the data to match our interface (do not filter out null brands)
      const transformedData = (data || []).map((page: any) => ({
        id: page.id,
        title: page.title,
        brand: page.brand,
        views: 0, // We'll need to fetch this separately if needed
        created_at: page.created_at
      }));
      
      console.log('Transformed landing pages:', transformedData);
      setLandingPages(transformedData);
    } catch (error) {
      console.error('Error fetching landing pages:', error);
      toast.error('Failed to load landing pages');
    }
  };

  const filteredQRCodes = qrCodes.filter(qr => {
    const matchesSearch = qr.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = !selectedBrand || (qr.brand && qr.brand.id === selectedBrand);
    return matchesSearch && matchesBrand;
  });

  const filteredLandingPages = landingPages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = !selectedBrand || (page.brand && page.brand.id === selectedBrand);
    return matchesSearch && matchesBrand;
  });

  if (isLoading) {
    return (
      <DashboardLayout userType="User" userName={userName}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="User" userName={userName}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Search QR codes and landing pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">All Brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>QR Codes</CardTitle>
              <CardDescription>Your QR code collection</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredQRCodes.length === 0 ? (
                <p className="text-muted-foreground">No QR codes found</p>
              ) : (
                <div className="space-y-4">
                  {filteredQRCodes.map((qr) => (
                    <div key={qr.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {qr.brand?.logo && (
                          <img
                            src={qr.brand.logo}
                            alt={qr.brand.name}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <h3 className="font-medium">{qr.title}</h3>
                          <p className="text-sm text-muted-foreground">{qr.brand?.name || 'Unknown Brand'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{qr.views || 0}</p>
                        <p className="text-sm text-muted-foreground">views</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Landing Pages</CardTitle>
              <CardDescription>Your landing page collection</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLandingPages.length === 0 ? (
                <p className="text-muted-foreground">No landing pages found</p>
              ) : (
                <div className="space-y-4">
                  {filteredLandingPages.map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {page.brand?.logo && (
                          <img
                            src={page.brand.logo}
                            alt={page.brand.name}
                            className="w-10 h-10 rounded-full"
                          />
                        )}
                        <div>
                          <h3 className="font-medium">{page.title}</h3>
                          <p className="text-sm text-muted-foreground">{page.brand?.name || 'Unknown Brand'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{page.views || 0}</p>
                        <p className="text-sm text-muted-foreground">views</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
