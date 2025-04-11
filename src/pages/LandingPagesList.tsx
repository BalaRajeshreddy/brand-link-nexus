
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Eye, QrCode } from "lucide-react";
import { format } from "date-fns";

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  updated_at: string;
  published: boolean;
}

const LandingPagesList = () => {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("...");
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPages = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserName(user.user_metadata?.name || user.email?.split('@')[0] || "Brand User");
          
          // Get pages
          const { data, error } = await supabase
            .from('landing_pages')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          if (error) throw error;
          
          if (data) {
            setPages(data);
          }
        } else {
          toast.error("Not authenticated");
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error fetching pages:", error);
        toast.error("Failed to load landing pages");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPages();
  }, [navigate]);
  
  const handleDeletePage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('landing_pages')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setPages(pages.filter(page => page.id !== id));
      toast.success("Landing page deleted");
    } catch (error) {
      console.error("Error deleting page:", error);
      toast.error("Failed to delete landing page");
    }
  };
  
  const handleEditPage = (id: string) => {
    navigate(`/dashboard/brand/edit-page/${id}`);
  };
  
  const handleViewPage = (slug: string) => {
    // In a real implementation, this would navigate to the public URL of the page
    toast.info(`Viewing page with slug: ${slug} (Would open landing page in new tab)`);
  };
  
  const handleCreateQR = (pageId: string, pageTitle: string) => {
    // Navigate to QR creator with page reference
    navigate(`/dashboard/brand/create-qr?pageId=${pageId}&pageTitle=${encodeURIComponent(pageTitle)}`);
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
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Landing Pages</h1>
          <Button asChild>
            <Link to="/dashboard/brand/create-page">
              <Plus className="h-4 w-4 mr-2" />
              Create Landing Page
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Landing Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {pages.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((page) => (
                    <TableRow key={page.id}>
                      <TableCell>{page.title}</TableCell>
                      <TableCell>{page.slug}</TableCell>
                      <TableCell>{format(new Date(page.created_at), 'MM/dd/yyyy')}</TableCell>
                      <TableCell>
                        <Badge variant={page.published ? "default" : "secondary"}>
                          {page.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            title="Edit Page"
                            onClick={() => handleEditPage(page.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            title="View Page"
                            onClick={() => handleViewPage(page.slug)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            title="Create QR Code"
                            onClick={() => handleCreateQR(page.id, page.title)}
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            title="Delete Page"
                            onClick={() => handleDeletePage(page.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>You haven't created any landing pages yet.</p>
                <Button className="mt-4" asChild>
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
