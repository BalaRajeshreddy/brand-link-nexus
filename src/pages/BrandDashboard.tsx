import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { QrCode, LayoutPanelLeft, Folder, BarChart2, Plus, Mail, Eye, MousePointerClick, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FileUpload } from '@/components/ui/FileUpload';
import { ImageTextContent } from '@/components/ui/ImageTextContent';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';

const BrandDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("...");
  const [isLoading, setIsLoading] = useState(true);
  const [brandId, setBrandId] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>({
    totalViews: 0,
    totalQRScans: 0,
    totalClicks: 0,
    totalSubmissions: 0,
    perPage: [],
    landingPages: [],
    recentQRCodes: []
  });
  const [brand, setBrand] = useState({
    logo: '',
    images: [],
    content: []
  });

  // Ensure brand row exists for this user (safe, server-side check)
  useEffect(() => {
    async function ensureBrandRow() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Try to find brand by user_id
      let { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      // If not found, try to find by email and update with user_id
      if (!brand) {
        const { data: brandByEmail } = await supabase
          .from('brands')
          .select('id')
          .eq('email', user.email)
          .maybeSingle();
        if (brandByEmail) {
          await supabase.from('brands').update({ user_id: user.id }).eq('id', brandByEmail.id);
        }
      }
    }
    ensureBrandRow();
  }, []);

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
          setUserName(user.user_metadata?.name || user.email?.split('@')[0] || "Brand User");
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

  useEffect(() => {
    async function fetchBrandAndAnalytics() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserName(user.user_metadata?.name || user.email?.split('@')[0] || "Brand User");
      
      // Get brand id
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (brandError) {
        console.error('Error fetching brand:', brandError);
        toast.error('Failed to load brand data');
        setIsLoading(false);
        return;
      }

      if (!brand) {
        toast.error('No brand found for this user');
        setIsLoading(false);
        return;
      }

      setBrandId(brand.id);

      try {
        // Fetch landing pages for this brand
        const { data: landingPages, error: landingError } = await supabase
          .from('landing_pages')
          .select('id, title, slug, created_at')
          .eq('brand_id', brand.id)
          .order('created_at', { ascending: false });

        if (landingError) throw landingError;

        // Fetch recent QR codes for this brand
        const { data: recentQRCodes, error: qrError } = await supabase
          .from('qr_codes')
          .select('id, title, url, created_at')
          .eq('brand_id', brand.id)
          .order('created_at', { ascending: false });

        if (qrError) throw qrError;

        // Fetch total analytics counts
        const [
          { count: totalViews },
          { count: totalQRScans },
          { count: totalClicks },
          { count: totalSubmissions },
          { count: registeredViews },
          { count: unregisteredViews },
          { count: registeredScans },
          { count: unregisteredScans }
        ] = await Promise.all([
          supabase.from('landing_page_views').select('id', { count: 'exact', head: true }).eq('brand_id', brand.id),
          supabase.from('qr_scans').select('id', { count: 'exact', head: true }).eq('brand_id', brand.id),
          supabase.from('page_clicks').select('id', { count: 'exact', head: true }).eq('brand_id', brand.id),
          supabase.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('brand_id', brand.id),
          supabase.from('landing_page_views').select('user_id', { count: 'exact', head: true }).eq('brand_id', brand.id).eq('is_registered', true),
          supabase.from('landing_page_views').select('id', { count: 'exact', head: true }).eq('brand_id', brand.id).eq('is_registered', false),
          supabase.from('qr_scans').select('user_id', { count: 'exact', head: true }).eq('brand_id', brand.id).eq('is_registered', true),
          supabase.from('qr_scans').select('id', { count: 'exact', head: true }).eq('brand_id', brand.id).eq('is_registered', false),
        ]);

        setAnalytics(prev => ({
          ...prev,
          totalViews: totalViews || 0,
          totalQRScans: totalQRScans || 0,
          totalClicks: totalClicks || 0,
          totalSubmissions: totalSubmissions || 0,
          registeredViews: registeredViews || 0,
          unregisteredViews: unregisteredViews || 0,
          registeredScans: registeredScans || 0,
          unregisteredScans: unregisteredScans || 0,
          landingPages: landingPages || [],
          recentQRCodes: recentQRCodes || []
        }));
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchBrandAndAnalytics();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout userType="Brand" userName="...">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="Brand" userName={userName}>
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
          <div>
            <StatsCard 
              title="Total Page Views" 
              value={analytics.totalViews}
              icon={<Eye className="h-5 w-5 text-primary-blue" />} 
            />
            <div className="text-xs text-muted-foreground mt-1">
              Registered: {analytics.registeredViews || 0} | Unregistered: {analytics.unregisteredViews || 0}
            </div>
          </div>
          <div>
            <StatsCard 
              title="QR Scans" 
              value={analytics.totalQRScans}
              icon={<QrCode className="h-5 w-5 text-primary-green" />} 
            />
            <div className="text-xs text-muted-foreground mt-1">
              Registered: {analytics.registeredScans || 0} | Unregistered: {analytics.unregisteredScans || 0}
            </div>
          </div>
          <StatsCard 
            title="Page Clicks" 
            value={analytics.totalClicks}
            icon={<MousePointerClick className="h-5 w-5 text-primary-orange" />} 
          />
          <Link to="/dashboard/brand/submissions" style={{ textDecoration: 'none' }}>
            <StatsCard 
              title="Form Submissions" 
              value={analytics.totalSubmissions}
              icon={<Mail className="h-5 w-5 text-primary-indigo" />} 
            />
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Recently Added Landing Pages */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Recently Added Landing Pages</h2>
            {analytics.landingPages && analytics.landingPages.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {analytics.landingPages.slice(0, 3).map(page => (
                  <li key={page.id} className="py-2 flex items-center justify-between gap-2">
                    <span>{page.title}</span>
                    <div className="flex gap-2">
                      <a
                        href={`/${page.slug || page.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        View
                      </a>
                      <a
                        href={`/dashboard/brand/edit-page/${page.id}`}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        Edit
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-muted-foreground">No landing pages found.</div>
            )}
          </div>
          {/* Recently Created QR Codes */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4">Recently Created QR Codes</h2>
            {analytics.recentQRCodes && analytics.recentQRCodes.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {analytics.recentQRCodes.slice(0, 3).map(qr => (
                  <li key={qr.id} className="py-2 flex items-center justify-between gap-2">
                    <span>{qr.title}</span>
                    <div className="flex gap-2">
                      <a
                        href={qr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        View
                      </a>
                      <a
                        href={`/dashboard/brand/edit-qr/${qr.id}`}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        Edit
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-muted-foreground">No QR codes found.</div>
            )}
          </div>
        </div>
        <Tabs defaultValue="media">
          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Assets</CardTitle>
                <CardDescription>Upload and manage your brand assets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Logo</Label>
                    <FileUpload
                      onFileSelect={(url) => {
                        setBrand(prev => ({
                          ...prev,
                          logo: url
                        }));
                      }}
                      accept="image/*"
                      folder="brand-logos"
                      maxSize={5}
                    />
                    {brand.logo && (
                      <div className="mt-4">
                        <img
                          src={brand.logo}
                          alt="Brand logo"
                          className="w-32 h-32 object-contain rounded-lg"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <Label>Brand Images</Label>
                    <FileUpload
                      onFileSelect={(url) => {
                        setBrand(prev => ({
                          ...prev,
                          images: [...(prev.images || []), url]
                        }));
                      }}
                      accept="image/*"
                      folder="brand-images"
                      maxSize={10}
                    />
                    {brand.images?.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        {brand.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Brand image ${index + 1}`}
                              className="w-full aspect-square object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setBrand(prev => ({
                                  ...prev,
                                  images: prev.images?.filter((_, i) => i !== index)
                                }));
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Brand Content</CardTitle>
                <CardDescription>Create and manage your brand content</CardDescription>
              </CardHeader>
              <CardContent>
                <ImageTextContent
                  onContentChange={(content) => {
                    setBrand(prev => ({
                      ...prev,
                      content: content
                    }));
                  }}
                  initialContent={brand.content || []}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BrandDashboard;