
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface Product {
  name: string;
  description: string;
  image: string;
  price: string;
  link: string;
}

interface ProductsBlockProps {
  content: {
    products: Product[];
    displayType: string;
  };
  styles: Record<string, any>;
}

export const ProductsBlock = ({ content, styles }: ProductsBlockProps) => {
  const getGridColumns = () => {
    const numProducts = content.products.length;
    if (numProducts <= 1) return 'grid-cols-1';
    if (numProducts === 2) return 'grid-cols-2';
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
  };

  const renderGrid = () => (
    <div 
      className={`grid ${getGridColumns()} gap-4`}
      style={{ gap: styles.gap || '16px' }}
    >
      {content.products.map((product, index) => (
        <Card 
          key={index}
          style={{ 
            backgroundColor: styles.cardBgColor || '#FFFFFF',
            borderRadius: styles.cardBorderRadius || '8px',
          }}
        >
          <AspectRatio ratio={4/3}>
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="object-cover w-full h-full rounded-t-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-t-lg">
                <ShoppingCart className="h-10 w-10 text-gray-400" />
              </div>
            )}
          </AspectRatio>
          <CardContent className="p-4">
            <h3 className="font-medium text-lg mb-1" style={{ color: styles.textColor || '#000000' }}>
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
            <p className="font-bold">${product.price}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button 
              asChild 
              className="w-full"
            >
              <a href={product.link} target="_blank" rel="noopener noreferrer">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Now
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const renderList = () => (
    <div className="space-y-4" style={{ gap: styles.gap || '16px' }}>
      {content.products.map((product, index) => (
        <Card 
          key={index}
          style={{ 
            backgroundColor: styles.cardBgColor || '#FFFFFF',
            borderRadius: styles.cardBorderRadius || '8px',
          }}
        >
          <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/3">
              {product.image ? (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="object-cover w-full h-full sm:rounded-l-lg sm:rounded-r-none rounded-t-lg sm:rounded-t-none"
                />
              ) : (
                <div className="w-full h-full min-h-[150px] bg-gray-200 flex items-center justify-center sm:rounded-l-lg sm:rounded-r-none rounded-t-lg sm:rounded-t-none">
                  <ShoppingCart className="h-10 w-10 text-gray-400" />
                </div>
              )}
            </div>
            <div className="sm:w-2/3 p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-lg" style={{ color: styles.textColor || '#000000' }}>
                  {product.name}
                </h3>
                <p className="font-bold">${product.price}</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
              <Button 
                asChild 
                className="w-full sm:w-auto"
              >
                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy Now
                </a>
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div 
      className="products-block w-full my-4"
      style={{
        backgroundColor: styles.backgroundColor || 'transparent',
        padding: styles.padding || '16px',
        borderRadius: styles.borderRadius || '8px',
      }}
    >
      {content.displayType === 'list' ? renderList() : renderGrid()}
    </div>
  );
};
