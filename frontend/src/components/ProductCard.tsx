import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Tag } from "lucide-react";
import { Product } from '@/types';
import { format } from 'date-fns';

interface ProductCardProps {
  product: Product;
}

// Your backend base URL (you could make this an environment variable later)
const BASE_URL = 'http://localhost:8080';

const ProductCard = ({ product }: ProductCardProps) => {
  const latestVersion = product.versions?.length ? product.versions[product.versions.length - 1] : null;

  // Final computed image URL
  const imageUrl = product.image
    ? `${BASE_URL}/${product.image}`  // If product has an image
    : '/default-product.png';          // Else show fallback image (you can put a default-product.png in your public folder)

  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden bg-secondary/20">
          <img 
            src={imageUrl}
            alt={product.name || 'Product Image'} 
            className="object-cover w-full h-full"
          />
          {product.versions?.length > 0 && (
            <Badge className="absolute top-2 right-2 bg-primary">
              {product.versions.length} {product.versions.length === 1 ? 'version' : 'versions'}
            </Badge>
          )}
        </div>
        
        <CardHeader className="p-4 pb-0">
          <h3 className="font-medium text-lg truncate">{product.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Tag className="h-3.5 w-3.5" />
            <span>${product.price.toFixed(2)}</span>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 pt-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description || "No description available."}
          </p>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Last updated: {format(new Date(product.updatedAt), 'MMM d, yyyy')}</span>
          </div>
          {latestVersion && (
            <Badge variant="outline" className="text-xs bg-secondary/50">
              v{latestVersion.versionNumber}
            </Badge>
          )}
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
