import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QrCode, Edit, Trash, Download, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QRCode {
  id: string;
  title: string;
  description: string | null;
  url: string;
  views: number;
  created_at: string;
  landing_page: {
    title: string;
    slug: string;
  } | null;
  brand?: {
    name: string;
    logo: string;
  };
}

const QRCodesList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isUserView = location.pathname.startsWith('/dashboard/user');
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("...");
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);

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
          
          if (isUserView) {
            // For users, fetch all QR codes with brand info
            const { data: codes, error: fetchError } = await supabase
              .from('qr_codes')
              .select(`
                *,
                landing_page:landing_page_id (
                  title,
                  slug
                ),
                brand:brand_id (
                  name,
                  logo
                )
              `)
              .order('created_at', { ascending: false });
              
            if (fetchError) {
              throw fetchError;
            }
            
            setQRCodes(codes || []);
          } else {
            // For brands, fetch only their QR codes
            const { data: brand } = await supabase
              .from('brands')
              .select('id')
              .eq('user_id', user.id)
              .single();

            if (!brand) {
              throw new Error('No brand found for this user');
            }

            const { data: codes, error: fetchError } = await supabase
              .from('qr_codes')
              .select(`
                *,
                landing_page:landing_page_id (
                  title,
                  slug
                )
              `)
              .eq('brand_id', brand.id)
              .order('created_at', { ascending: false });
              
            if (fetchError) {
              throw fetchError;
            }
            
            setQRCodes(codes || []);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, isUserView]);

  const handleDelete = async (id: string) => {
    if (!isUserView) { // Only brands can delete QR codes
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this QR code? This action cannot be undone."
      );
      if (!confirmDelete) return;

      try {
        const { error } = await supabase
          .from('qr_codes')
          .delete()
          .eq('id', id);

        if (error) throw error;

        setQRCodes(qrCodes.filter(qr => qr.id !== id));
        toast.success("QR code deleted successfully");
      } catch (error) {
        console.error("Error deleting QR code:", error);
        toast.error("Failed to delete QR code");
      }
    }
  };

  const handleEdit = (id: string) => {
    if (!isUserView) { // Only brands can edit QR codes
      navigate(`/dashboard/brand/edit-qr/${id}`);
    }
  };

  // Generate QR image URL (same as QRCustomizer)
  const getQRImageUrl = (qr) => {
    // You may want to store color/backgroundColor in the QR code record in the future
    const size = 300;
    const color = '3F51B5'; // default blue
    const backgroundColor = 'FFFFFF'; // default white
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(qr.url)}&bgcolor=${backgroundColor}&color=${color}`;
  };

  // Download handler
  const handleDownload = async (qr) => {
    const qrImageUrl = getQRImageUrl(qr);
    // Sanitize the QR code title for use as a filename
    const safeTitle = (qr.title || 'qrcode')
      .toLowerCase()
      .replace(/[^a-z0-9\-_]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 50) || 'qrcode';
    const filename = `${safeTitle}.png`;
    try {
      const response = await fetch(qrImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      if (typeof toast === 'function') toast('Failed to download QR code image.');
    }
  };

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
    <DashboardLayout userType={isUserView ? "User" : "Brand"} userName={userName}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isUserView ? "Browse QR Codes" : "Your QR Codes"}
          </h1>
          {!isUserView && (
            <Button onClick={() => navigate('/dashboard/brand/create-qr')}>
              Create New QR Code
            </Button>
          )}
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : qrCodes.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <QrCode className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No QR codes</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {isUserView 
                    ? "No QR codes available to browse at the moment."
                    : "Get started by creating a new QR code."}
                </p>
                {!isUserView && (
                  <div className="mt-6">
                    <Button onClick={() => navigate('/dashboard/brand/create-qr')}>
                      Create QR Code
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>URL/Landing Page</TableHead>
                  {isUserView && <TableHead>Brand</TableHead>}
                  <TableHead>Views</TableHead>
                  <TableHead>Created</TableHead>
                  {!isUserView && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {qrCodes.map((qr) => (
                  <TableRow key={qr.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-gray-500" />
                        <span>{qr.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {qr.landing_page ? (
                        <div>
                          <p className="text-sm">{qr.landing_page.title}</p>
                          <div className="flex items-center mt-1">
                            <code className="text-xs bg-muted px-1 py-0.5 rounded">
                              /{qr.landing_page.slug}
                            </code>
                            <a 
                              href={qr.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-primary hover:text-primary/80 ml-2"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="text-sm truncate max-w-[200px]">{qr.url}</span>
                          <a 
                            href={qr.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-primary hover:text-primary/80 ml-2"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      )}
                    </TableCell>
                    {isUserView && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {qr.brand?.logo ? (
                            <img 
                              src={qr.brand.logo} 
                              alt={qr.brand.name}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {qr.brand?.name?.charAt(0) || '?'}
                              </span>
                            </div>
                          )}
                          <span className="text-sm">{qr.brand?.name}</span>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>{qr.views || 0}</TableCell>
                    <TableCell>{new Date(qr.created_at).toLocaleDateString()}</TableCell>
                    {!isUserView && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(qr.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(qr.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(qr.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default QRCodesList;
