import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@shared/schema";
import { useCartContext } from "@/context/cart-context";
import { useState } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    addToCart(product.id, 1).finally(() => {
      setIsAdding(false);
    });
  };

  // Determine if there's a discount
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  return (
    <Card className="overflow-hidden h-full transition-all hover:shadow-md">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden bg-muted">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="object-cover w-full h-full transition-transform hover:scale-105 duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-muted text-muted-foreground">
              No image
            </div>
          )}
          
          {hasDiscount && (
            <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600">
              {discountPercentage}% OFF
            </Badge>
          )}
          
          {product.featured && (
            <Badge variant="outline" className="absolute top-2 left-2 bg-background/80">
              Featured
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <div className="flex items-center gap-1 mb-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
              <span>{product.rating ? product.rating.toFixed(1) : "New"}</span>
            </div>
            {product.quantity <= 0 && (
              <Badge variant="outline" className="ml-auto border-red-200 text-red-500">
                Out of Stock
              </Badge>
            )}
          </div>

          <h3 className="font-medium leading-tight text-base mb-1 line-clamp-2">{product.name}</h3>
          
          <div className="mt-2 flex items-center">
            <div className="font-semibold">
              {formatCurrency(product.price)}
            </div>
            {hasDiscount && (
              <div className="ml-2 text-sm text-muted-foreground line-through">
                {formatCurrency(product.compareAtPrice!)}
              </div>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1"
          disabled={isAdding || product.quantity <= 0}
          onClick={handleAddToCart}
        >
          {isAdding ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding
            </span>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <Heart className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to Wishlist</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
