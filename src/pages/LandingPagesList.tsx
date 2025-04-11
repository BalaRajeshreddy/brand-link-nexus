
import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useNavigate, Link } from "react-router-dom";
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
import { LayoutPanelLeft, Edit, Trash, QrCode, Eye, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  updated_at: string;
  published: boolean;
}

const LandingPagesList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("...");
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);

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
          
          // Fetch landing pages for the user
          const { data: pages, error: fetchError } = await supabase
            .from('landing_pages')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (fetchError) {
            throw fetchError;
          }
          
          setLandingPages(pages || []);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('landing_pages')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setLandingPages(prevPages => prevPages.filter(page => page.id !== id));
      toast.success("Landing page deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete landing page");
    }
  };

  const getPageUrl = (slug: string) => {
    // Use current domain for the URL
    return `${window.location.origin}/${slug}`;
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
    <DashboardLayout userType="Brand" userName={userName}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Landing Pages</h1>
          <Link to="/dashboard/brand/create-page">
            <Button className="gap-2">
              <LayoutPanelLeft size={16} />
              Create New Page
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Landing Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {landingPages.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {landingPages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <code className="bg-muted px-1 py-0.5 rounded text-sm">
                            /{page.slug}
                          </code>
                          <a 
                            href={getPageUrl(page.slug)} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(page.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${page.published ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                          {page.published ? 'Published' : 'Draft'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/dashboard/brand/edit-page/${page.id}`)}
                            title="Edit"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/dashboard/brand/create-qr?pageId=${page.id}`)}
                            title="Create QR Code"
                          >
                            <QrCode size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(getPageUrl(page.slug), '_blank')}
                            title="Preview"
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(page.id)}
                            title="Delete"
                          >
                            <Trash size={16} className="text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 space-y-4">
                <LayoutPanelLeft className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="text-lg font-medium">No landing pages yet</h3>
                <p className="text-muted-foreground">You haven't created any landing pages yet.</p>
                <Button asChild>
                  <Link to="/dashboard/brand/create-page">Create Your First Page</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default LandingPagesList;
