import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Edit, ExternalLink, Info, Share2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LandingPage {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  published: boolean;
}

const LandingPagesList = () => {
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("...");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          toast.error("You need to be logged in to view this page");
          navigate("/auth");
          return;
        }
        
        const { user } = data.session;
        if (user) {
          setUserName(user.user_metadata?.name || user.email?.split('@')[0] || "Brand User");
          fetchPages(user.id);
        }
      } catch (error) {
        console.error("Authentication error:", error);
        toast.error("Authentication failed");
        navigate("/auth");
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchPages = async (userId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPages(data || []);
    } catch (error) {
      console.error("Error fetching landing pages:", error);
      toast.error("Failed to load landing pages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePage = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this landing page? All associated data (QR codes, page views, etc.) will be deleted and cannot be recovered."
    );
    if (!confirmDelete) return;
    try {
      // Delete associated page views
      await supabase.from('page_views').delete().eq('landing_page_id', id);
      // Delete associated QR codes
      await supabase.from('qr_codes').delete().eq('landing_page_id', id);
      // You can add more deletes for other related tables if needed
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
  };

  const handleEdit = (pageId: string) => {
    navigate(`/dashboard/brand/edit-page/${pageId}`);
  };

  return (
    <DashboardLayout userType="Brand" userName={userName}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Landing Pages</h1>
            <p className="text-muted-foreground mt-1">Manage your landing pages</p>
          </div>
          <Button onClick={() => navigate("/dashboard/brand/create-page")}>
            Create New Page
          </Button>
        </div>

        <Separator className="mb-6" />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : pages.length === 0 ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-center text-muted-foreground">
                <Info className="mr-2" />
                <CardTitle>No Landing Pages Found</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <p>You haven't created any landing pages yet.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate("/dashboard/brand/create-page")}>
                Create Your First Landing Page
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Card key={page.id}>
                <CardHeader>
                  <CardTitle>{page.title}</CardTitle>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {new Date(page.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">Page URL:</p>
                  <div className="bg-muted rounded-md p-2 flex items-center justify-between">
                    <code className="text-xs truncate">
                      {`${window.location.origin}/${page.slug}`}
                    </code>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(page.id)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDeletePage(page.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LandingPagesList;
