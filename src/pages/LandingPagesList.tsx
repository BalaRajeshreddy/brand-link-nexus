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
import { LayoutPanelLeft, Edit, Trash, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  status: string;
  created_at: string;
  brand?: {
    name: string;
    logo: string;
  };
}

const LandingPagesList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isUserView = location.pathname.startsWith('/dashboard/user');
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("...");
  const [pages, setPages] = useState<LandingPage[]>([]);

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
            // For users, fetch all landing pages with brand info
            const { data: pages, error: fetchError } = await supabase
              .from('landing_pages')
              .select(`
                *,
                brand:brand_id (
                  name,
                  logo
                )
              `)
              .order('created_at', { ascending: false });
              
            if (fetchError) {
              throw fetchError;
            }
            
            setPages(pages || []);
          } else {
            // For brands, fetch only their landing pages
            const { data: brand } = await supabase
              .from('brands')
              .select('id')
              .eq('user_id', user.id)
              .single();

            if (!brand) {
              throw new Error('No brand found for this user');
            }

            const { data: pages, error: fetchError } = await supabase
              .from('landing_pages')
              .select('*')
              .eq('brand_id', brand.id)
              .order('created_at', { ascending: false });
              
            if (fetchError) {
              throw fetchError;
            }
            
            setPages(pages || []);
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
    if (!isUserView) { // Only brands can delete landing pages
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this landing page? All associated data (QR codes, page views, etc.) will be deleted and cannot be recovered."
      );
      if (!confirmDelete) return;

      try {
        // Delete associated page views
        await supabase.from('page_views').delete().eq('landing_page_id', id);
        // Delete associated QR codes
        await supabase.from('qr_codes').delete().eq('landing_page_id', id);
        // Finally, delete the landing page
        const { error } = await supabase
          .from('landing_pages')
          .delete()
          .eq('id', id);
        if (error) throw error;
        setPages(pages.filter(page => page.id !== id));
        toast.success("Landing page and all associated data deleted successfully");
      } catch (error) {
        console.error("Error deleting landing page:", error);
        toast.error("Failed to delete landing page. Please remove all references or try again.");
      }
    }
  };

  const handleEdit = (pageId: string) => {
    if (!isUserView) { // Only brands can edit landing pages
      navigate(`/dashboard/brand/edit-page/${pageId}`);
    }
  };

  return (
    <DashboardLayout userType={isUserView ? "User" : "Brand"} userName={userName}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isUserView ? "Browse Landing Pages" : "Your Landing Pages"}
          </h1>
          {!isUserView && (
            <Button onClick={() => navigate('/dashboard/brand/create-page')}>
              Create New Landing Page
            </Button>
          )}
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : pages.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <LayoutPanelLeft className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No landing pages</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {isUserView 
                    ? "No landing pages available to browse at the moment."
                    : "Get started by creating a new landing page."}
                </p>
                {!isUserView && (
                  <div className="mt-6">
                    <Button onClick={() => navigate('/dashboard/brand/create-page')}>
                      Create Landing Page
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
                  <TableHead>URL</TableHead>
                  {isUserView && <TableHead>Brand</TableHead>}
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  {!isUserView && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <LayoutPanelLeft className="h-4 w-4 text-gray-500" />
                        <span>{page.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          /{page.slug}
                        </code>
                        <a 
                          href={`/${page.slug}`}
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary hover:text-primary/80 ml-2"
                        >
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </TableCell>
                    {isUserView && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {page.brand?.logo ? (
                            <img 
                              src={page.brand.logo} 
                              alt={page.brand.name}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-xs font-medium">
                                {page.brand?.name?.charAt(0) || '?'}
                              </span>
                            </div>
                          )}
                          <span className="text-sm">{page.brand?.name}</span>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        page.status === 'PUBLISHED' 
                          ? 'bg-green-100 text-green-800'
                          : page.status === 'DRAFT'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {page.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(page.created_at).toLocaleDateString()}</TableCell>
                    {!isUserView && (
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(page.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(page.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(`/${page.slug}`, '_blank')}
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

export default LandingPagesList;
