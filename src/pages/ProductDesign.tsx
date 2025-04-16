
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProductDesign {
  id: string;
  title: string;
  content: {
    title: string;
    components: any[];
    pageSettings: {
      backgroundColor: string;
      fontFamily: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export default function ProductDesign() {
  const [products, setProducts] = useState<ProductDesign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.error("No authenticated session found");
          setLoading(false);
          return;
        }

        // Fetch user's product designs
        const { data, error } = await supabase
          .from('product_designs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching products:", error);
          toast.error("Failed to load product designs");
          setLoading(false);
          return;
        }

        setProducts(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error in fetchProducts:", error);
        toast.error("An unexpected error occurred");
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <DashboardLayout userType="Brand" userName="Brand User">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Product Design Studio</h1>
          <p className="text-muted-foreground">Create and manage interactive product experiences</p>
        </div>
        <Link to="/dashboard/brand/product-design/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Product Page
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading product designs...</p>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-muted/30 rounded-lg p-12 text-center">
          <h3 className="text-lg font-medium mb-2">No product pages yet</h3>
          <p className="text-muted-foreground mb-6">Create your first interactive product page to showcase your products</p>
          <Link to="/dashboard/brand/product-design/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Product Page
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader className="pb-2">
                <CardTitle>{product.content.title || product.title}</CardTitle>
              </CardHeader>
              <CardContent 
                className="h-36 bg-muted/30 flex items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: product.content.pageSettings?.backgroundColor || "#FFFFFF",
                  fontFamily: product.content.pageSettings?.fontFamily || "Inter, sans-serif"
                }}
              >
                {product.content.components && product.content.components.length > 0 ? (
                  <div className="text-center p-4 w-full">
                    <div className="text-sm font-medium">
                      {product.content.components.length} components
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Click Edit to view full design
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">Product Preview</div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  Updated {formatDate(product.updated_at || product.created_at)}
                </div>
                <div className="flex gap-2">
                  <Link to={`/dashboard/brand/product-design/edit/${product.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <Button variant="ghost" size="sm">Preview</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
