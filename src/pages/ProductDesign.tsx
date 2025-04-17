
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, ExternalLink, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductComponentRenderer } from "@/components/product-builder/ProductComponentRenderer";

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
  const [previewProduct, setPreviewProduct] = useState<ProductDesign | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No authenticated session found");
        toast.error("You need to be logged in to view your product designs");
        setLoading(false);
        return;
      }

      // Fetch user's product designs
      const { data, error } = await supabase
        .from('product_designs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load product designs");
        setLoading(false);
        return;
      }

      // Validate the data structure
      const validProducts = data?.map(product => {
        // Ensure content has the expected structure
        if (!product.content) {
          product.content = { 
            title: product.title,
            components: [],
            pageSettings: { backgroundColor: "#FFFFFF", fontFamily: "Inter, sans-serif" }
          };
        }
        
        // Ensure pageSettings exists
        if (!product.content.pageSettings) {
          product.content.pageSettings = { 
            backgroundColor: "#FFFFFF", 
            fontFamily: "Inter, sans-serif" 
          };
        }

        return product;
      }) || [];

      console.log("Fetched products:", validProducts);
      setProducts(validProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error in fetchProducts:", error);
      toast.error("An unexpected error occurred");
      setLoading(false);
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('product_designs')
        .delete()
        .eq('id', productId);

      if (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete product design");
        return;
      }

      toast.success("Product design deleted successfully");
      // Refresh the list
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product design");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    
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

  const openPreview = (product: ProductDesign) => {
    setPreviewProduct(product);
    setShowPreview(true);
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
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle>{product.content?.title || product.title}</CardTitle>
              </CardHeader>
              <CardContent 
                className="h-36 flex items-center justify-center overflow-hidden cursor-pointer relative group"
                style={{
                  backgroundColor: product.content?.pageSettings?.backgroundColor || "#FFFFFF",
                  fontFamily: product.content?.pageSettings?.fontFamily || "Inter, sans-serif"
                }}
                onClick={() => openPreview(product)}
              >
                {product.content?.components && product.content.components.length > 0 ? (
                  <>
                    <div className="text-center p-4 w-full">
                      <div className="text-sm font-medium">
                        {product.content.components.length} components
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {product.content.components.slice(0, 3).map(c => c.type).join(", ")}
                        {product.content.components.length > 3 ? "..." : ""}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="flex items-center gap-2">
                        <Eye size={16} />
                        Preview
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground">Empty Product Design</div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Updated {formatDate(product.updated_at || product.created_at)}
                </div>
                <div className="flex gap-2">
                  <Link to={`/dashboard/brand/product-design/edit/${product.id}`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to delete this product design?")) {
                        handleDeleteProduct(product.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Product Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-3xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewProduct?.title || "Product Preview"}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 overflow-auto">
            {previewProduct && previewProduct.content?.components && (
              <div 
                className="w-full overflow-y-auto p-4 rounded-lg"
                style={{
                  backgroundColor: previewProduct.content.pageSettings?.backgroundColor || "#FFFFFF",
                  fontFamily: previewProduct.content.pageSettings?.fontFamily || "Inter, sans-serif"
                }}
              >
                <div className="space-y-4 max-w-3xl mx-auto">
                  {previewProduct.content.components.map((component) => (
                    <div key={component.id} className="bg-white shadow rounded-lg overflow-hidden">
                      <ProductComponentRenderer
                        type={component.type}
                        content={component.content}
                        styles={component.styles}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end">
            <Link to={`/dashboard/brand/product-design/edit/${previewProduct?.id}`}>
              <Button className="mr-2">
                <ExternalLink className="w-4 h-4 mr-2" />
                Edit This Product
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
