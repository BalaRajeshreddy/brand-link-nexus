
import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductDesign() {
  const [products, setProducts] = useState([
    { id: 'demo-1', title: 'Demo Product', lastUpdated: '2 days ago' },
    { id: 'demo-2', title: 'Product Showcase', lastUpdated: '1 week ago' }
  ]);

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

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader className="pb-2">
              <CardTitle>{product.title}</CardTitle>
            </CardHeader>
            <CardContent className="h-36 bg-muted/30 flex items-center justify-center text-muted-foreground">
              Product Preview
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <div className="text-sm text-muted-foreground">Updated {product.lastUpdated}</div>
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
    </DashboardLayout>
  );
}
